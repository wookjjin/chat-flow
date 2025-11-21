import { Outlet } from 'react-router';

import Aside from '@/components/layout/Aside';
import Header from '@/components/layout/Header';

export default function RootLayout() {
  return (
    <div className="flex h-screen">
      <Aside />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
