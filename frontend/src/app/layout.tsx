import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { TutorialProvider } from '@/contexts/TutorialContext';
import { ConfirmProvider } from '@/components/ui/ConfirmModal';
import { ThemePanel } from '@/components/ThemePanel';
import { FeedbackButton } from '@/components/FeedbackButton';
import { TutorialGuide } from '@/components/Tutorial/TutorialGuide';

// ... (metadata unchanged)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="light">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700&family=Noto+Sans:wght@400;500;600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background-light dark:bg-background-dark font-display text-text-main antialiased min-h-screen transition-colors duration-300 relative">
        {/* Decorative Global Background */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[100px]"></div>
        </div>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <ConfirmProvider>
                <TutorialProvider>
                  {children}
                  <TutorialGuide />
                  <ThemePanel />
                  <FeedbackButton />
                </TutorialProvider>
              </ConfirmProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
