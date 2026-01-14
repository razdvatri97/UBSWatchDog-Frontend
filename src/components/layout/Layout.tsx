import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileMenuButton } from '../ui/mobile-menu-button'; 
import { useIsMobile } from '../ui/use-mobile';

export function Layout() {
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen w-full min-w-0 overflow-hidden">
        <MobileMenuButton />
        <div className={`${isMobile ? 'pt-24' : ''} flex-1 flex flex-col`}>
          <Header />
          <main className="flex-1 p-4 md:p-6 w-full overflow-x-hidden">
            <div className="w-full max-w-full overflow-hidden">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}