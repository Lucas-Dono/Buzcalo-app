import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

function MainLayout({ children, currentPage, setCurrentPage }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header
        onMenuToggle={() => setShowMobileMenu(!showMobileMenu)}
        setCurrentPage={setCurrentPage}
      />

      <div className="flex">
        <Sidebar
          showMobile={showMobileMenu}
          onClose={() => setShowMobileMenu(false)}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        <main className="flex-1 ml-0 md:ml-64 pt-16 pb-16 md:pb-6 w-full overflow-x-hidden">
          <div className="max-w-4xl mx-auto px-4 py-6 w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
}

export default MainLayout;
