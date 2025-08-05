import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/useAuth';
import SignUpPage from './pages/SingUpPage';
import HomePage from './pages/HomePage';
import WordListPage from './pages/WordListPage';
import TagBrowserPage from './pages/TagBrowserPage';
import WordDetailPage from './pages/WordDetailPage';
import TagWordListPage from './pages/TagWordListPage';
import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage';
import PrivateRoute from './components/private_route';
import ProtectedLayout from './components/ProtectedLayout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected routes with shared layout (includes Navbar) */}
          <Route
            element={
              <PrivateRoute>
                <ProtectedLayout />
              </PrivateRoute>
            }
          >
            <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
            <Route path="/my-words" element={<PrivateRoute><WordListPage /></PrivateRoute>} />
            <Route path="/tags" element={<PrivateRoute><TagBrowserPage /></PrivateRoute>} />
            <Route path="/word-details/:id" element={<PrivateRoute><WordDetailPage /></PrivateRoute>} />
            <Route path="/my-words-by-tag" element={<PrivateRoute><TagWordListPage /></PrivateRoute>} />
            <Route path="/my-words/:id" element={<PrivateRoute><WordDetailPage /></PrivateRoute>} />

          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;