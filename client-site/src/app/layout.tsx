import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

// 1. Google site verification metadata ichiga ko'chirildi
export const metadata: Metadata = {
  title: "Sodiq School",
  description: "Toshkentdagi yetakchi xususiy maktab",
  verification: {
    google: "bdJsJORhzTgyLoOw27C1XX8tw1iGdUrszCEpJIS0DuE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <head>
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
      </head>
      <body>
        {children}

        {/* Skriptlar body oxiriga ko'chirildi — bu sayt tezligini oshiradi */}
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

        {/* Yandex.Metrika counter */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=109775493', 'ym');

            ym(109775493, 'init', {
                defer: true,
                clickmap: true,
                trackLinks: true,
                accurateTrackBounce: true,
                webvisor: true,
                ecommerce: "dataLayer"
            });

            // Next.js client-side navigatsiyani to'g'ri kuzatish uchun url o'zgarishini yuborish
            ym(109775493, 'hit', window.location.href);
          `}
        </Script>
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/109775493"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}
