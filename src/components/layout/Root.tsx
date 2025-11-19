import Aside from '@/components/layout/Aside';
import Header from '@/components/layout/Header';
import { Outlet } from 'react-router';

export default function Root() {
  return (
    <div className="flex h-screen">
      <Aside />
      <div className="flex flex-1 flex-col overflow-hideen">
        <Header />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
