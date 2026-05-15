import Link from "next/link";

type Step = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  options?: string[];
  groups?: {
    title: string;
    options: string[];
  }[];
  region?: boolean;
  report?: boolean;
};

const steps: Step[] = [
  {
    id: "startup-type",
    eyebrow: "1 / 8",
    title: "창업 종류 선택",
    description: "준비 중인 아이스크림 창업 형태와 가장 가까운 항목을 골라보세요.",
    options: ["체인점/전문점 체인", "개인 전문점", "기존 매장에 아이스크림 추가"]
  },
  {
    id: "region",
    eyebrow: "2 / 8",
    title: "지역 선택",
    description: "상담에 필요한 기본 지역 정보를 정리합니다. 아직 정확하지 않아도 괜찮습니다.",
    region: true
  },
  {
    id: "store-status",
    eyebrow: "3 / 8",
    title: "매장 상태 선택",
    description: "현재 매장 준비 단계에 맞는 항목을 선택해 상담 준비 범위를 좁힙니다.",
    options: [
      "아직 매장을 찾는 중이에요",
      "보고 있는 매장이 있어요",
      "매장 계약을 완료했어요",
      "기존 매장에서 아이스크림을 추가하려고 해요",
      "기존 아이스크림 매장을 리뉴얼하려고 해요"
    ]
  },
  {
    id: "store-format",
    eyebrow: "4 / 8",
    title: "매장 형태 선택",
    description: "선택한 창업 종류에 따라 확인할 수 있는 매장 형태 예시입니다.",
    groups: [
      {
        title: "체인점/전문점 체인 선택 시",
        options: [
          "직원 상주형",
          "테이크아웃 중심형",
          "매장 취식 가능형",
          "무인/반무인 체인형",
          "아직 브랜드 상담 전이에요"
        ]
      },
      {
        title: "개인 전문점 선택 시",
        options: ["직원 상주형", "테이크아웃 중심형", "매장 취식 가능형", "무인 운영형", "반무인 운영형"]
      },
      {
        title: "기존 매장에 아이스크림 추가 선택 시",
        options: [
          "냉동고만 추가",
          "아이스크림 코너 추가",
          "기존 POS에 같이 판매",
          "별도 키오스크/POS 추가",
          "배달/포장 메뉴로 추가"
        ]
      }
    ]
  },
  {
    id: "pos-kiosk",
    eyebrow: "5 / 8",
    title: "키오스크/POS 선택",
    description: "필요한 장비 방향과 자주 확인하는 옵션을 한 화면에서 살펴봅니다.",
    groups: [
      {
        title: "1차 선택",
        options: [
          "POS만 필요해요",
          "키오스크가 필요해요",
          "POS + 키오스크 둘 다 필요해요",
          "기존 장비를 사용할 예정이에요",
          "아직 잘 모르겠어요"
        ]
      },
      {
        title: "많이 선택해요 옵션",
        options: [
          "카드 결제",
          "간편결제",
          "현금 결제 여부",
          "영수증 출력",
          "메뉴/상품 직접 수정",
          "매출 확인",
          "AS 지원",
          "월 사용료 확인"
        ]
      },
      {
        title: "현금 결제",
        options: [
          "현금 결제 필요 없음",
          "키오스크에서 현금 결제까지 필요",
          "현금은 직원/POS에서 처리",
          "아직 모르겠어요"
        ]
      }
    ]
  },
  {
    id: "sogyeon-code",
    eyebrow: "6 / 8",
    title: "소견 대표코드 안내",
    description: "상담 진행 방식에 맞춰 대표코드 활용 여부를 확인합니다.",
    options: ["소견 대표코드로 상담받기", "개별 상담으로 진행하기"]
  },
  {
    id: "supply-type",
    eyebrow: "7 / 8",
    title: "납품 방식 선택",
    description: "희망하는 납품 상담 방향을 정리합니다.",
    options: [
      "여러 회사 제품을 같이 받고 싶어요",
      "지역 대리점 상담을 받고 싶어요",
      "아직 모르겠어요"
    ]
  },
  {
    id: "freezer-support",
    eyebrow: "8 / 8",
    title: "쇼케이스/냉동고 지원 확인",
    description: "제품 보관과 진열 장비의 준비 상태를 확인합니다.",
    options: ["필요해요", "이미 있어요", "직접 구매할 예정이에요", "아직 모르겠어요"]
  },
  {
    id: "report",
    eyebrow: "임시 보고서",
    title: "상담 전 조건 정리 보고서",
    description: "Phase 1에서는 실제 선택값 저장 없이 상담 전 확인할 항목을 정적으로 보여줍니다.",
    report: true
  }
];

const reportItems = [
  "창업 종류와 매장 형태가 상담 목적에 맞게 정리되었는지 확인",
  "희망 지역과 상권명이 상담 담당자가 이해할 수 있을 정도로 적혔는지 확인",
  "키오스크/POS와 현금 결제 방식이 현재 운영 계획과 맞는지 확인",
  "납품 방식과 쇼케이스/냉동고 준비 상태를 상담 전에 다시 확인"
];

type FlowPageProps = {
  searchParams?: Promise<{
    step?: string;
  }>;
};

function normalizeStep(stepValue: string | undefined) {
  const parsed = Number(stepValue);
  if (!Number.isInteger(parsed)) {
    return 0;
  }

  return Math.min(Math.max(parsed, 0), steps.length - 1);
}

function OptionCard({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="min-h-16 w-full rounded-lg border border-line bg-white px-4 py-4 text-left text-base font-bold leading-6 text-ink shadow-sm transition hover:border-brand hover:bg-paper focus:outline-none focus:ring-2 focus:ring-brand"
    >
      {label}
    </button>
  );
}

export default async function FlowPage({ searchParams }: FlowPageProps) {
  const resolvedSearchParams = await searchParams;
  const activeIndex = normalizeStep(resolvedSearchParams?.step);
  const step = steps[activeIndex];
  const previousHref = activeIndex === 0 ? "/" : `/flow?step=${activeIndex - 1}`;
  const nextHref = activeIndex === steps.length - 1 ? "/flow?step=0" : `/flow?step=${activeIndex + 1}`;
  const progress = Math.round(((activeIndex + 1) / steps.length) * 100);

  return (
    <main className="min-h-screen px-5 py-5 sm:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-40px)] w-full max-w-5xl gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-lg border border-line bg-white p-4 shadow-sm lg:sticky lg:top-5 lg:h-[calc(100vh-40px)]">
          <div className="flex items-center justify-between gap-4 lg:block">
            <Link href="/" className="text-xl font-extrabold text-ink">
              소견
            </Link>
            <span className="rounded-full bg-paper px-3 py-2 text-sm font-bold text-brand">
              {progress}%
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">
            창업 조건을 정리해서 납품 상담을 제대로 받을 수 있게 도와주는 곳
          </p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-paper">
            <div className="h-full rounded-full bg-brand" style={{ width: `${progress}%` }} />
          </div>
          <nav className="mt-5 hidden gap-2 lg:grid" aria-label="창업 조건 입력 단계">
            {steps.map((item, index) => (
              <Link
                key={item.id}
                href={`/flow?step=${index}`}
                className={`rounded-lg px-3 py-2 text-sm font-bold ${
                  activeIndex === index ? "bg-brand text-white" : "bg-paper text-muted"
                }`}
              >
                {index + 1}. {item.title}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="rounded-lg border border-line bg-white p-5 shadow-soft sm:p-7">
          <div className="mb-6">
            <p className="text-sm font-extrabold text-brand">{step.eyebrow}</p>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-normal text-ink sm:text-4xl">
              {step.title}
            </h1>
            <p className="mt-3 text-base leading-7 text-muted">{step.description}</p>
          </div>

          {step.region ? (
            <div className="grid gap-3">
              {["시/도", "시/군/구", "동네/상권명 입력"].map((label) => (
                <label key={label} className="grid gap-2">
                  <span className="text-sm font-bold text-muted">{label}</span>
                  <input
                    className="min-h-14 rounded-lg border border-line bg-paper px-4 text-base font-semibold text-ink outline-none focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand"
                    placeholder={`${label} 예시를 입력하세요`}
                  />
                </label>
              ))}
            </div>
          ) : null}

          {step.options ? (
            <div className="grid gap-3">
              {step.options.map((option) => (
                <OptionCard key={option} label={option} />
              ))}
            </div>
          ) : null}

          {step.groups ? (
            <div className="grid gap-5">
              {step.groups.map((group) => (
                <div key={group.title} className="grid gap-3">
                  <h2 className="text-base font-extrabold text-ink">{group.title}</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {group.options.map((option) => (
                      <OptionCard key={option} label={option} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {step.report ? (
            <div className="grid gap-4">
              <div className="rounded-lg border border-line bg-paper p-4">
                <h2 className="text-lg font-extrabold text-ink">임시 보고서 요약</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  정확한 견적이나 단가 비교가 아니라, 납품 상담 전 확인해야 할 조건을
                  정리하는 화면입니다.
                </p>
              </div>
              <div className="grid gap-3">
                {reportItems.map((item) => (
                  <div key={item} className="rounded-lg border border-line bg-white p-4">
                    <p className="font-bold leading-6 text-ink">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:justify-between">
            <Link
              href={previousHref}
              className="flex min-h-14 items-center justify-center rounded-lg border border-line bg-white px-5 py-4 text-base font-bold text-ink"
            >
              이전
            </Link>
            <Link
              href={nextHref}
              className="flex min-h-14 items-center justify-center rounded-lg bg-brand px-5 py-4 text-base font-bold text-white"
            >
              {activeIndex === steps.length - 1 ? "처음부터 다시 보기" : "다음 단계"}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
