import React from "react";

function WallpaperSetupScreen({ onPrev, onNext }) {
  return (
    <section className="w-full shrink-0 px-3">
      <div className="flex min-h-[320px] flex-col justify-between rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-purple-600">화면 2</p>
          <h2 className="mt-2 text-xl font-bold text-gray-900">
            월페이퍼 설정 화면
          </h2>
          <p className="mt-3 text-sm text-gray-500 sm:text-base">
            여기에 색상 선택과 이미지 선택 UI를 넣을 예정입니다.
          </p>
        </div>
        <div className="flex justify-between gap-3 pt-6">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex items-center justify-center rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 sm:text-base"
          >
            이전
          </button>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-purple-500 px-5 py-3 text-sm font-semibold text-white sm:text-base"
          >
            <span>다음</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default WallpaperSetupScreen;
