import { missingFirebaseEnvKeys } from "../../firebaseConfig";

function FirebaseConfigNotice() {
  return (
    <section className="mx-auto mt-10 w-full max-w-2xl rounded-3xl border border-red-200 bg-red-50 p-6 text-red-950 shadow-sm">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-700">
            Firebase Setup Required
          </p>
          <h2 className="mt-2 text-2xl font-bold">
            배포 환경에 Firebase 환경변수가 없습니다
          </h2>
        </div>

        <p className="text-sm leading-6 sm:text-base">
          이 앱은 Vite 환경변수로 Firebase를 초기화합니다. 로컬의
          <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-sm">
            .env.local
          </code>
          파일은 Netlify에 자동 업로드되지 않으므로, 배포 사이트에 같은 값을
          직접 등록해야 합니다.
        </p>

        <div>
          <p className="text-sm font-semibold">누락된 키</p>
          <ul className="mt-2 space-y-1 rounded-2xl bg-white/80 p-4 text-sm">
            {missingFirebaseEnvKeys.map((key) => (
              <li key={key} className="font-mono">
                {key}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-4 text-sm leading-6">
          <p className="font-semibold">Netlify 설정 순서</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Netlify 대시보드에서 해당 사이트를 엽니다.</li>
            <li>Site configuration &gt; Environment variables로 이동합니다.</li>
            <li>
              로컬
              <code className="mx-1 rounded bg-red-50 px-1.5 py-0.5">
                .env.local
              </code>
              의 값을 같은 이름으로 등록합니다.
            </li>
            <li>Deploys에서 다시 배포하거나 최신 배포를 재시도합니다.</li>
          </ol>
        </div>
      </div>
    </section>
  );
}

export default FirebaseConfigNotice;
