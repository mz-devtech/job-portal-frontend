// app/layout.jsx
import './globals.css';
import ToastProvider from '@/components/ToastProvider';

export const metadata = {
  title: 'Jobpilot - Find Your Dream Job',
  description: 'Job search platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}