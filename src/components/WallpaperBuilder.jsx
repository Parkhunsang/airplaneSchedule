import React from "react";

const BG_PALETTE = [
  "#0f172a",
  "#1d4ed8",
  "#4f46e5",
  "#9333ea",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#f43f5e",
  "#0f766e",
  "#22c55e",
  "#eab308",
  "#111827",
];

function WallpaperBuilder({
  wallpaperStep,
  selectedBgColor,
  onBgColorChange,
  onNextStep,
  thumbnailPreviewUrl,
  onThumbnailSelect,
  onGenerate,
  isGenerating,
  generatedWallpaperUrl,
  onDownload,
  onRestart,
}) {
  const handleCustomColorChange = (e) => {
    onBgColorChange(e.target.value);
  };

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    onThumbnailSelect(file);
  };

  return (
    <section className="rounded-2xl p-4 bg-gray-50 border border-gray-200 shadow-sm">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
        iPhone Wallpaper Builder
      </h2>

      {wallpaperStep === 1 ? (
        <div>
          <p className="mb-3 text-sm sm:text-base text-gray-700">
            Step 1: Choose background color
          </p>
          <div className="flex flex-wrap gap-3">
            {BG_PALETTE.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onBgColorChange(color)}
                aria-label={`background color ${color}`}
                className={`w-10 h-10 rounded-full border-2 transition ${selectedBgColor === color ? "border-gray-900 scale-110" : "border-white/40"}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <label
              htmlFor="custom-bg-color"
              className="text-sm text-gray-700 min-w-[120px]"
            >
              Custom color
            </label>
            <input
              id="custom-bg-color"
              type="color"
              value={selectedBgColor}
              onChange={handleCustomColorChange}
              className="h-10 w-12 rounded-md border border-gray-300 bg-white p-1 cursor-pointer"
              aria-label="Choose custom color"
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm text-gray-700">Selected:</span>
            <span
              className="px-3 py-1 rounded-full text-xs text-white"
              style={{ backgroundColor: selectedBgColor }}
            >
              {selectedBgColor}
            </span>
          </div>

          <button
            type="button"
            onClick={onNextStep}
            className="mt-5 inline-flex items-center px-4 py-2 rounded-full bg-purple-500 text-white text-sm font-semibold"
          >
            Next: choose thumbnail
          </button>
        </div>
      ) : wallpaperStep === 2 ? (
        <div>
          <p className="mb-3 text-sm sm:text-base text-gray-700">
            Step 2: Select thumbnail image
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailFileChange}
            className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-purple-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-purple-700 hover:file:bg-purple-200"
          />
          <p className="text-xs text-gray-500 mt-2">
            Select a photo from your gallery. A square or vertical ratio is
            recommended.
          </p>
          {thumbnailPreviewUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-700 mb-2">Thumbnail preview</p>
              <img
                src={thumbnailPreviewUrl}
                alt="thumbnail preview"
                className="w-44 h-44 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}
          <button
            type="button"
            onClick={onGenerate}
            className="mt-5 inline-flex items-center px-4 py-2 rounded-full bg-purple-500 text-white text-sm font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={!thumbnailPreviewUrl || isGenerating}
          >
            {isGenerating ? "Generating..." : "Make wallpaper"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm sm:text-base text-gray-700">Step 3: Result</p>
          <div className="rounded-[2rem] border border-sky-100 bg-[linear-gradient(180deg,#eef8ff_0%,#d7edf9_100%)] p-4 shadow-[0_20px_60px_rgba(116,157,183,0.18)]">
            {generatedWallpaperUrl ? (
              <div className="mx-auto max-w-[320px] rounded-[2.5rem] border-[10px] border-slate-950 bg-slate-950 p-2 shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
                <div className="mx-auto mb-2 h-6 w-24 rounded-full bg-slate-900" />
                <img
                  src={generatedWallpaperUrl}
                  alt="generated wallpaper"
                  className="w-full rounded-[1.8rem] border border-white/30"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                No result yet. Click Make wallpaper in Step 2.
              </p>
            )}
            <div className="mt-4 rounded-[1.5rem] bg-white/60 p-4 backdrop-blur">
              <p className="font-semibold text-slate-800">
                Figma-inspired preview
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Large photo header, soft sky background, and a calendar grid
                with destination cards.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onDownload}
              disabled={!generatedWallpaperUrl}
              className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500 text-white text-sm font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Download image
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex items-center px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-sm font-semibold"
            >
              Start over
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default WallpaperBuilder;
