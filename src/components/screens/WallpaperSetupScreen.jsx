import React from "react";
import WallpaperBuilder from "../WallpaperBuilder";

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

function WallpaperSetupScreen({
  selectedBgColor,
  onBgColorChange,
  thumbnailPreviewUrl,
  onThumbnailSelect,
  isGenerating,
  onPrev,
  onNext,
}) {
  const handleCustomColorChange = (e) => {
    onBgColorChange(e.target.value);
  };

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    onThumbnailSelect(file);
  };

  return (
    <section className="min-w-full min-w-0 flex-none">
      <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-5">
        <WallpaperBuilder
          title="배경화면 설정"
          subtitle="색상을 고르고 사진을 올린 뒤 배경화면을 생성하세요."
        >
          <div className="mx-auto flex w-full min-w-0 max-w-2xl flex-col gap-5">
            <div className="min-w-0 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
              <p className="mb-3 text-sm font-medium text-gray-700 sm:text-base">
                Step 1. 배경 색상을 선택하세요
              </p>
              <div className="grid grid-cols-4 gap-3 sm:flex sm:flex-wrap">
                {BG_PALETTE.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onBgColorChange(color)}
                    aria-label={`background color ${color}`}
                    className={`h-10 w-10 rounded-full border-2 transition ${
                      selectedBgColor === color
                        ? "scale-105 border-gray-900"
                        : "border-white/40"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="mt-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
                <label
                  htmlFor="custom-bg-color"
                  className="text-sm text-gray-700 sm:min-w-[120px]"
                >
                  직접 선택
                </label>
                <input
                  id="custom-bg-color"
                  type="color"
                  value={selectedBgColor}
                  onChange={handleCustomColorChange}
                  className="h-10 w-14 cursor-pointer rounded-md border border-gray-300 bg-white p-1"
                  aria-label="사용자 지정 색상 선택"
                />
              </div>

              <div className="mt-4 flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                <span className="text-sm text-gray-700">선택한 색상</span>
                <span
                  className="inline-flex w-fit max-w-full break-all rounded-full px-3 py-1 text-xs text-white"
                  style={{ backgroundColor: selectedBgColor }}
                >
                  {selectedBgColor}
                </span>
              </div>
            </div>

            <div className="min-w-0 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
              <p className="mb-3 text-sm font-medium text-gray-700 sm:text-base">
                Step 2. 사진을 선택하세요
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailFileChange}
                className="block w-full min-w-0 text-sm file:mb-3 file:mr-0 file:block file:w-full file:rounded-full file:border-0 file:bg-purple-100 file:px-4 file:py-3 file:text-sm file:font-semibold file:text-purple-700 hover:file:bg-purple-200 sm:file:mb-0 sm:file:mr-4 sm:file:inline-block sm:file:w-auto"
              />
              <p className="mt-2 break-words text-xs leading-5 text-gray-500">
                갤러리에서 사진을 선택해주세요. 정사각형 또는 세로 비율 이미지를
                권장합니다.
              </p>
              {thumbnailPreviewUrl ? (
                <div className="mt-4 min-w-0">
                  <p className="mb-2 text-sm text-gray-700">미리보기</p>
                  <img
                    src={thumbnailPreviewUrl}
                    alt="thumbnail preview"
                    className="aspect-square w-full max-w-[220px] rounded-lg border border-gray-200 object-cover"
                  />
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm text-gray-500">
                  아직 선택한 사진이 없습니다.
                </div>
              )}
            </div>
          </div>
        </WallpaperBuilder>
        <div className="flex min-w-0 flex-col gap-3 pb-6 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex w-full items-center justify-center rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 sm:w-auto sm:text-base"
          >
            이전
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!thumbnailPreviewUrl || isGenerating}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-purple-500 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto sm:text-base"
          >
            <span>{isGenerating ? "생성 중..." : "다음"}</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default WallpaperSetupScreen;
