import { missingFirebaseEnvKeys } from "../../firebaseConfig";
import { useTranslation } from "react-i18next";

function FirebaseConfigNotice() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto mt-10 w-full max-w-2xl rounded-3xl border border-red-200 bg-red-50 p-6 text-red-950 shadow-sm">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">
            {t("firebase.setupRequired")}
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            {t("firebase.missingEnvTitle")}
          </h2>
        </div>

        <p className="text-sm leading-6 sm:text-base">
          {t("firebase.description").split(".env.local")[0]}
          <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-sm">
            .env.local
          </code>
          {t("firebase.description").split(".env.local")[1]}
        </p>

        <div>
          <p className="text-sm font-semibold">{t("firebase.missingKeys")}</p>
          <ul className="mt-2 space-y-1 rounded-2xl bg-white/80 p-4 text-sm">
            {missingFirebaseEnvKeys.map((key) => (
              <li key={key} className="font-mono">
                {key}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-4 text-sm leading-6">
          <p className="font-semibold">{t("firebase.setupSteps")}</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>{t("firebase.step1")}</li>
            <li>{t("firebase.step2")}</li>
            <li>
              {t("firebase.step3").split(".env.local")[0]}
              <code className="mx-1 rounded bg-red-50 px-1.5 py-0.5">
                .env.local
              </code>
              {t("firebase.step3").split(".env.local")[1]}
            </li>
            <li>{t("firebase.step4")}</li>
          </ol>
        </div>
      </div>
    </section>
  );
}

export default FirebaseConfigNotice;
