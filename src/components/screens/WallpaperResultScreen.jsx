import React from "react";

function WallpaperResultScreen({ onPrev }) {
  return (
    <section className="w-full shrink-0 px-3">
      <div className="flex min-h-[320px] flex-col justify-between rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-purple-600">화면 3</p>
          <h2 className="mt-2 text-xl font-bold text-gray-900">결과 화면</h2>
          <p className="mt-3 text-sm text-gray-500 sm:text-base">
            여기에 최종 월페이퍼 결과와 다운로드 UI를 넣을 예정입니다.
          </p>
        </div>
        <div className="flex justify-start pt-6">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex items-center justify-center rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 sm:text-base"
          >
            이전
          </button>
        </div>
      </div>
    </section>
  );
}

export default WallpaperResultScreen;
