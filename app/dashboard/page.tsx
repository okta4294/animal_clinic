'use client';
import { AppSidebar } from './_components/app-sidebar';
import { ChartAreaInteractive } from './_components/chart-area-interactive';
import { DataTable } from './_components/data-table';
import { SectionCards } from './_components/section-cards';
import { SiteHeader } from './_components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ChartBarMixed } from './_components/chart-bar-mixed';
import { ChartPieDonut } from './_components/chart-pie-donut';

import data from './data.json';
const Page = () => {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
              <div className="flex gap-4 px-4 lg:px-6">
                <div className="basis-1/2">
                  <ChartPieDonut />
                </div>
                <div className="basis-1/2">
                  <ChartBarMixed />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Page;
