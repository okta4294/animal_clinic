'use client';
import { AppSidebar } from './_components/app-sidebar';
import { ChartAreaInteractive } from './_components/chart-area-interactive';
import { DataTable } from './_components/data-table';
import { SectionCards } from './_components/section-cards';
import { SiteHeader } from './_components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ChartBarMixed } from './_components/chart-bar-mixed';
import { ChartPieDonut } from './_components/chart-pie-donut';
import {AddTable} from './DailyInspection/_components/add-table';

import data from './data.json';
const Page = () => {
  return (
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="grid px-4">
              <AddTable/>
            </div>
          </div>
        </div>
  );
};

export default Page;
