import { useTranslation } from "react-i18next";

function AuthNotice({ isSigningIn, onSignIn }) {
  const { t } = useTranslation();

  return (
    <section className="mx-auto mt-10 w-full max-w-2xl rounded-3xl border border-sky-200 bg-sky-50 p-6 text-slate-900 shadow-sm">
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
          disabled={isSigningIn}
          className="inline-flex rounded-full bg-[#1565C0] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0d4f99] disabled:cursor-not-allowed disabled:bg-sky-300"
        >
          {isSigningIn ? t("auth.signingIn") : t("auth.signInButton")}
        </button>
      </div>
    </section>
  );
}

export default AuthNotice;
