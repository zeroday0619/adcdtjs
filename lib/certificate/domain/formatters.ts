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

export function getRecommendation(score: number): string {
  if (score >= 90) {
    return "Immediate passport lock and airport-access restriction advised.";
  }
  if (score >= 70) {
    return "Minimize exposure to Japan travel content and monitor patient behavior.";
  }
  return "Periodic observation and comfort food intervention may reduce symptoms.";
}

export function formatAddressForPdf(address: string): string {
  const singleLineAddress = address
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (!singleLineAddress) {
    return "-";
  }

  return singleLineAddress
    .split(" ")
    .map((segment) =>
      segment
        .replace(/([,./\-()#])/g, "$1\u200B")
        .replace(/([a-z])([A-Z])/g, "$1\u200B$2")
        .replace(/(\d)([A-Za-z])/g, "$1\u200B$2")
        .replace(/([A-Za-z])(\d)/g, "$1\u200B$2")
        .replace(/(.{8})/g, "$1\u200B"),
    )
    .join(" ");
}
