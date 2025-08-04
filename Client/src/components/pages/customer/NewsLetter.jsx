import React from "react";

const NewsLetter = () => {
  return (
    <div className="py-14 px-4 md:px-0">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
          Stay Updated with Fresh Deals!
        </h2>
        <p className="text-gray-700 mb-6">
          Subscribe to our newsletter and get the latest updates on grocery offers,
          seasonal discounts, and new arrivals directly to your inbox.
        </p>

        <form className="flex flex-col md:flex-row items-center justify-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            required
            className="w-full md:w-[300px] px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-200"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewsLetter;
