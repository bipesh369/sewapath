import Navbar from "../components/layout/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Government services, simplified
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Find the government service you need.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Discover eligibility, required documents, responsible
              offices, and the steps you need to follow.
            </p>

            <div className="mx-auto mt-8 flex max-w-2xl gap-3">
              <input
                type="search"
                placeholder="What are you trying to do?"
                aria-label="Search for a government service"
                className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
              />

              <button
                type="button"
                className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800"
              >
                Search
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;