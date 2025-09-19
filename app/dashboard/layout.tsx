"use client";
import { AppSidebar } from './_components/app-sidebar';
import { SiteHeader } from './_components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children} 
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
