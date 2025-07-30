import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import Logout from './pages/Logout';
import WordListPage from './pages/WordListPage';
import TagBrowserPage from './pages/TagBrowserPage';
import WordDetailPage from './pages/WordDetailPage';
import TagWordListPage from './pages/TagWordListPage';
import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage';
import PrivateRoute from './components/private_route';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/useAuth'; 
function App() {


  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Navbar />
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route path='/' element={<PrivateRoute><Logout /></PrivateRoute>} />
          <Route path='/' element={<PrivateRoute><WordListPage /></PrivateRoute>} />
          <Route path='/' element={<PrivateRoute><TagBrowserPage /></PrivateRoute>} />
          <Route path='/' element={<PrivateRoute><WordDetailPage /></PrivateRoute>} />
          <Route path='/' element={<PrivateRoute><TagWordListPage /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;