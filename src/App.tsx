import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import FeedPage from './pages/FeedPage';
import CreerPostPage from './pages/CreerPostPage';
import ProfilPage from './pages/ProfilPage';
import { estConnectee } from './services/authService';
import RegisterPage from './pages/RegisterPage';
import MessagesPage from './pages/MessagesPage';
import ConversationPage from './pages/ConversationPage';
import ExplorePage from './pages/ExplorePage';
import CategoriePage from './pages/CategoriePage';
import PostDetailPage from './pages/PostDetailPage';
import * as authService from './services/authService';
import AdminPage from './pages/AdminPage';
import ParametresPage from './pages/ParametresPage.tsx';

// Composant pour protéger les routes
function RouteProtegee({ children }: { children: React.ReactNode }) {
  return estConnectee() ? <>{children}</> : <Navigate to="/login" />;
}

function RouteAdmin({ children }: { children: React.ReactNode }) {
  const utilisatrice = authService.getUtilisatriceConnectee();
  if (!utilisatrice) return <Navigate to="/login" />;
  if (utilisatrice.role !== 'ADMIN') return <Navigate to="/feed" />;
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/feed" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route 
          path="/feed" 
          element={<RouteProtegee><FeedPage /></RouteProtegee>} 
        />
        <Route 
          path="/creer-post" 
          element={<RouteProtegee><CreerPostPage /></RouteProtegee>} 
        />
        <Route 
          path="/profil" 
          element={<RouteProtegee><ProfilPage /></RouteProtegee>} 
        />
        <Route 
          path="/parametres" 
          element={<RouteProtegee><ParametresPage /></RouteProtegee>} 
        />
        <Route 
          path="/messages" 
          element={<RouteProtegee><MessagesPage /></RouteProtegee>} 
        />
        <Route 
          path="/conversation/:id" 
          element={<RouteProtegee><ConversationPage /></RouteProtegee>} 
        />
        <Route 
          path="/explore" 
          element={<RouteProtegee><ExplorePage /></RouteProtegee>} 
        />
        <Route 
          path="/categorie/:id" 
          element={<RouteProtegee><CategoriePage /></RouteProtegee>} 
        />
        <Route 
          path="/post/:id" 
          element={<RouteProtegee><PostDetailPage /></RouteProtegee>} 
        />
        <Route 
          path="/admin" 
          element={<RouteAdmin><AdminPage /></RouteAdmin>} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;