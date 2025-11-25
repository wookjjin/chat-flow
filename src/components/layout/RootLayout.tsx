import { Outlet } from 'react-router';

import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

export default function RootLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
