import Script from 'next/script';
import './globals.css';

export const metadata = {
  title: 'Business Growth Readiness Assessment | Accelerated Intelligence',
  description: 'Most businesses lose thousands every month to slow follow-up, broken processes, and gaps they can\'t see. This 3-minute assessment shows you exactly where the leaks are.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <Script id="gtm" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-M5ZQ22V7');
        `}</Script>
      </head>
      <body>
        <Script id="saleshub" strategy="afterInteractive">{`
          (function(w, d) {
            d.addEventListener("DOMContentLoaded", function () {
              var token = "";
              var script = d.createElement('script');
              script.async = true;
              script.src = "https://track.saleshub.ai/assets/for-cache.min.js?authorization=";
              script.onload = function () {
                w.salesToolsObserverCached(token);
              };
              d.body.appendChild(script);
            })
          })(window, document)
        `}</Script>
        {children}
      </body>
    </html>
  );
}
