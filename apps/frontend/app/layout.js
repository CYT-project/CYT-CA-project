// Root layout for Next.js App Router
// This layout wraps all pages in the application

import './globals.css';

export const metadata = {
  title: 'CIV2025 Frontend',
  description: 'Next.js frontend for CIV2025 microservices template',
  keywords: ['nextjs', 'microservices', 'cicd', 'react'],
  authors: [{ name: 'CIV2025 Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}