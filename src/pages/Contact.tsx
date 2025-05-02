import { useState } from "react";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h1 className="text-3xl text-gray-600 mb-4 italic">Get in Touch</h1>
          <p className="mb-6">
            I'd love to hear from you! Whether you're a publisher, author, or fellow book lover,
            feel free to reach out through the form or connect with me on social media.
          </p>
          <div className="bg-rose-gold dark:bg-gray-800 dark:text-maroon-text p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Connect with Me</h2>
            <div className="space-y-3">
              <a
                href="https://www.goodreads.com/user/show/49508616-alisha-neal"
                className="flex items-center font-semibold text-gray-800 dark:text-maroon-text hover:text-rose-gold dark:hover:text-maroon-accent transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/assets/goodreads_icon.avif"
                  alt="Goodreads"
                  className="w-6 h-6 mr-4"
                />
                <span>Goodreads</span>
              </a>
              <a
                href="https://www.instagram.com/keikoreads/"
                className="flex items-center font-semibold text-gray-800 dark:text-maroon-text hover:text-rose-gold dark:hover:text-maroon-accent transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/assets/IG_icon.avif"
                  alt="Instagram"
                  className="w-6 h-6 mr-4"
                />
                <span>Instagram</span>
              </a>
              <a
                href="https://app.thestorygraph.com/profile/keikoalisha"
                className="flex items-center font-semibold text-gray-800 dark:text-maroon-text hover:text-rose-gold dark:hover:text-maroon-accent transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/assets/storygraph_icon.avif"
                  alt="StoryGraph"
                  className="w-6 h-6 mr-4"
                />
                <span>StoryGraph</span>
              </a>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-rose-gold dark:bg-gray-800 dark:text-maroon-text p-6 rounded-2xl shadow-lg border dark:border-gray-700">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 dark:text-maroon-text mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:border-rose-gold focus:ring-rose-gold dark:bg-gray-900 dark:text-maroon-text dark:placeholder-maroon-secondary placeholder:text-gray-400 p-3"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 dark:text-maroon-text mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:border-rose-gold focus:ring-rose-gold dark:bg-gray-900 dark:text-maroon-text dark:placeholder-maroon-secondary placeholder:text-gray-400 p-3"
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-700 dark:text-maroon-text mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:border-rose-gold focus:ring-rose-gold dark:bg-gray-900 dark:text-maroon-text dark:placeholder-maroon-secondary placeholder:text-gray-400 p-3"
                  placeholder="Type your message here..."
                />
              </div>
              <div>
                <a
                  href="mailto:keikoalisha@gmail.com"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-dark-rose hover:bg-rose-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-rose transition dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-maroon-text"
                >
                  Send Message
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}; 