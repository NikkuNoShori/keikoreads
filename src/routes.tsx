import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Reviews } from './pages/Reviews';
import { Contact } from './pages/Contact';
import { BookDetail } from './pages/BookDetail';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { AuthCallback } from './pages/AuthCallback';
import { SmartLink } from './components/SmartLink';
import { ProtectedRoute } from './components/ProtectedRoute';

const NotFound = () => (
  <div className="w-full text-center py-20">
    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
    <p className="text-lg text-gray-600 mb-8">Sorry, the page you are looking for does not exist.</p>
    <SmartLink to="/" className="text-rose-600 hover:underline">Go back home</SmartLink>
  </div>
);

export const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    
    {/* Authentication Routes */}
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/auth/callback" element={<AuthCallback />} />
    
    {/* Both public access and secure operations */}
    <Route 
      path="/reviews" 
      element={
        <ProtectedRoute requireAuth={false}>
          <Reviews />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/reviews/:id" 
      element={
        <ProtectedRoute requireAuth={false}>
          <BookDetail />
        </ProtectedRoute>
      } 
    />
    
    {/* Catch all - 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
); 