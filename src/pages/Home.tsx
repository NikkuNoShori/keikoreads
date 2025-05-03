import { SmartLink } from '../components/SmartLink';
import { useBooks } from '../hooks/useBooks';
import { BookCard } from '../components/BookCard';
// import React from 'react';

export const Home = () => {
  const { books, loading } = useBooks('review_date', 'desc', undefined, 1, 3);
  return (
    <div className="w-full flex justify-center items-start bg-rose-gold dark:bg-maroon-outer">
      {/* Center container with 25% background visible on each side */}
      <div className="w-full max-w-[1600px] mx-auto px-8 py-8 bg-white dark:bg-maroon-container shadow-lg rounded-xl flex flex-col">
        {/* Grid: 2 columns, left col 1 row (flex-col, top-aligned), right col 3 rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Left Column: flex-col container, top-aligned, horizontally centered */}
          <div className="flex flex-col items-center justify-start w-full">
            <img
              src="/assets/keiko_Reads_2.png"
              alt="Keiko Reads Profile"
              className="w-72 h-72 rounded-full object-cover border-4 border-rose-gold dark:border-maroon-card shadow-lg mb-4"
            />
            <div className="bg-white dark:bg-gray-800 py-4 px-4 rounded-lg text-center shadow dark:text-maroon-text w-full flex flex-col justify-center min-h-[120px] max-w-md mx-auto mb-8">
              <h2 className="mb-1 text-2xl font-semibold">Hi friend!</h2>
              <p className="m-0 leading-relaxed text-base flex-1 flex items-center justify-center">
                Welcome to my cozy reading nook on the web. I review advance reader copies (ARCs) from NetGalley and share all the bookish feels—whether it's swooning over a new romance, getting lost in a twisty thriller, or curling up with a heartwarming story. Grab a blanket, make some tea, and let's chat about books!
              </p>
            </div>
            <div className="flex flex-col items-center w-full mt-2">
              {/* Social Media Section: Centered between welcome card and divider */}
              <div className="flex flex-col items-center w-full max-w-md mx-auto">
                <h2 className="text-2xl text-gray-700 mb-2 font-normal">Social Media</h2>
                <div className="flex justify-center items-center gap-4 bg-[#E6D7D7] dark:bg-gray-800 p-2 rounded-lg shadow w-fit dark:text-maroon-text mb-2">
                  <SmartLink to="https://www.instagram.com/keikoreads/">
                    <img src="/assets/IG_icon.avif" alt="Instagram" className="w-12 h-12" />
                  </SmartLink>
                  <SmartLink to="https://app.thestorygraph.com/profile/keikoalisha">
                    <img src="/assets/storygraph_icon.avif" alt="StoryGraph" className="w-12 h-12" />
                  </SmartLink>
                  <SmartLink to="https://www.goodreads.com/user/show/49508616-alisha-neal">
                    <img src="/assets/goodreads_icon.avif" alt="Goodreads" className="w-12 h-12" />
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
                className="w-48 h-auto rounded-lg drop-shadow-xl mt-2 mb-2"
                style={{ background: 'transparent' }}
              />
            </div>
          </div>
          {/* Right Column: 3 rows */}
          <div className="grid grid-rows-3 gap-4 w-full">
            {/* Row 1: Latest Reviews */}
            <div className="flex flex-col items-center justify-center w-full">
              <h1 className="text-2xl text-gray-600 mb-1 font-normal text-center w-full">Latest Reviews</h1>
              <div className="flex gap-4 overflow-x-auto pb-0 px-0 scrollbar-thin scrollbar-thumb-rose-300 scrollbar-track-gray-100 items-center justify-center w-full">
                {loading ? (
                  <div className="text-center w-full">Loading...</div>
                ) : books.length === 0 ? (
                  <div className="text-center w-full">No reviews found.</div>
                ) : (
                  books.map((book) => (
                    <div key={book.id} className="min-w-[340px] max-w-md flex-shrink-0 flex items-center justify-center">
                      <BookCard book={book} />
                    </div>
                  ))
                )}
              </div>
            </div>
            {/* Row 2: Reserved for future content */}
            <div className="flex items-center justify-center w-full"></div>
            {/* Row 3: Reserved for future content */}
            <div className="flex items-center justify-center w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}; 