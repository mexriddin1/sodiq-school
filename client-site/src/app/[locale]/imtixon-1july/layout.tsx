import Script from 'next/script';

export default function Imtixon1JulyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const shouldLoadTelegramPixel = params.locale === 'uz';

  return (
    <>
      {shouldLoadTelegramPixel && (
        <Script id="telegram-pixel-imtixon-1july" strategy="afterInteractive">
          {`(function(t,l,g,r,m){t[g]||(g=t[g]=function(){g.run?g.run.apply(g,arguments):g.queue.push(arguments)},g.queue=[],t=l.createElement(r),t.async=!0,t.src=m,l=l.getElementsByTagName(r)[0],l.parentNode.insertBefore(t,l))})(window,document,'tgp','script','https://telegram.org/js/pixel.js');tgp('init','bjPNOpBd');tgp('event','bjPNOpBd-ilGRYPNJ');`}
        </Script>
      )}

      {children}
    </>
  );
}
