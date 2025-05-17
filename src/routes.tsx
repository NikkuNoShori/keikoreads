import { Routes, Route, useParams, Navigate } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import { SmartLink } from './components/SmartLink';
import { ProtectedRoute } from './components/ProtectedRoute';
import { getBookById } from './utils/bookService';
import { slugify } from './utils/formatters';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const Settings = lazy(() => import('./pages/Settings'));
const ReviewDetail = lazy(() => import('./pages/ReviewDetail'));
const FontTest = lazy(() => import('./pages/FontTest'));

// Create a verification notice page
const VerifyEmail = () => (
  <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
    <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Verify Your Email</h1>
    <div className="p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded dark:bg-blue-900 dark:text-blue-200 mb-6">
      <p>Please check your email for a verification link. You need to verify your email before accessing this page.</p>
    </div>
    <p className="text-gray-600 dark:text-gray-400 mb-4">
      If you don't see the email, check your spam folder or request a new verification email.
    </p>
    <div className="flex justify-between">
      <SmartLink to="/" className="text-rose-600 hover:underline">Go back home</SmartLink>
      <button className="text-rose-600 hover:underline">Resend verification</button>
    </div>
  </div>
);

const NotFound = () => (
  <div className="w-full text-center py-20">
    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
    <p className="text-lg text-gray-600 mb-8">Sorry, the page you are looking for does not exist.</p>
    <SmartLink to="/" className="text-rose-600 hover:underline">Go back home</SmartLink>
  </div>
);

// Redirect from /reviews/:id to /reviews/:slug
const RedirectToSlug = () => {
  const { id } = useParams();
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlug = async () => {
      if (!id) return;
      const { data } = await getBookById(id);
      if (data && data.title) {
        setSlug(slugify(data.title));
      }
    };
    fetchSlug();
  }, [id]);

  if (slug) {
    return <Navigate to={`/reviews/${slug}`} replace />;
  }
  return null;
};

export const AppRoutes = () => (
  <Suspense fallback={<div className="w-full text-center py-20 text-lg">Loading...</div>}>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      
      {/* Protected Routes */}
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute requireAuth={true}>
            <Settings />
          </ProtectedRoute>
        } 
      />
      
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
        path="/reviews/:slug"
        element={
          <ProtectedRoute requireAuth={false}>
            <ReviewDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reviews/:id"
        element={<RedirectToSlug />}
      />
      
      {/* Catch all - 404 */}
      <Route path="*" element={<NotFound />} />

      {/* New route for FontTest */}
      <Route path="/fonttest" element={<FontTest />} />
    </Routes>
  </Suspense>
); 