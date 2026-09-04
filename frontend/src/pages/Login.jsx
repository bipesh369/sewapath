import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Brand from "../components/Brand";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { createApplication } from "../api/applications.api";

function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }

      // If they came here from an eligibility result, pick up right where
      // they left off and actually start that goal now that they're in.
      const pending = sessionStorage.getItem("sewapath_pending_application");
      if (pending) {
        sessionStorage.removeItem("sewapath_pending_application");
        const { serviceId, reason } = JSON.parse(pending);
        const res = await createApplication(serviceId, { eligible: true, reason });
        navigate(`/applications/${res.data._id}`, { replace: true });
        return;
      }

      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-ink p-12 text-paper md:flex">
        <Link to="/">
          <Brand dark />
        </Link>

        <div className="max-w-420px">
          <p className="text-[26px] font-semibold leading-[1.35] text-paper">
            &ldquo;I didn&rsquo;t know citizenship and passport renewal needed{" "}
            <span className="text-marigold-light">different offices</span> —
            SewaPath told me exactly where to go, in Nepali.&rdquo;
          </p>
          <p className="mt-5 font-mono text-[13px] text-paper/50">
            — SewaPath user, Sunsari district
          </p>
        </div>

        <p className="text-xs text-paper/40">© {new Date().getFullYear()} SewaPath</p>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-16 md:px-16">
        <div className="w-full max-w-380px">
          <Link to="/" className="mb-8 block md:hidden">
            <Brand />
          </Link>

          <h1 className="mb-1.5 text-[26px]">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mb-7 text-[14.5px] text-ink/60">
            {mode === "login"
              ? "Log in to continue your journey."
              : "It only takes a minute — no documents needed to sign up."}
          </p>

          <form onSubmit={handleSubmit}>
            {mode === "register" && (
              <Input
                id="name"
                label="Full name"
                type="text"
                required
                value={form.name}
                onChange={update("name")}
                placeholder="Sita Sharma"
              />
            )}
            <Input
              id="email"
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={update("email")}
              placeholder="you@example.com"
            />
            {mode === "register" && (
              <Input
                id="phone"
                label="Phone (optional)"
                type="tel"
                value={form.phone}
                onChange={update("phone")}
                placeholder="98XXXXXXXX"
              />
            )}
            <Input
              id="password"
              label="Password"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={update("password")}
              placeholder="••••••••••"
            />

            {error && <p className="mb-4 text-[13px] text-clay">{error}</p>}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
            </Button>
          </form>

          <p className="mt-5 text-center text-[13.5px] text-ink/60">
            {mode === "login" ? (
              <>
                New to SewaPath?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="font-semibold text-crimson"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="font-semibold text-crimson"
                >
                  Log in
                </button>
              </>
            )}
          </p>

          <p className="mt-4 text-center text-[12px] text-ink/40">
            🔒 Your information is encrypted and never sold
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
