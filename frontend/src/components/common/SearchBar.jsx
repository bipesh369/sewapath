import { useState } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    onSearch(query.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex max-w-2xl gap-3"
    >
      <label htmlFor="service-search" className="sr-only">
        Search for a government service
      </label>

      <input
        id="service-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="What are you trying to do?"
        autoComplete="off"
        className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
      />

      <button
        type="submit"
        className="rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;