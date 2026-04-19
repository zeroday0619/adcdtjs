export function formatIssuedAt(issuedAt: number): string {
  const date = new Date(issuedAt);
  if (Number.isNaN(date.getTime())) {
    return "2026/04/20 - 1776643200";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const unixTimestamp = Math.floor(date.getTime() / 1000);

  return `${year}/${month}/${day} - ${unixTimestamp}`;
}

function rotateLeft(value: number, shift: number): number {
  return (value << shift) | (value >>> (32 - shift));
}

function toWordArray(input: string): number[] {
  const words: number[] = [];

  for (let index = 0; index < input.length; index += 1) {
    words[index >> 2] ??= 0;
    words[index >> 2] |= input.charCodeAt(index) << ((index % 4) * 8);
  }

  words[input.length >> 2] ??= 0;
  words[input.length >> 2] |= 0x80 << ((input.length % 4) * 8);
  words[(((input.length + 8) >> 6) + 1) * 16 - 2] = input.length * 8;

  return words;
}

function md5Cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
  return (rotateLeft((a + q + x + t) | 0, s) + b) | 0;
}

function md5Ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  return md5Cmn((b & c) | (~b & d), a, b, x, s, t);
}

function md5Gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  return md5Cmn((b & d) | (c & ~d), a, b, x, s, t);
}

function md5Hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  return md5Cmn(b ^ c ^ d, a, b, x, s, t);
}

function md5Ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
  return md5Cmn(c ^ (b | ~d), a, b, x, s, t);
}

function toHex(value: number): string {
  let hex = "";

  for (let index = 0; index < 4; index += 1) {
    const byte = (value >> (index * 8)) & 0xff;
    hex += byte.toString(16).padStart(2, "0");
  }

  return hex;
}

export function md5(input: string): string {
  const words = toWordArray(input);
  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let index = 0; index < words.length; index += 16) {
    const oldA = a;
    const oldB = b;
    const oldC = c;
    const oldD = d;

    a = md5Ff(a, b, c, d, words[index + 0] ?? 0, 7, -680876936);
    d = md5Ff(d, a, b, c, words[index + 1] ?? 0, 12, -389564586);
    c = md5Ff(c, d, a, b, words[index + 2] ?? 0, 17, 606105819);
    b = md5Ff(b, c, d, a, words[index + 3] ?? 0, 22, -1044525330);
    a = md5Ff(a, b, c, d, words[index + 4] ?? 0, 7, -176418897);
    d = md5Ff(d, a, b, c, words[index + 5] ?? 0, 12, 1200080426);
    c = md5Ff(c, d, a, b, words[index + 6] ?? 0, 17, -1473231341);
    b = md5Ff(b, c, d, a, words[index + 7] ?? 0, 22, -45705983);
    a = md5Ff(a, b, c, d, words[index + 8] ?? 0, 7, 1770035416);
    d = md5Ff(d, a, b, c, words[index + 9] ?? 0, 12, -1958414417);
    c = md5Ff(c, d, a, b, words[index + 10] ?? 0, 17, -42063);
    b = md5Ff(b, c, d, a, words[index + 11] ?? 0, 22, -1990404162);
    a = md5Ff(a, b, c, d, words[index + 12] ?? 0, 7, 1804603682);
    d = md5Ff(d, a, b, c, words[index + 13] ?? 0, 12, -40341101);
    c = md5Ff(c, d, a, b, words[index + 14] ?? 0, 17, -1502002290);
    b = md5Ff(b, c, d, a, words[index + 15] ?? 0, 22, 1236535329);

    a = md5Gg(a, b, c, d, words[index + 1] ?? 0, 5, -165796510);
    d = md5Gg(d, a, b, c, words[index + 6] ?? 0, 9, -1069501632);
    c = md5Gg(c, d, a, b, words[index + 11] ?? 0, 14, 643717713);
    b = md5Gg(b, c, d, a, words[index + 0] ?? 0, 20, -373897302);
    a = md5Gg(a, b, c, d, words[index + 5] ?? 0, 5, -701558691);
    d = md5Gg(d, a, b, c, words[index + 10] ?? 0, 9, 38016083);
    c = md5Gg(c, d, a, b, words[index + 15] ?? 0, 14, -660478335);
    b = md5Gg(b, c, d, a, words[index + 4] ?? 0, 20, -405537848);
    a = md5Gg(a, b, c, d, words[index + 9] ?? 0, 5, 568446438);
    d = md5Gg(d, a, b, c, words[index + 14] ?? 0, 9, -1019803690);
    c = md5Gg(c, d, a, b, words[index + 3] ?? 0, 14, -187363961);
    b = md5Gg(b, c, d, a, words[index + 8] ?? 0, 20, 1163531501);
    a = md5Gg(a, b, c, d, words[index + 13] ?? 0, 5, -1444681467);
    d = md5Gg(d, a, b, c, words[index + 2] ?? 0, 9, -51403784);
    c = md5Gg(c, d, a, b, words[index + 7] ?? 0, 14, 1735328473);
    b = md5Gg(b, c, d, a, words[index + 12] ?? 0, 20, -1926607734);

    a = md5Hh(a, b, c, d, words[index + 5] ?? 0, 4, -378558);
    d = md5Hh(d, a, b, c, words[index + 8] ?? 0, 11, -2022574463);
    c = md5Hh(c, d, a, b, words[index + 11] ?? 0, 16, 1839030562);
    b = md5Hh(b, c, d, a, words[index + 14] ?? 0, 23, -35309556);
    a = md5Hh(a, b, c, d, words[index + 1] ?? 0, 4, -1530992060);
    d = md5Hh(d, a, b, c, words[index + 4] ?? 0, 11, 1272893353);
    c = md5Hh(c, d, a, b, words[index + 7] ?? 0, 16, -155497632);
    b = md5Hh(b, c, d, a, words[index + 10] ?? 0, 23, -1094730640);
    a = md5Hh(a, b, c, d, words[index + 13] ?? 0, 4, 681279174);
    d = md5Hh(d, a, b, c, words[index + 0] ?? 0, 11, -358537222);
    c = md5Hh(c, d, a, b, words[index + 3] ?? 0, 16, -722521979);
    b = md5Hh(b, c, d, a, words[index + 6] ?? 0, 23, 76029189);
    a = md5Hh(a, b, c, d, words[index + 9] ?? 0, 4, -640364487);
    d = md5Hh(d, a, b, c, words[index + 12] ?? 0, 11, -421815835);
    c = md5Hh(c, d, a, b, words[index + 15] ?? 0, 16, 530742520);
    b = md5Hh(b, c, d, a, words[index + 2] ?? 0, 23, -995338651);

    a = md5Ii(a, b, c, d, words[index + 0] ?? 0, 6, -198630844);
    d = md5Ii(d, a, b, c, words[index + 7] ?? 0, 10, 1126891415);
    c = md5Ii(c, d, a, b, words[index + 14] ?? 0, 15, -1416354905);
    b = md5Ii(b, c, d, a, words[index + 5] ?? 0, 21, -57434055);
    a = md5Ii(a, b, c, d, words[index + 12] ?? 0, 6, 1700485571);
    d = md5Ii(d, a, b, c, words[index + 3] ?? 0, 10, -1894986606);
    c = md5Ii(c, d, a, b, words[index + 10] ?? 0, 15, -1051523);
    b = md5Ii(b, c, d, a, words[index + 1] ?? 0, 21, -2054922799);
    a = md5Ii(a, b, c, d, words[index + 8] ?? 0, 6, 1873313359);
    d = md5Ii(d, a, b, c, words[index + 15] ?? 0, 10, -30611744);
    c = md5Ii(c, d, a, b, words[index + 6] ?? 0, 15, -1560198380);
    b = md5Ii(b, c, d, a, words[index + 13] ?? 0, 21, 1309151649);
    a = md5Ii(a, b, c, d, words[index + 4] ?? 0, 6, -145523070);
    d = md5Ii(d, a, b, c, words[index + 11] ?? 0, 10, -1120210379);
    c = md5Ii(c, d, a, b, words[index + 2] ?? 0, 15, 718787259);
    b = md5Ii(b, c, d, a, words[index + 9] ?? 0, 21, -343485551);

    a = (a + oldA) | 0;
    b = (b + oldB) | 0;
    c = (c + oldC) | 0;
    d = (d + oldD) | 0;
  }

  return `${toHex(a)}${toHex(b)}${toHex(c)}${toHex(d)}`;
}

export function buildVerificationCode(issuedUnix: number, certificateId: string): string {
  return md5(`${issuedUnix}:${certificateId}`).toUpperCase();
}

export function getRecommendation(score: number): string {
  if (score >= 90) {
    return "Immediate passport lock and airport-access restriction advised.";
  }
  if (score >= 70) {
    return "Minimize exposure to Japan travel content and monitor patient behavior.";
  }
  return "Periodic observation and comfort food intervention may reduce symptoms.";
}

function wrapTextForPdf(text: string, maxLineLength: number, fallback: string): string {
  const singleLineText = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (!singleLineText) {
    return fallback;
  }

  const words = singleLineText.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (currentLine && nextLine.length > maxLineLength) {
      lines.push(currentLine);
      currentLine = word;
      continue;
    }

    currentLine = nextLine;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.join("\n");
}

export function formatAddressForPdf(address: string): string {
  return wrapTextForPdf(address, 42, "-");
}

export function formatClinicalNotesForPdf(note: string): string {
  return wrapTextForPdf(note, 62, "-");
}
