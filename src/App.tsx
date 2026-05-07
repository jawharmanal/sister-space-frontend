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
// Composant pour protéger les routes
function RouteProtegee({ children }: { children: React.ReactNode }) {
  return estConnectee() ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/feed" />} />
        <Route path="/login" element={<LoginPage />} />
        
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
        
        {/* Routes temporaires — on les fera demain */}
        <Route path="/register" element={<RegisterPage />} 
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;