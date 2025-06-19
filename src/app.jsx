import { useState } from 'preact/hooks'
import './app.css'

export function App() {
  const [count, setCount] = useState([])
  const [index, setIndex] = useState(0)

  const dtata = async () => {
    const response = await fetch('https://02-01-b-98151548779877511146s-projects.vercel.app/quotes')
    if (response.ok) {
      const data = await response.json()
      setCount(data)
      setIndex(0)
    } else {
      console.error('Failed to fetch quotes:', response.statusText)
    }
  }

  return (
    <div class="min-h-screen bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 flex items-center justify-center p-6">
      <div class="backdrop-blur-lg bg-white/30 border border-white/50 shadow-2xl rounded-3xl p-8 w-full max-w-xl transition-all duration-300">
        <h1 class="text-5xl font-extrabold text-center text-white drop-shadow-lg mb-6">✨ Quote Explorer</h1>

        {count.length > 0 ? (
          <div class="text-center text-white space-y-6">
            <h2 class="text-2xl font-bold">
              <span class="text-white/80">📖 Book:</span> {count[index].book}
            </h2>
            <h2 class="text-xl text-white/70">
              ✍️ <span class="font-medium">Author:</span> {count[index].author}
            </h2>
            <p class="text-lg italic border-l-4 border-white/60 pl-4 text-white/90">{count[index].quote}</p>

            <div class="flex justify-center gap-4 mt-6">
              <button
                class="bg-white/20 hover:bg-white/40 text-white font-semibold py-2 px-6 rounded-full transition duration-200"
                onClick={() => setIndex((index - 1 + count.length) % count.length)}
              >
                ⬅ Previous
              </button>
              <button
                class="bg-white/20 hover:bg-white/40 text-white font-semibold py-2 px-6 rounded-full transition duration-200"
                onClick={() => setIndex((index + 1) % count.length)}
              >
                Next ➡
              </button>
            </div>
          </div>
        ) : (
          <div class="text-center">
            <p class="text-white mb-4 text-lg">Click below to reveal inspiring quotes 💬</p>
            <button
              class="bg-white/30 hover:bg-white/50 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300"
              onClick={dtata}
            >
              🚀 Load Quotes
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
