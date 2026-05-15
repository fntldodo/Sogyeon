import Link from "next/link";

const principles = [
  "정확한 금액 산출보다 상담 전 조건 정리에 집중합니다.",
  "창업 종류, 지역, 매장 상태, 장비 필요 여부를 순서대로 정리합니다.",
  "마지막에 상담 전 확인할 임시 보고서를 보여줍니다."
];

const previewSteps = [
  "창업 종류",
  "지역",
  "매장 상태",
  "매장 형태",
  "키오스크/POS",
  "납품 방식",
  "냉동고 지원",
  "임시 보고서"
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-5 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between py-2">
          <Link href="/" className="text-lg font-extrabold tracking-normal text-ink">
            소견
          </Link>
          <Link
            href="/flow"
            className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-brand shadow-sm"
          >
            시작
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:py-14">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex rounded-full bg-white px-3 py-2 text-sm font-semibold text-brand shadow-sm">
              소견 — 소중한 견적
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-normal text-ink sm:text-5xl lg:text-6xl">
              창업 조건을 정리해서 납품 상담을 제대로 받을 수 있게 도와주는 곳
            </h1>
            <p className="mt-5 text-base leading-7 text-muted sm:text-lg">
              아이스크림 창업을 준비하거나 기존 매장에 판매를 추가하려는 분이 상담 전에
              필요한 조건을 빠짐없이 정리할 수 있도록 돕는 모바일 우선 웹사이트 MVP입니다.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/flow"
                className="flex min-h-14 items-center justify-center rounded-lg bg-brand px-6 py-4 text-base font-bold text-white shadow-soft"
              >
                내 창업 조건 정리하기
              </Link>
              <a
                href="#flow-preview"
                className="flex min-h-14 items-center justify-center rounded-lg border border-line bg-white px-6 py-4 text-base font-bold text-ink"
              >
                단계 먼저 보기
              </a>
            </div>
          </div>

          <div
            id="flow-preview"
            className="rounded-lg border border-line bg-white p-4 shadow-soft sm:p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-brand">Phase 2 선택값 플로우</p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-normal text-ink">
                  상담 준비 흐름
                </h2>
              </div>
              <span className="rounded-full bg-paper px-3 py-2 text-sm font-bold text-muted">
                8분
              </span>
            </div>
            <div className="grid gap-2">
              {previewSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-3 rounded-lg border border-line bg-paper px-4 py-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-extrabold text-brand">
                    {index + 1}
                  </span>
                  <span className="font-bold text-ink">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="grid gap-3 pb-8 sm:grid-cols-3">
          {principles.map((item) => (
            <div key={item} className="rounded-lg border border-line bg-white p-4">
              <p className="text-sm leading-6 text-muted">{item}</p>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
