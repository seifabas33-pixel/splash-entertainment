import { type PropsWithChildren } from 'react';
import { ScrollViewStyleReset } from 'expo-router/html';

// Custom HTML wrapper — forces root to span full viewport width on web.
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{
          __html: `
            html, body {
              height: 100%;
              background-color: #000;
              margin: 0;
              padding: 0;
            }
            #root {
              width: 100vw !important;
              min-height: 100vh;
              background-color: #000;
              overflow-x: hidden;
            }
          `,
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
