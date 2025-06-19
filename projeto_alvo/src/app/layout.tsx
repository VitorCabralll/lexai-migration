import type { Metadata } from 'next';
import './globals.css'; // Keep this for global styles

// Providers from projeto_fonte
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from '@/hooks/useAuth'; // Corrected path based on App.tsx
import { WorkspaceProvider } from "@/contexts/WorkspaceContext"; // Assuming path
import { OnboardingTourProvider } from "@/contexts/OnboardingTourContext"; // Assuming path
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ui/error-boundary"; // Assuming path

// Layout components from projeto_fonte/src/components/Layout.tsx
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"; // Assuming path
import { AppSidebar } from "@/components/AppSidebar"; // Assuming path
import { Header } from "@/components/Header"; // Assuming path
import { OnboardingTour } from '@/components/OnboardingTour'; // To display the tour

// Create a single QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const metadata: Metadata = {
  title: 'LexAI - Your AI Legal Assistant',
  description: 'Generate legal documents and get AI-powered suggestions with LexAI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <WorkspaceProvider>
                  <OnboardingTourProvider>
                    <SidebarProvider>
                      <div className="min-h-screen flex w-full">
                        <AppSidebar />
                        <SidebarInset className="flex-1 flex flex-col"> {/* Added flex flex-col */}
                          <Header />
                          <main className="flex-1 p-4 md:p-6 overflow-y-auto"> {/* Added overflow-y-auto */}
                            {children}
                          </main>
                        </SidebarInset>
                      </div>
                      <OnboardingTour /> {/* Tour component can be placed here */}
                    </SidebarProvider>
                    <Toaster />
                  </OnboardingTourProvider>
                </WorkspaceProvider>
              </AuthProvider>
            </QueryClientProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
