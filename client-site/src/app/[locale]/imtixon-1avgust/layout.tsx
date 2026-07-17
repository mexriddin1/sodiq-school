import Script from 'next/script';

export default function Imtixon1AvgustLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script id="telegram-pixel-imtixon-1avgust" strategy="afterInteractive">
        {`(function(t,l,g,r,m){t[g]||(g=t[g]=function(){g.run?g.run.apply(g,arguments):g.queue.push(arguments)},g.queue=[],t=l.createElement(r),t.async=!0,t.src=m,l=l.getElementsByTagName(r)[0],l.parentNode.insertBefore(t,l))})(window,document,'tgp','script','https://telegram.org/js/pixel.js');tgp('init','bjPNOpBd');tgp('event','bjPNOpBd-ilGRYPNJ');`}
      </Script>
      <Script id="meta-pixel-imtixon-1avgust" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','2051026685493607');fbq('track','PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img height="1" width="1" style={{ display: 'none' }} alt="" src="https://www.facebook.com/tr?id=2051026685493607&ev=PageView&noscript=1" />
      </noscript>

      {children}
    </>
  );
}
