import { useTranslation } from "react-i18next";

function LegacyMigrationBanner({
  isMigrating,
  migrationMessage,
  migrationTone = "info",
  onMigrate,
}) {
  const { t } = useTranslation();

  const toneClassName =
    migrationTone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-950"
      : migrationTone === "error"
        ? "border-amber-200 bg-amber-50 text-amber-950"
        : "border-slate-200 bg-slate-50 text-slate-900";

  return (
    <section className={`mb-5 rounded-3xl border p-4 shadow-sm ${toneClassName}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-semibold">{t("migration.title")}</p>
          <p className="text-sm leading-6">
            {migrationMessage || t("migration.description")}
          </p>
        </div>

        <button
          type="button"
          onClick={onMigrate}
          disabled={isMigrating}
          className="rounded-full bg-[#1565C0] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0d4f99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isMigrating ? t("migration.inProgress") : t("migration.button")}
        </button>
      </div>
    </section>
  );
}

export default LegacyMigrationBanner;
