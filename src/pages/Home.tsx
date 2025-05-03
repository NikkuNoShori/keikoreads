// import React from 'react';

export const Home = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-10 mb-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6 mt-10 w-full">
          {/* Welcome Box */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center shadow dark:text-maroon-text">
            <h2 className="mb-2 text-xl font-semibold">Hi friend!</h2>
            <p className="m-0 leading-relaxed text-base">
              Welcome to my cozy reading nook on the web. I review advance reader copies (ARCs) from NetGalley and share all the bookish feels—whether it's swooning over a new romance, getting lost in a twisty thriller, or curling up with a heartwarming story. Grab a blanket, make some tea, and let's chat about books!
            </p>
          </div>
          {/* Social Section */}
          <div className="text-center">
            <h2 className="text-lg text-gray-700 mb-3 font-normal">Social Media</h2>
            <div className="flex justify-center items-center gap-3 mb-5 bg-[#E6D7D7] dark:bg-gray-800 p-3 rounded-lg shadow w-fit mx-auto dark:text-maroon-text">
              <a href="https://www.instagram.com/keikoreads/" target="_blank" rel="noopener noreferrer">
                <img src="/assets/IG_icon.avif" alt="Instagram" className="w-7 h-7" />
              </a>
              <a href="https://app.thestorygraph.com/profile/keikoalisha" target="_blank" rel="noopener noreferrer">
                <img src="/assets/storygraph_icon.avif" alt="StoryGraph" className="w-7 h-7" />
              </a>
              <a href="https://www.goodreads.com/user/show/49508616-alisha-neal" target="_blank" rel="noopener noreferrer">
                <img src="/assets/goodreads_icon.avif" alt="Goodreads" className="w-7 h-7" />
              </a>
            </div>
            <img src="/assets/netgalley.avif" alt="NetGalley Member" className="w-44 h-auto mx-auto my-2" />
          </div>
        </div>
        {/* Reviews Section */}
        <div className="text-center w-full">
          <h1 className="text-2xl text-gray-600 mb-6 font-normal">Reviews</h1>
          <div className="flex flex-col gap-8 items-center">
            {/* Review Card 1 */}
            <div className="w-full max-w-xs relative group">
              <a href="#" className="block">
                <img src="/assets/WSM.avif" alt="Where Shadows Meet" className="w-full h-auto rounded-lg shadow-lg" />
                <div className="bg-gray-400/95 p-4 absolute bottom-0 left-0 right-0 rounded-b-lg transition-all duration-300 h-1/4 flex flex-col justify-center group-hover:h-1/2 group-hover:bg-gray-500/95">
                  <h3 className="text-white text-lg m-0 transition-all">Where Shadows Meet</h3>
                  <p className="text-white/90 text-base m-0">Patrice Caldwell</p>
                  <p className="text-white/80 text-sm m-0">April 22, 2025</p>
                </div>
              </a>
            </div>
            {/* Review Card 2 */}
            <div className="w-full max-w-xs relative group">
              <a href="#" className="block">
                <img src="/assets/DotA.avif" alt="Death of the Author" className="w-full h-auto rounded-lg shadow-lg" />
                <div className="bg-gray-400/95 p-4 absolute bottom-0 left-0 right-0 rounded-b-lg transition-all duration-300 h-1/4 flex flex-col justify-center group-hover:h-1/2 group-hover:bg-gray-500/95">
                  <h3 className="text-white text-lg m-0 transition-all">Death of the Author</h3>
                  <p className="text-white/90 text-base m-0">Nnedi Okorafor</p>
                  <p className="text-white/80 text-sm m-0">April 8th, 2025</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Divider */}
      <div className="border-t border-gray-300 my-8 w-11/12 mx-auto" />
      {/* NetGalley Section */}
      <div className="bg-white dark:bg-maroon-container p-6 pb-10 text-center mt-0 rounded-lg shadow dark:text-maroon-text">
        <h2 className="text-2xl text-gray-700 mb-6 font-normal">What is NetGalley?</h2>
        <div className="max-w-2xl mx-auto relative pb-[42.1875%] h-0 overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/IKLQSQ2Pxyk?si=GDXnR1rgcCYNZCxy"
            title="Welcome to NetGalley"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full border-0"
          />
        </div>
      </div>
      {/* Footer handled by Layout */}
    </div>
  );
}; 