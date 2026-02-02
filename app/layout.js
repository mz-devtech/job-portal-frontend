import './globals.css';
import ToastProvider from '@/components/ToastProvider';
import ReduxProvider from '@/components/ReduxProvider';

export const metadata = {
  title: 'Jobpilot - Find Your Dream Job',
  description: 'Job search platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <ToastProvider />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}