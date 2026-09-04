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

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => {
    setForm((current) => ({
      ...current,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      if (mode === "login") {
        await login({
          email: form.email,
          password: form.password,
        });
      } else {
        await register(form);
      }

      const pending = sessionStorage.getItem(
        "sewapath_pending_application"
      );

      if (pending) {
        sessionStorage.removeItem(
          "sewapath_pending_application"
        );

        const { serviceId, reason } = JSON.parse(pending);

        const res = await createApplication(serviceId, {
          eligible: true,
          reason,
        });

        navigate(`/applications/${res.data._id}`, {
          replace: true,
        });

        return;
      }

      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

        {/* LEFT BRAND PANEL */}
        <div className="relative hidden overflow-hidden bg-ink lg:flex">
          {/* Decorative background */}
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-paper/10" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full border border-paper/10" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* Brand */}
            <Link to="/" className="inline-flex w-fit">
              <Brand dark />
            </Link>

            {/* Main message */}
            <div className="max-w-[520px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-paper/10 bg-paper/5 px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-paper/60">
                <span className="h-1.5 w-1.5 rounded-full bg-marigold" />
                Your government journey, simplified
              </div>

              <h2 className="mb-6 text-[38px] font-semibold leading-[1.12] text-paper xl:text-[46px]">
                Government services
                <br />
                without the confusion.
              </h2>

              <p className="max-w-[470px] text-[16px] leading-[1.7] text-paper/60">
                Find the right service, understand what you need,
                check your eligibility, and know exactly where to go.
              </p>

              {/* Testimonial */}
              <div className="mt-12 border-l-2 border-marigold pl-5">
                <p className="text-[16px] leading-[1.65] text-paper/80">
                  “I didn't know citizenship and passport renewal
                  needed different offices. SewaPath told me exactly
                  where to go.”
                </p>

                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.08em] text-paper/40">
                  SewaPath user · Sunsari district
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <p className="font-mono text-[11px] text-paper/30">
                © {new Date().getFullYear()} SewaPath
              </p>

              <p className="font-mono text-[11px] text-paper/30">
                Nepal
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT LOGIN PANEL */}
        <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-[430px]">

            {/* Mobile brand */}
            <Link
              to="/"
              className="mb-10 block lg:hidden"
            >
              <Brand />
            </Link>

            {/* Header */}
            <div className="mb-8">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-crimson-bg text-lg">
                {mode === "login" ? "👋" : "✨"}
              </div>

              <h1 className="mb-2 text-[30px] font-semibold leading-tight text-ink">
                {mode === "login"
                  ? "Welcome back"
                  : "Create your account"}
              </h1>

              <p className="text-[14px] leading-6 text-ink/60">
                {mode === "login"
                  ? "Log in to continue your SewaPath journey."
                  : "Create an account to save your services and journeys."}
              </p>
            </div>

            {/* Form Card */}
            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-[0_12px_40px_rgba(34,48,63,0.07)] sm:p-7">

              <form onSubmit={handleSubmit} className="space-y-1">

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
                  label="Email address"
                  type="email"
                  required
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.com"
                />

                {mode === "register" && (
                  <Input
                    id="phone"
                    label="Phone number"
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
                  placeholder="••••••••"
                />

                {error && (
                  <div className="my-4 rounded-lg border border-crimson/20 bg-crimson-bg px-3.5 py-3 text-[13px] leading-5 text-crimson">
                    {error}
                  </div>
                )}

                <div className="pt-3">
                  <Button
                    type="submit"
                    className="h-12 w-full rounded-xl"
                    disabled={submitting}
                  >
                    {submitting
                      ? "Please wait..."
                      : mode === "login"
                        ? "Log in"
                        : "Create account"}
                  </Button>
                </div>
              </form>

              {/* Switch mode */}
              <div className="mt-6 border-t border-ink/10 pt-5 text-center">
                <p className="text-[13px] text-ink/60">
                  {mode === "login" ? (
                    <>
                      New to SewaPath?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setError("");
                          setMode("register");
                        }}
                        className="font-semibold text-crimson transition-opacity hover:opacity-75"
                      >
                        Create an account
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setError("");
                          setMode("login");
                        }}
                        className="font-semibold text-crimson transition-opacity hover:opacity-75"
                      >
                        Log in
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Security note */}
            <div className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] text-ink/40">
              <span>🔒</span>
              <span>Your information is secure and never sold.</span>
            </div>

            <p className="mt-6 text-center text-[11px] leading-5 text-ink/30">
              By continuing, you agree to use SewaPath responsibly
              and provide accurate information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
