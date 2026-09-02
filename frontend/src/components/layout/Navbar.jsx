
function Navbar() {
  return (
    <header className="border-b border-var(--color-secondary) bg-var(--color-paper)">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Logo />

        <div className="flex items-center gap-6">
          <a href="#" className="text-sm font-medium">
            Services
          </a>

          <a href="#" className="text-sm font-medium">
            How It Works
          </a>

          <button className="rounded-lg bg-var(--color-primary) px-5 py-2.5 text-sm font-semibold text-white">
            Login
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;