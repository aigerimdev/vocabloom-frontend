
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import Logout from './pages/Logout';
import TagDropdown from './components/TagDropdown';
import WordListPage from './pages/WordListPage';
import TagBrowserPage from './pages/TagBrowserPage';


function App() {
  return (
    // Router helps the app show different pages without refreshing the whole screen
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/my-words" element={<WordListPage />} />
        <Route path="/tags" element={<TagBrowserPage />} />
      </Routes>
    </Router>
  );
}

export default App;
