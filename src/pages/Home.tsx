import { SmartLink } from '../components/SmartLink';
import { useBooks } from '../hooks/useBooks';
import { BookCard } from '../components/BookCard';
// import React from 'react';

export const Home = () => {
  const { books, loading } = useBooks('review_date', 'desc', undefined, 1, 3);
  return (
    <div className="w-full mx-auto px-4 py-6">
      {/* Grid: 2 columns, left col 1 row (flex-col, top-aligned), right col 3 rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* Left Column: flex-col container, top-aligned, horizontally centered */}
        <div className="flex flex-col items-center justify-start w-full gap-2">
          <div className="w-full max-w-sm mx-auto mb-2">
            <img
              src="/assets/keiko_Reads_2.png"
              alt="Keiko Reads Profile"
              className="w-full aspect-square rounded-full object-cover border-4 border-rose-gold dark:border-maroon-card shadow-lg"
            />
          </div>
          <div className="bg-white dark:bg-transparent py-3 px-3 rounded-lg text-center shadow dark:text-maroon-text w-full flex flex-col justify-center min-h-[100px] max-w-sm mx-auto mb-4">
            <h2 className="mb-1 text-2xl font-semibold">Hi friend!</h2>
            <p className="m-0 leading-relaxed text-base flex-1 flex items-center justify-center">
              Welcome to my cozy reading nook on the web. I review advance reader copies (ARCs) from NetGalley and share all the bookish feels—whether it's swooning over a new romance, getting lost in a twisty thriller, or curling up with a heartwarming story. Grab a blanket, make some tea, and let's chat about books!
            </p>
          </div>
          <div className="flex flex-col items-center w-full mt-2">
            {/* Social Media Section: Centered between welcome card and divider */}
            <div className="flex flex-col items-center w-full max-w-md mx-auto">
              <h2 className="text-2xl text-gray-700 mb-2 font-normal">Social Media</h2>
              <div className="flex justify-center items-center gap-3 bg-[#E6D7D7] dark:bg-gray-800 p-2 rounded-lg shadow w-fit dark:text-maroon-text mb-2">
                <SmartLink to="https://www.instagram.com/keikoreads/">
                  <img src="/assets/IG_icon.avif" alt="Instagram" className="w-10 h-10" />
                </SmartLink>
                <SmartLink to="https://app.thestorygraph.com/profile/keikoalisha">
                  <img src="/assets/storygraph_icon.avif" alt="StoryGraph" className="w-10 h-10" />
                </SmartLink>
                <SmartLink to="https://www.goodreads.com/user/show/49508616-alisha-neal">
                  <img src="/assets/goodreads_icon.avif" alt="Goodreads" className="w-10 h-10" />
                </SmartLink>
              </div>
            </div>
            {/* Divider between social media and NetGalley image, matches welcome card width */}
            <div className="w-full flex justify-center my-2">
              <div className="border-t border-gray-300 dark:border-gray-600 w-full max-w-md" />
            </div>
            <img
              src="/assets/netgalley.avif"
              alt="NetGalley Member"
              className="w-32 h-auto rounded-lg drop-shadow-xl mt-2 mb-2"
              style={{ background: 'transparent' }}
            />
          </div>
        </div>
        {/* Right Column: vertical stack of reviews */}
        <div className="flex flex-col items-center justify-start w-full gap-4">
          {/* Latest Reviews header with dividers */}
          <div className="relative flex items-center py-3 w-full">
            <div className="flex-grow border-t border-rose-100 dark:border-maroon-accent"></div>
            <h1 className="text-2xl text-gray-600 font-serif italic tracking-wide text-center mx-3 dark:text-maroon-text">Latest Reviews</h1>
            <div className="flex-grow border-t border-rose-100 dark:border-maroon-accent"></div>
          </div>
          {loading ? (
            <div className="text-center w-full">Loading...</div>
          ) : books.length === 0 ? (
            <div className="text-center w-full">No reviews found.</div>
          ) : (
            <div className="w-full flex flex-col gap-4 items-center">
              {books
                .sort((a, b) => {
                  const dateA = a.review_date ? new Date(a.review_date).getTime() : 0;
                  const dateB = b.review_date ? new Date(b.review_date).getTime() : 0;
                  return dateB - dateA;
                })
                .slice(0, 3)
                .map((book) => (
                  <div key={book.id} className="w-[85%] max-w-[250px] mx-auto">
                    <BookCard book={book} />
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 