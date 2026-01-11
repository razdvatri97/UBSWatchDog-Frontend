import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 flex-shrink-0"></div>
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
      <Sidebar />
    </div>
  );
}