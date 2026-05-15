import Link from "next/link";

const principles = [
  "정확한 금액 산출이 아니라 상담 전 조건 정리에 집중합니다.",
  "창업 종류, 지역, 매장 상태, 장비 필요 여부를 순서대로 확인합니다.",
  "마지막에 납품 상담 전 확인할 임시 보고서를 정리합니다."
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
    <main className="min-h-screen bg-paper">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between gap-3 py-2">
          <Link href="/" className="text-xl font-extrabold tracking-normal text-ink">
            소견
          </Link>
          <Link
            href="/flow"
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-brand bg-white px-4 text-sm font-extrabold text-brand shadow-sm"
          >
            조건 정리 시작
          </Link>
        </header>

        <div className="grid flex-1 content-start gap-7 py-7 sm:py-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center lg:gap-12 lg:py-12">
          <div className="min-w-0 max-w-3xl">
            <p className="mb-4 inline-flex max-w-full rounded-full border border-line bg-white px-3 py-2 text-sm font-extrabold leading-5 text-brand shadow-sm">
              소견 — 소중한 견적
            </p>
            <h1 className="max-w-[12ch] text-[clamp(2rem,8vw,3.5rem)] font-extrabold leading-[1.16] tracking-normal text-ink sm:max-w-[15ch] lg:max-w-[16ch]">
              <span className="block">아이스크림 창업 조건,</span>
              <span className="block">상담 전에 먼저 정리해요</span>
            </h1>
            <p className="mt-5 max-w-[24rem] text-[1.1rem] font-extrabold leading-8 text-brand sm:max-w-2xl sm:text-xl">
              창업 조건을 정리해서 납품 상담을 제대로 받을 수 있게 도와주는 곳
            </p>
            <p className="mt-4 max-w-[27rem] text-base leading-7 text-muted sm:max-w-2xl">
              소견은 정확한 견적을 바로 계산하는 서비스가 아니라, 상담 담당자에게 전달할
              창업 조건을 빠짐없이 준비하도록 돕는 모바일 우선 웹사이트 MVP입니다.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/flow"
                className="flex min-h-14 touch-manipulation items-center justify-center rounded-lg bg-brand px-6 py-4 text-base font-extrabold text-white shadow-soft"
              >
                내 창업 조건 정리하기
              </Link>
              <a
                href="#flow-preview"
                className="flex min-h-14 touch-manipulation items-center justify-center rounded-lg border border-line bg-white px-6 py-4 text-base font-extrabold text-ink"
              >
                진행 단계 보기
              </a>
            </div>
          </div>

          <div
            id="flow-preview"
            className="min-w-0 rounded-lg border border-line bg-white p-4 shadow-soft sm:p-5"
          >
            <div className="mb-4">
              <p className="text-sm font-extrabold text-brand">Phase 2.5 MVP 플로우</p>
              <h2 className="mt-1 text-xl font-extrabold tracking-normal text-ink sm:text-2xl">
                상담 준비 순서
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                각 단계에서 선택한 값은 마지막 임시 보고서에 정리됩니다.
              </p>
            </div>
            <div className="grid gap-2">
              {previewSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex min-h-12 items-center gap-3 rounded-lg border border-line bg-paper px-4 py-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-extrabold text-brand">
                    {index + 1}
                  </span>
                  <span className="min-w-0 break-words font-bold leading-5 text-ink">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="grid gap-3 pb-8 sm:grid-cols-3">
          {principles.map((item) => (
            <div key={item} className="rounded-lg border border-line bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold leading-6 text-muted">{item}</p>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
