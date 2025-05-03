import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Reviews } from './pages/Reviews';
import { Contact } from './pages/Contact';
import { BookDetail } from './pages/BookDetail';

const NotFound = () => (
  <div className="w-full text-center py-20">
    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
    <p className="text-lg text-gray-600 mb-8">Sorry, the page you are looking for does not exist.</p>
    <a href="/" className="text-rose-600 hover:underline">Go back home</a>
  </div>
);

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/reviews" element={<Reviews />} />
    <Route path="/reviews/:id" element={<BookDetail />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
); 