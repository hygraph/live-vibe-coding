import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className='app'>
      <header className='header'>
        <div className='header-content'>
          <Link to='/' className='logo'>
            📝 Snippet Manager
          </Link>
          <nav className='nav'>
            <Link
              to='/'
              className={`nav-link ${isActiveRoute('/') ? 'active' : ''}`}
            >
              All Snippets
            </Link>
            <Link
              to='/new'
              className={`nav-link ${isActiveRoute('/new') ? 'active' : ''}`}
            >
              + New Snippet
            </Link>
          </nav>
        </div>
      </header>

      <main className='main'>
        <div className='container'>{children}</div>
      </main>
    </div>
  );
};

export default Layout;
