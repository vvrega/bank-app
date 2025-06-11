import './globals.css';
import '@mantine/core/styles.css';
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

// import '@mantine/core/styles.css';
// import './globals.css';
// import { Roboto } from 'next/font/google';

// import {
//   ColorSchemeScript,
//   MantineProvider,
//   mantineHtmlProps,
// } from '@mantine/core';

// const roboto = Roboto({
//   subsets: ['latin'],
//   weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
//   variable: '--font-roboto',
// });

// export const metadata = {
//   title: 'Bank App',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" className={roboto.className} {...mantineHtmlProps}>
//       <head>
//         <ColorSchemeScript />
//       </head>
//       <body>
//         <MantineProvider>{children}</MantineProvider>
//       </body>
//     </html>
//   );
// }
