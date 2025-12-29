import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EventPage } from './presentation/pages/EventPage';
import { PresentationPage } from './presentation/pages/PresentationPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dynamic event routes */}
        <Route path="/eventos/:slug" element={<EventPage />} />
        <Route path="/eventos/:slug/presentacion" element={<PresentationPage />} />
        
        {/* Default redirect to test event */}
        <Route path="/" element={<Navigate to="/eventos/tefo-geli" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
