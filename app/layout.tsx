import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque, Handlee } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });
const bricolage = Bricolage_Grotesque({ subsets: ['latin'] });
const handlee = Handlee({ subsets: ['latin'], weight: "400" });
export const metadata: Metadata = {
  title: "SimpleStocks",
  description: "SimpleStocks",
};

// TODO: Add Header and Footer here
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.svg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // Get current theme from cookie or system preference
                const currentTheme = document.cookie.split('; ').find(row => row.startsWith('theme='))?.split('=')[1] ||
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

                // Set cookie if not already set
                if (!document.cookie.includes('theme=')) {
                  document.cookie = 'theme=' + currentTheme + '; path=/; max-age=31536000'; // 1 year expiry
                }

                // Apply theme
                if (currentTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch (e) {
                console.log('Theme detection failed');
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
