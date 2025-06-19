import { useState, useEffect } from 'preact/hooks';
import './app.css';

/**
 * @typedef {object} Quote
 * @property {string} book
 * @property {string} author
 * @property {string} quote
 */

export function App() {
  /** @type {[Quote[], import('preact/hooks').StateUpdater<Quote[]>]} */
  const [quotes, setQuotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Data Fetching using useEffect and .then()/.catch() ---
  useEffect(() => {
    setLoading(true);
    setError(null); // Clear any previous errors

    fetch('https://02-01-b-98151548779877511146s-projects.vercel.app/quotes')
      .then(response => {
        if (!response.ok) {
          // If response is not OK (e.g., 404, 500), throw an error
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        return response.json(); // Parse the JSON body
      })
      .then(data => {
        setQuotes(data);
        if (data.length > 0) {
          // Set a random initial index from the *entire* fetched data
          setCurrentIndex(Math.floor(Math.random() * data.length));
        } else {
          setCurrentIndex(0); // If no data, reset index
        }
      })
      .catch(err => {
        // Catch any errors during the fetch or JSON parsing
        console.error('Failed to fetch quotes:', err);
        setError('Failed to load quotes. Please check your internet connection or try again later.');
      })
      .finally(() => {
        // This runs regardless of success or failure
        setLoading(false);
      });

  }, []); // Empty dependency array means this effect runs only once after the initial render

  // --- Random Index Selection Logic ---
  const getTrulyRandomIndex = () => {
    if (quotes.length <= 1) {
      return 0; // If 0 or 1 quote, there's no "random different" index
    }

    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * quotes.length);
    } while (newIndex === currentIndex); // Keep generating until it's different from the current one

    return newIndex;
  };

  const handleNextQuote = () => {
    if (quotes.length === 0) return;
    setCurrentIndex(getTrulyRandomIndex());
  };

  // For "Previous", if you want it to be random but not predictable,
  // the `getTrulyRandomIndex` works. If you wanted to go back to the
  // *last displayed quote in the random sequence*, you'd need to store
  // a history of `currentIndex` values in a state variable (e.g., an array).
  // For now, I'll make "Previous" also generate a new random quote.
  const handlePreviousQuote = () => {
    if (quotes.length === 0) return;
    setCurrentIndex(getTrulyRandomIndex());
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 flex items-center justify-center p-6">
      <div class="backdrop-blur-lg bg-white/30 border border-white/50 shadow-2xl rounded-3xl p-8 w-full max-w-xl transition-all duration-300">
        <h1 class="text-5xl font-extrabold text-center text-black drop-shadow-lg mb-6">✨ Quote Explorer</h1>

        {loading && (
          <div class="text-center text-black/70 text-lg p-4">
            Loading inspiring quotes...
          </div>
        )}

        {error && (
          <div class="text-center text-red-700 font-semibold text-lg p-4">
            Error: {error}
          </div>
        )}

        {/* Display quotes if not loading, no error, and quotes exist */}
        {!loading && !error && quotes.length > 0 ? (
          <div class="text-center text-black space-y-6">
            <h2 class="text-2xl font-bold">
              <span class="text-grey">📖 Book:</span> {quotes[currentIndex].book}
            </h2>
            <h2 class="text-xl text-black/70">
              ✍️ <span class="font-medium">Author:</span> {quotes[currentIndex].author}
            </h2>
            <h1 class="text-xl italic border-l-4 border-white pl-4 text-red">{quotes[currentIndex].quote}</h1>

            <div class="flex justify-center gap-4 mt-6">
              <button
                class="bg-white/20 hover:bg-white/40 text-black font-semibold py-2 px-6 rounded-full transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlePreviousQuote}
                disabled={quotes.length <= 1} // Disable if not enough quotes for unique random
              >
                ⬅ Previous
              </button>
              <button
                class="bg-white/20 hover:bg-white/40 text-black font-semibold py-2 px-6 rounded-full transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleNextQuote}
                disabled={quotes.length <= 1} // Disable if not enough quotes for unique random
              >
                Next ➡
              </button>
            </div>
          </div>
        ) : (
          // Show "Load Quotes" button only if not loading, no error, and no quotes fetched yet
          !loading && !error && quotes.length === 0 && (
            <div class="text-center">
              <p class="text-white mb-4 text-lg">Click below to reveal inspiring quotes 💬</p>
              {/* The button now triggers the fetch only if quotes are not already loaded */}
              <button
                class="bg-white/30 hover:bg-white/50 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300"
                onClick={() => {
                  // Re-trigger the useEffect by calling the fetch function manually if needed,
                  // or just let useEffect handle it on first mount.
                  // Since useEffect with [] already fetches on mount, this button is less necessary,
                  // unless you want a manual re-fetch after an error, for example.
                  // For now, it will effectively do nothing if quotes are already loaded.
                  // If you want it to re-fetch, you'd need to put the fetch logic in a separate function
                  // and call it here. For simplicity, let's assume useEffect handles the initial load.
                }}
              >
                🚀 Load Quotes
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}