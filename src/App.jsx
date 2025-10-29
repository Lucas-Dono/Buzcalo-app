import { useState } from 'react'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Search from './pages/Search'
import Explore from './pages/Explore'
import Business from './pages/Business'
import Favorites from './pages/Favorites'
import Profile from './pages/Profile'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <Home />
      case 'search':
        return <Search />
      case 'explore':
        return <Explore />
      case 'business':
        return <Business />
      case 'favorites':
        return <Favorites />
      case 'profile':
        return <Profile />
      default:
        return <Home />
    }
  }

  return (
    <MainLayout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </MainLayout>
  )
}

export default App
