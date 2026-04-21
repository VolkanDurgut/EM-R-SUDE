import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UploadPage from './pages/Upload';
import QRGenerator from './pages/QRGenerator';
import AdminGallery from './pages/AdminGallery';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/qr-admin" element={<QRGenerator />} />
      <Route path="/admin-gallery" element={<AdminGallery />} />
    </Routes>
  );
}

export default App;