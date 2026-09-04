import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import Brand from "../Brand";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

function PublicLayout() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [lang, setLang] = useState("EN");

  return (
    <div className="min-h-screen bg-paper">
      <nav className="flex items-center justify-between border-b border-ink/15 px-6 py-18px md:px-12">
        <Link to="/">
          <Brand />
        </Link>

        <div className="hidden gap-30px text-[14.5px] font-medium md:flex">
          <Link to="/services" className="text-ink/70 hover:text-ink">
            Find a service
          </Link>
          <span className="cursor-default text-ink/70">How it works</span>
          <span className="cursor-default text-ink/70">For offices</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setLang((l) => (l === "EN" ? "ने" : "EN"))}
            className="rounded-2xl border-[1.5px] border-ink/15 px-3 py-1.5 font-mono text-xs text-ink/60"
          >
            {lang === "EN" ? "EN / ने" : "ने / EN"}
          </button>

          {isAuthenticated ? (
            <>
              <Button
                as={Link}
                to={isAdmin ? "/admin" : "/dashboard"}
                variant="ghost"
                size="sm"
              >
                {isAdmin ? "Staff panel" : "Dashboard"}
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost" size="sm">
                Log in
              </Button>
              <Button as={Link} to="/services" size="sm">
                Check eligibility
              </Button>
            </>
          )}
        </div>
      </nav>

      <Outlet />
    </div>
  );
}

export default PublicLayout;
