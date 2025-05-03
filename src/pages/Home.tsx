import { SmartLink } from '../components/SmartLink';
import { useBooks } from '../hooks/useBooks';
import { BookCard } from '../components/BookCard';
// import React from 'react';

export const Home = () => {
  const { books, loading } = useBooks('review_date', 'desc', undefined, 1, 3);
  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-6">
        {/* Left Column: Profile Image + Socials */}
        <div className="flex flex-col items-center gap-6 mt-10 w-full">
          <img
            src="/assets/keiko_Reads_2.png"
            alt="Keiko Reads Profile"
            className="w-40 h-40 rounded-full object-cover border-4 border-rose-300 shadow-lg mb-4"
          />
          {/* Social Section */}
          <div className="text-center w-full">
            <h2 className="text-lg text-gray-700 mb-3 font-normal">Social Media</h2>
            <div className="flex justify-center items-center gap-3 mb-2 bg-[#E6D7D7] dark:bg-gray-800 p-3 rounded-lg shadow w-fit mx-auto dark:text-maroon-text">
              <SmartLink to="https://www.instagram.com/keikoreads/">
                <img src="/assets/IG_icon.avif" alt="Instagram" className="w-7 h-7" />
              </SmartLink>
              <SmartLink to="https://app.thestorygraph.com/profile/keikoalisha">
                <img src="/assets/storygraph_icon.avif" alt="StoryGraph" className="w-7 h-7" />
              </SmartLink>
              <SmartLink to="https://www.goodreads.com/user/show/49508616-alisha-neal">
                <img src="/assets/goodreads_icon.avif" alt="Goodreads" className="w-7 h-7" />
              </SmartLink>
            </div>
          </div>
        </div>
        {/* Right Column: Welcome Card */}
        <div className="flex flex-col justify-center w-full">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center shadow dark:text-maroon-text">
            <h2 className="mb-2 text-xl font-semibold">Hi friend!</h2>
            <p className="m-0 leading-relaxed text-base">
              Welcome to my cozy reading nook on the web. I review advance reader copies (ARCs) from NetGalley and share all the bookish feels—whether it's swooning over a new romance, getting lost in a twisty thriller, or curling up with a heartwarming story. Grab a blanket, make some tea, and let's chat about books!
            </p>
          </div>
        </div>
      </div>
      {/* Book Reviews Row */}
      <div className="w-full mt-8">
        <h1 className="text-2xl text-gray-600 mb-6 font-normal text-center">Latest Reviews</h1>
        <div className="flex gap-6 overflow-x-auto pb-4 px-2 scrollbar-thin scrollbar-thumb-rose-300 scrollbar-track-gray-100">
          {loading ? (
            <div className="text-center w-full">Loading...</div>
          ) : books.length === 0 ? (
            <div className="text-center w-full">No reviews found.</div>
          ) : (
            books.map((book) => (
              <div key={book.id} className="min-w-[300px] max-w-xs flex-shrink-0">
                <BookCard book={book} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}; 