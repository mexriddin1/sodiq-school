import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sodiq School",
  description: "Toshkentdagi yetakchi xususiy maktab",
};

// The root layout. We render <html lang="uz"> by default; the per-locale layout
// updates the lang attribute on the client.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <head>
        <meta
          name="google-site-verification"
          content="bdJsJORhzTgyLoOw27C1XX8tw1iGdUrszCEpJIS0DuE"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-NR8E2NB2L8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-NR8E2NB2L8');

            // Telefon raqamlarini kuzatish
            document.addEventListener("click", function(e) {
              const link = e.target.closest('a[href^="tel:"]');
              if (link && typeof gtag === 'function') {
                gtag('event', 'phone_click', {
                  'event_category': 'Contact',
                  'event_label': link.href,
                  'transport_type': 'beacon'
                });
              }
            });
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
