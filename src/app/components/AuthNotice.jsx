import { useState } from "react";
import { useTranslation } from "react-i18next";

function AuthNotice({
  isGoogleSigningIn,
  isDemoSigningIn,
  signInError,
  onSignIn,
  onDemoSignIn,
}) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onDemoSignIn({
      email: email.trim(),
      password,
    });
  };

  return (
    <section className="mx-auto mt-10 w-full max-w-4xl rounded-3xl border border-sky-200 bg-sky-50 p-6 text-slate-900 shadow-sm">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">
              {t("auth.label")}
            </p>
            <h2 className="mt-2 text-2xl font-bold">{t("auth.signInTitle")}</h2>
          </div>

          <p className="text-sm leading-6 sm:text-base">
            {t("auth.signInDescription")}
          </p>

          <button
            type="button"
            onClick={onSignIn}
            disabled={isGoogleSigningIn || isDemoSigningIn}
            className="inline-flex rounded-full bg-[#1565C0] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0d4f99] disabled:cursor-not-allowed disabled:bg-sky-300"
          >
            {isGoogleSigningIn ? t("auth.signingIn") : t("auth.signInButton")}
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              {t("auth.demoLabel")}
            </p>
            <h3 className="text-xl font-bold text-slate-900">
              {t("auth.demoTitle")}
            </h3>
            <p className="text-sm leading-6 text-slate-600">
              {t("auth.demoDescription")}
            </p>
          </div>

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                {t("auth.emailLabel")}
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t("auth.emailPlaceholder")}
                autoComplete="email"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#1565C0] focus:ring-2 focus:ring-sky-100"
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-slate-700">
                {t("auth.passwordLabel")}
              </span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t("auth.passwordPlaceholder")}
                autoComplete="current-password"
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#1565C0] focus:ring-2 focus:ring-sky-100"
                required
              />
            </label>

            {signInError ? (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {t("auth.signInError")}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isDemoSigningIn || isGoogleSigningIn}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isDemoSigningIn ? t("auth.demoSigningIn") : t("auth.demoButton")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default AuthNotice;
