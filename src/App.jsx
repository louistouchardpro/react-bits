import { Suspense, lazy, useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v6';
import Providers from './components/layout/Providers';
import { ActiveRouteProvider } from './components/context/ActiveRouteContext/ActiveRouteContext';
import { forceChakraDarkTheme } from './utils/utils';

import AnnouncementBar from './components/common/AnnouncementBar/AnnouncementBar';
import { PRO_ANNOUNCEMENT } from './constants/Site';
import AnnouncementModal from './components/common/AnnouncementModal/AnnouncementModal';
import DisplayHeader from './components/landing/DisplayHeader/DisplayHeader';

const SidebarLayout = lazy(() => import('./components/layout/SidebarLayout'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ShowcasePage = lazy(() => import('./pages/ShowcasePage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const SponsorsPage = lazy(() => import('./pages/SponsorsPage'));
const ToolsPage = lazy(() => import('./pages/ToolsPage'));

const RouteFallback = () => null;

function AppContent() {
  const location = useLocation();

  const getActiveItem = () => {
    if (location.pathname === '/') return 'home';
    if (location.pathname === '/showcase') return 'showcase';
    return null;
  };

  const renderWithSidebar = page => <SidebarLayout>{page}</SidebarLayout>;

  const sidebarPages = ['/favorites'];
  const isSidebarPage =
    sidebarPages.some(path => location.pathname.includes(path)) || location.pathname.match(/^\/[^/]+\/[^/]+$/);

  const isToolsPage = location.pathname.startsWith('/tools');
  const isSponsorsPage = location.pathname === '/sponsors';

  return (
    <>
      {!isSidebarPage && !isToolsPage && !isSponsorsPage && (
        <>
          <AnnouncementBar
            {...PRO_ANNOUNCEMENT}
            backgroundColor={location.pathname === '/' ? undefined : '#5227FF'}
            noBorder={location.pathname !== '/'}
            className="landing-bar"
          />
          <DisplayHeader activeItem={getActiveItem()} />
        </>
      )}
      <Providers>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route exact path="/" element={<LandingPage />} />
            <Route exact path="/showcase" element={<ShowcasePage />} />
            <Route exact path="/sponsors" element={<SponsorsPage />} />
            <Route path="/tools/:toolId?" element={<ToolsPage />} />
            <Route path="/:category/:subcategory" element={renderWithSidebar(<CategoryPage />)} />
            <Route path="/favorites" element={renderWithSidebar(<FavoritesPage />)} />
          </Routes>
        </Suspense>
      </Providers>
    </>
  );
}

export default function App() {
  useEffect(() => {
    forceChakraDarkTheme();
  }, []);

  return (
    <Router>
      <NuqsAdapter>
        <ActiveRouteProvider>
          <AppContent />
          <AnnouncementModal />
        </ActiveRouteProvider>
      </NuqsAdapter>
    </Router>
  );
}
