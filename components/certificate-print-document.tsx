import {
  Circle,
  Document,
  Font,
  G,
  Line,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  Text as SvgText,
  View,
  pdf,
} from "@react-pdf/renderer";

import { CERTIFICATE_LEVEL_LABELS, GENDER_LABELS } from "@/lib/certificate/domain/constants";
import {
  buildVerificationCode,
  formatAddressForPdf,
  formatClinicalNotesForPdf,
  getRecommendation,
} from "@/lib/certificate/domain/formatters";
import type { CertificatePrintData } from "@/lib/certificate/domain/types";

Font.register({
  family: "NanumGothic",
  fonts: [
    {
      src: "/fonts/NanumGothic-Regular.ttf",
      fontWeight: "normal",
    },
    {
      src: "/fonts/NanumGothic-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    backgroundColor: "#ffffff",
    color: "#25130b",
    fontFamily: "NanumGothic",
    fontSize: 11,
    lineHeight: 1.45,
  },
  sheet: {
    position: "relative",
    flexGrow: 1,
    borderWidth: 3,
    borderColor: "#4b2713",
    paddingTop: 30,
    paddingRight: 30,
    paddingBottom: 30,
    paddingLeft: 30,
    backgroundColor: "#fff8e9",
  },
  watermarkWrap: {
    position: "absolute",
    top: 88,
    left: 58,
    width: 430,
    height: 430,
  },
  sheetContent: {
    position: "relative",
    flexGrow: 1,
    flexDirection: "column",
  },
  mainContent: {
    flexDirection: "column",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#8d6a3f",
    paddingBottom: 14,
  },
  titleBlock: {
    flexDirection: "column",
    gap: 0,
    maxWidth: 410,
  },
  kicker: {
    fontSize: 9,
    letterSpacing: 1.3,
    lineHeight: 1.25,
    color: "#321f14",
  },
  kickerRule: {
    marginTop: 6,
    width: 110,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(75, 39, 19, 0.6)",
  },
  titleStack: {
    marginTop: 10,
    flexDirection: "column",
    gap: 2,
  },
  titlePrimary: {
    fontSize: 23,
    fontWeight: "bold",
    lineHeight: 1.16,
    color: "#241108",
  },
  titleSecondary: {
    fontSize: 19,
    fontWeight: "bold",
    lineHeight: 1.2,
    color: "#412314",
  },
  statusWrap: {
    alignItems: "flex-end",
    minWidth: 140,
  },
  statusLabel: {
    fontSize: 9,
    color: "#2b1c10",
  },
  statusValue: {
    marginTop: 6,
    borderWidth: 2,
    borderColor: "#ad0f22",
    color: "#ad0f22",
    fontSize: 16,
    fontWeight: "bold",
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12,
  },
  table: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: "rgba(63, 34, 20, 0.3)",
  },
  row: {
    flexDirection: "row",
    alignItems: "stretch",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(63, 34, 20, 0.22)",
  },
  rowMultiline: {},
  rowLast: {
    borderBottomWidth: 0,
  },
  labelCell: {
    width: 160,
    flexShrink: 0,
    justifyContent: "flex-start",
    backgroundColor: "rgba(120, 80, 43, 0.1)",
    borderRightWidth: 1,
    borderRightColor: "rgba(63, 34, 20, 0.22)",
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12,
  },
  labelCellMultiline: {
    justifyContent: "flex-start",
  },
  labelText: {
    fontWeight: "bold",
    lineHeight: 1.3,
    textAlign: "left",
  },
  valueCell: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
    justifyContent: "flex-start",
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12,
  },
  valueCellMultiline: {
    justifyContent: "flex-start",
    paddingTop: 6,
    paddingBottom: 6,
  },
  valueText: {
    lineHeight: 1.2,
    maxWidth: "100%",
    textAlign: "left",
  },
  valueTextMultiline: {
    lineHeight: 1.2,
    maxWidth: "100%",
    fontSize: 10,
    textAlign: "left",
  },
  diagnosis: {
    marginTop: 26,
    borderWidth: 1,
    borderColor: "rgba(63, 34, 20, 0.3)",
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 14,
    paddingRight: 14,
  },
  diagnosisTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  diagnosisBody: {
    marginTop: 10,
    lineHeight: 1.65,
    fontSize: 14,
  },
  recommend: {
    marginTop: 10,
    color: "#8f0616",
    fontWeight: "bold",
    lineHeight: 1.55,
    fontSize: 13,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerMeta: {
    flexDirection: "column",
    gap: 4,
  },
  footerMetaText: {
    fontSize: 12,
  },
  signWrap: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  seal: {
    width: 98,
    height: 98,
  },
  physician: {
    marginTop: 8,
    fontWeight: "bold",
    fontSize: 13,
  },
});

function InfoRow({
  label,
  value,
  isLast = false,
  multiline = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
  multiline?: boolean;
}) {
  const isVariableHeight = multiline || value.includes("\n");
  const rowStyle =
    isVariableHeight && isLast
      ? [styles.row, styles.rowMultiline, styles.rowLast]
      : isVariableHeight
        ? [styles.row, styles.rowMultiline]
        : isLast
          ? [styles.row, styles.rowLast]
          : styles.row;

  return (
    <View style={rowStyle}>
      <View style={isVariableHeight ? [styles.labelCell, styles.labelCellMultiline] : styles.labelCell}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <View style={isVariableHeight ? [styles.valueCell, styles.valueCellMultiline] : styles.valueCell}>
        <Text
          wrap
          style={isVariableHeight ? [styles.valueText, styles.valueTextMultiline] : styles.valueText}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

function renderTextOnArc(
  text: string,
  radius: number,
  startAngle: number,
  endAngle: number,
  fontSize: number,
  options?: {
    centerX?: number;
    centerY?: number;
    color?: string;
    fontWeight?: "bold" | "normal";
  },
) {
  const characters = Array.from(text);
  const centerX = options?.centerX ?? 250;
  const centerY = options?.centerY ?? 250;
  const color = options?.color ?? "#c0001a";
  const total = characters.length;

  return characters.map((character, index) => {
    const progress = total === 1 ? 0.5 : index / (total - 1);
    const angle = startAngle + (endAngle - startAngle) * progress;
    const radians = (angle * Math.PI) / 180;
    const x = centerX + Math.cos(radians) * radius;
    const y = centerY + Math.sin(radians) * radius;
    const rotation = angle + 90;

    return (
      <SvgText
        key={`${text}-${index}-${character}`}
        x={x}
        y={y}
        textAnchor="middle"
        fill={color}
        transform={`rotate(${rotation}, ${x}, ${y})`}
        style={{
          fontFamily: "NanumGothic",
          fontWeight: options?.fontWeight ?? "bold",
          fontSize,
        }}
      >
        {character === " " ? "\u00A0" : character}
      </SvgText>
    );
  });
}

function chunkVerificationCode(verificationCode: string): [string, string] {
  return [verificationCode.slice(0, 16), verificationCode.slice(16, 32)];
}

function WatermarkLogo({ verificationCode }: { verificationCode: string }) {
  const watermarkColor = "#1a5fa8";
  const [verificationLine1, verificationLine2] = chunkVerificationCode(verificationCode);

  return (
    <View style={styles.watermarkWrap}>
      <Svg viewBox="0 0 680 680" width="100%" height="100%">
        <G opacity={0.12}>
          <Circle cx="340" cy="340" r="265" fill="none" stroke={watermarkColor} strokeWidth="3" />
          <Circle cx="340" cy="340" r="248" fill="none" stroke={watermarkColor} strokeWidth="0.8" />
          <Circle
            cx="340"
            cy="340"
            r="150"
            fill="none"
            stroke={watermarkColor}
            strokeWidth="1.2"
            strokeDasharray="6 4"
          />

          {renderTextOnArc("AEJIS RAPID RESPONSE TEAM", 220, -164, -16, 21, {
            centerX: 340,
            centerY: 340,
            color: watermarkColor,
          })}
          {renderTextOnArc("TENKAI GENERAL HOSPITAL", 220, 16, 164, 19, {
            centerX: 340,
            centerY: 340,
            color: watermarkColor,
            fontWeight: "normal",
          })}

          <Circle cx="340" cy="101" r="4" fill={watermarkColor} />
          <Circle cx="340" cy="579" r="4" fill={watermarkColor} />
          <Circle cx="204" cy="170" r="3" fill={watermarkColor} />
          <Circle cx="476" cy="170" r="3" fill={watermarkColor} />
          <Circle cx="185" cy="462" r="3" fill={watermarkColor} />
          <Circle cx="495" cy="462" r="3" fill={watermarkColor} />

          <Line x1="340" y1="108" x2="340" y2="128" stroke={watermarkColor} strokeWidth="1.5" />
          <Line x1="340" y1="552" x2="340" y2="572" stroke={watermarkColor} strokeWidth="1.5" />

          <SvgText
            x="340"
            y="222"
            textAnchor="middle"
            fill={watermarkColor}
            style={{ fontFamily: "Courier", fontSize: 11, opacity: 0.6, letterSpacing: 2 }}
          >
            VERIFICATION CODE
          </SvgText>
          <Line x1="260" y1="230" x2="420" y2="230" stroke={watermarkColor} strokeWidth="0.8" />

          <SvgText
            x="340"
            y="336"
            textAnchor="middle"
            fill={watermarkColor}
            style={{ fontFamily: "Courier", fontSize: 18, fontWeight: "bold", letterSpacing: 2.3 }}
          >
            {verificationLine1}
          </SvgText>
          <SvgText
            x="340"
            y="364"
            textAnchor="middle"
            fill={watermarkColor}
            style={{ fontFamily: "Courier", fontSize: 18, fontWeight: "bold", letterSpacing: 2.3 }}
          >
            {verificationLine2}
          </SvgText>

          <Line x1="255" y1="378" x2="425" y2="378" stroke={watermarkColor} strokeWidth="0.8" />
          <SvgText
            x="340"
            y="396"
            textAnchor="middle"
            fill={watermarkColor}
            style={{ fontFamily: "Courier", fontSize: 10, opacity: 0.6, letterSpacing: 1.5 }}
          >
            TENKAI · AEJIS
          </SvgText>

          <Path
            d="M 110 340 L 185 340"
            stroke={watermarkColor}
            strokeWidth="1"
            strokeDasharray="3 3"
            fill="none"
          />
          <Path
            d="M 495 340 L 570 340"
            stroke={watermarkColor}
            strokeWidth="1"
            strokeDasharray="3 3"
            fill="none"
          />
        </G>
      </Svg>
    </View>
  );
}

function SealStamp() {
  const sealColor = "#c0001a";

  return (
    <View style={styles.seal}>
      <Svg viewBox="0 0 500 500" width="98" height="98">
        <Circle cx="250" cy="250" r="230" fill="none" stroke={sealColor} strokeWidth="6" />
        <Circle cx="250" cy="250" r="213" fill="none" stroke={sealColor} strokeWidth="2" />
        <Circle cx="250" cy="250" r="148" fill="none" stroke={sealColor} strokeWidth="2" />

        {renderTextOnArc("AEJIS RAPID RESPONSE TEAM", 213, -168, -12, 18)}
        {renderTextOnArc("TENKAI GENERAL HOSPITAL", 213, 12, 168, 18)}

        <SvgText
          x="63"
          y="258"
          textAnchor="middle"
          fill={sealColor}
          style={{ fontFamily: "NanumGothic", fontSize: 20 }}
        >
          ★
        </SvgText>
        <SvgText
          x="437"
          y="258"
          textAnchor="middle"
          fill={sealColor}
          style={{ fontFamily: "NanumGothic", fontSize: 20 }}
        >
          ★
        </SvgText>

        <Circle cx="48" cy="250" r="3" fill={sealColor} />
        <Circle cx="452" cy="250" r="3" fill={sealColor} />

        <SvgText
          x="250"
          y="226"
          textAnchor="middle"
          fill={sealColor}
          style={{
            fontFamily: "NanumGothic",
            fontWeight: "bold",
            fontSize: 52,
            letterSpacing: 6,
          }}
        >
          天久
        </SvgText>
        <Line x1="188" y1="242" x2="312" y2="242" stroke={sealColor} strokeWidth="1.5" />
        <SvgText
          x="250"
          y="292"
          textAnchor="middle"
          fill={sealColor}
          style={{
            fontFamily: "NanumGothic",
            fontWeight: "bold",
            fontSize: 52,
            letterSpacing: 6,
          }}
        >
          鷹央
        </SvgText>
      </Svg>
    </View>
  );
}

function CertificatePrintDocument({ data }: { data: CertificatePrintData }) {
  const scoreText = `${data.score} / 100`;
  const levelText = CERTIFICATE_LEVEL_LABELS[data.level] ?? data.level.toUpperCase();
  const sexText = GENDER_LABELS[data.sex] ?? "Prefer not to say";
  const recommendation = getRecommendation(data.score);
  const wrappedAddress = formatAddressForPdf(data.address);
  const wrappedNote = formatClinicalNotesForPdf(data.note);
  const verificationCode = buildVerificationCode(data.issuedUnix, data.serial);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sheet}>
          <WatermarkLogo verificationCode={verificationCode} />

          <View style={styles.sheetContent}>
            <View style={styles.mainContent}>
              <View style={styles.topRow}>
                <View style={styles.titleBlock}>
                  <Text style={styles.kicker}>MEDICAL CERTIFICATE</Text>
                  <View style={styles.kickerRule} />
                  <View style={styles.titleStack}>
                    <Text style={styles.titlePrimary}>Acute Episode of Japan</Text>
                    <Text style={styles.titlePrimary}>Ikitai Syndrome</Text>
                  </View>
                </View>

                <View style={styles.statusWrap}>
                  <Text style={styles.statusLabel}>STATUS</Text>
                  <Text style={styles.statusValue}>{levelText}</Text>
                </View>
              </View>

              <View style={styles.table}>
                <InfoRow label="Patient Name" value={data.patient} />
                <InfoRow label="Date of Birth" value={data.birth} />
                <InfoRow label="Gender Identity" value={sexText} />
                <InfoRow label="Address" value={wrappedAddress} multiline />
                <InfoRow label="Japan Ikitai Score" value={scoreText} />
                <InfoRow label="Certificate ID" value={data.serial} isLast />
              </View>

              <View style={styles.diagnosis}>
                <Text style={styles.diagnosisTitle}>Clinical Notes</Text>
                <Text style={styles.diagnosisBody}>{wrappedNote}</Text>
                <Text style={styles.recommend}>Recommendation: {recommendation}</Text>
              </View>
            </View>

            <View style={styles.footer}>
              <View style={styles.footerMeta}>
                <Text style={styles.footerMetaText}>Issue Date: {data.issued}</Text>
                <Text style={styles.footerMetaText}>Medical Institution: {data.hospital}</Text>
              </View>

              <View style={styles.signWrap}>
                <SealStamp />
                <Text style={styles.physician}>Attending Physician: {data.doctor}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function renderCertificatePdfBlob(data: CertificatePrintData): Promise<Blob> {
  return pdf(<CertificatePrintDocument data={data} />).toBlob();
}
