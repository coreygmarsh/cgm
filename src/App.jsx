import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Library from "./pages/Library";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Beyond from "./pages/Beyond";
import PrivacyPolicy from "./pages/Footer/PrivacyPolicy";
import TermsOfService from "./pages/Footer/TermsofService";
import CookiePolicy from "./pages/Footer/CookiePolicy";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="bg-black">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/beyond" element={<Beyond/>} />

          <Route path="/privacy" element={<PrivacyPolicy/>} />
          <Route path="/terms" element={<TermsOfService/>} />
          <Route path="/cookies" element={<CookiePolicy/>} />
        </Routes>
      </div>
    </Router>
  );
}
