import React from "react";
import WallpaperBuilder from "../WallpaperBuilder";

function WallpaperResultScreen({
  generatedWallpaperUrl,
  onPrev,
  onGoHome,
  onDownload,
}) {
  return (
    <section className="min-w-full min-w-0 flex-none">
      <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-5">
        <WallpaperBuilder
          title="배경화면 결과"
          subtitle="완성된 이미지를 확인하고 저장하거나 다시 만들 수 있어요."
        >
          <div className="mx-auto flex w-full min-w-0 max-w-2xl flex-col gap-5">
            <div className="min-w-0 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 sm:p-5">
              <p className="mb-3 text-sm font-medium text-gray-700 sm:text-base">
                Step 4. 결과
              </p>

              {generatedWallpaperUrl ? (
                <div className="min-w-0 overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#eef8ff_0%,#d7edf9_100%)] p-3 sm:p-4">
                  <div className="mx-auto w-full min-w-0 max-w-full rounded-[1.8rem] bg-slate-950 p-2 shadow-[0_22px_60px_rgba(15,23,42,0.28)] sm:max-w-[380px] sm:rounded-[2.2rem]">
                    <img
                      src={generatedWallpaperUrl}
                      alt="generated wallpaper"
                      className="block w-full rounded-[1.4rem] border border-white/30"
                    />
                  </div>

                  <div className="mt-4 bg-white p-4 rounded-lg">
                    <p className="font-semibold text-slate-800">Preview</p>
                    <p className="mt-1 break-words text-sm leading-6 text-slate-600">
                      선택한 사진과 일정 카드가 함께 들어간 배경화면 결과를
                      여기에서 확인할 수 있습니다.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                  결과가 아직 없습니다. 이전 단계에서 사진을 선택하고 배경화면을
                  생성해주세요.
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onDownload}
                disabled={!generatedWallpaperUrl}
                className="inline-flex w-full items-center justify-center rounded-full bg-[#1E6DEB] hover:bg-[#1E6DEB] active:bg-[#1565C0] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300 sm:w-auto"
              >
                이미지 다운로드
              </button>
              <button
                type="button"
                onClick={onPrev}
                className="inline-flex w-full items-center justify-center rounded-full border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 sm:w-auto"
              >
                이전
              </button>
            </div>
          </div>
        </WallpaperBuilder>
        <div className="flex min-w-0 flex-col gap-3 pb-6 sm:flex-row sm:justify-start">
          <button
            type="button"
            onClick={onGoHome}
            className="inline-flex w-full items-center justify-center rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 sm:w-auto sm:text-base"
          >
            처음으로
          </button>
        </div>
      </div>
    </section>
  );
}

export default WallpaperResultScreen;
