function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="/"
          className="text-xl font-bold text-gray-900"
        >
          SewaPath
        </a>

        <nav aria-label="Main navigation">
          <a
            href="/services"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
          >
            Services
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;