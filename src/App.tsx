// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import HomePage from './pages/HomePage';
// import Navbar from './components/Navbar';
// import Logout from './pages/Logout';
// import WordListPage from './pages/WordListPage';
// import TagBrowserPage from './pages/TagBrowserPage';
// import WordDetailPage from './pages/WordDetailPage';
// import TagWordListPage from './pages/TagWordListPage';
// import WelcomePage from './pages/WelcomePage';
// import LoginPage from './pages/LoginPage';
// import SignupPage from './pages/SignupPage';





// function App() {
//   return (
//     // Router helps the app show different pages without refreshing the whole screen
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/logout" element={<Logout />} />
//         <Route path="/my-words" element={<WordListPage />} />
//         <Route path="/tags" element={<TagBrowserPage />} />
//         <Route path="/my-words/:word" element={<WordDetailPage />} />
//         <Route path="/tags/:tagName" element={<TagWordListPage />} />
//         {/* Auth Routes */}
//         <Route path="/welcome" element={<WelcomePage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignupPage />} />

//       </Routes>
//     </Router>
//   );
// }

// export default App;
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
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check localStorage or cookie/token to set login status
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      {isLoggedIn && <Navbar />}
      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route path="/" element={isLoggedIn ? <HomePage /> : <Navigate to="/welcome" />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/my-words" element={<WordListPage />} />
        <Route path="/tags" element={<TagBrowserPage />} />
        <Route path="/my-words/:word" element={<WordDetailPage />} />
        <Route path="/tags/:tagName" element={<TagWordListPage />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/welcome" />} />
      </Routes>
    </Router>
  );
}

export default App;
