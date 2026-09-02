function App() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
          Government Services Made Simple
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Welcome to SewaPath
        </h1>

        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Discover government services, understand the requirements, and
          follow the steps you need to complete them.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            type="button"
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Explore Services
          </button>

          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Learn More
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;