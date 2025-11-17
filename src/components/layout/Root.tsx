import { Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import Aside from './Aside';

export default function Root() {
  return (
    <div className="flex h-screen">
      <Aside />
      <div className="flex flex-1 flex-col overflow-hideen">
        <Header />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
