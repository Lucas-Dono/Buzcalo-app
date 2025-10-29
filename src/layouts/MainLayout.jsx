import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function MainLayout({ children, currentPage, setCurrentPage }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header onMenuToggle={() => setShowMobileMenu(!showMobileMenu)} />

      <div className="flex">
        <Sidebar
          showMobile={showMobileMenu}
          onClose={() => setShowMobileMenu(false)}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        <main className="flex-1 ml-0 md:ml-64 pt-16">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
