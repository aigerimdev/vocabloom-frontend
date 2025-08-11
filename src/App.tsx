import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/useAuth';
import SignUpPage from './pages/SingUpPage';
import HomePage from './pages/HomePage';
import WordListPage from './pages/WordListPage';
import TagBrowserPage from './pages/TagBrowserPage';
import WordDetailPage from './pages/WordDetailPage';
import TagWordListPage from './pages/TagWordListPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/private_route';
import ProtectedLayout from './components/ProtectedLayout';
import RootRedirect from './components/RootRedirect';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected routes */}
          <Route
            element={
              <PrivateRoute>
                <ProtectedLayout />
              </PrivateRoute>
            }
          >
            <Route path="/home" element={<HomePage />} />
            <Route path="/my-words" element={<WordListPage />} />
            <Route path="/tags" element={<TagBrowserPage />} />
            <Route path="/word-details/:id" element={<WordDetailPage />} />
            <Route path="/my-words-by-tag" element={<TagWordListPage />} />
            <Route path="/my-words/:id" element={<WordDetailPage />} />

          </Route>
        </Routes>
      </AuthProvider>
    </Router >
  );
}

export default App;