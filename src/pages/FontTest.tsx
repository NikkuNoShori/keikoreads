import React from 'react';

// NOTE: To see these fonts, add the following to your index.html <head>:
// <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Great+Vibes&family=Allura&family=Parisienne&family=Dancing+Script&display=swap" rel="stylesheet">

const fonts = [
  { name: 'Alex Brush', style: { fontFamily: "'Alex Brush', cursive" } },
  { name: 'Great Vibes', style: { fontFamily: "'Great Vibes', cursive" } },
  { name: 'Allura', style: { fontFamily: "'Allura', cursive" } },
  { name: 'Parisienne', style: { fontFamily: "'Parisienne', cursive" } },
  { name: 'Dancing Script', style: { fontFamily: "'Dancing Script', cursive" } },
];

export default function FontTest() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <h2 className="text-2xl font-bold mb-8 text-center">Elegant Script Font Preview</h2>
      {fonts.map((font) => (
        <div key={font.name} className="mb-10 text-center">
          <div className="text-lg text-gray-500 mb-2">{font.name}</div>
          <div
            className="text-5xl mb-2"
            style={font.style}
          >
            Book Reviews
          </div>
          <hr className="my-4" />
        </div>
      ))}
      <div className="text-center text-sm text-gray-400 mt-8">
        Add the Google Fonts link (see code) to your <code>index.html</code> to see the fonts.
      </div>
    </div>
  );
} 