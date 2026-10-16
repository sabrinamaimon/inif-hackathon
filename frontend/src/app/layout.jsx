import './globals.css';

export const metadata = {
  title: 'DhakaPath — Live Urban Transit & Route Intelligence',
  description: 'Intelligent multi-modal transit, fare calculation, and live street-alert platform tailored for Dhaka city.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
