import CertificateBuilder from "@/components/certificate-builder";
import { buildWebApplicationJsonLd } from "@/lib/site";

export default function HomePage() {
  const webApplicationJsonLd = buildWebApplicationJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <main id="main-content">
        <CertificateBuilder />
      </main>
    </>
  );
}
