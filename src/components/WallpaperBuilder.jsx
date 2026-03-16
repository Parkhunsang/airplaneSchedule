import React from "react";

function WallpaperBuilder({ title, subtitle, children }) {
  return (
    <section className="w-full min-w-0 rounded-2xl border border-gray-200 bg-gray-50 p-3 shadow-sm sm:p-4 flex flex-col gap-3">
      <div className="mb-4">
        <h2 className="break-words text-xl font-bold text-gray-900 sm:text-2xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm leading-6 text-gray-600 sm:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export default WallpaperBuilder;
