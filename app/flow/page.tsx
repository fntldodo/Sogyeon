"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type StartupType = "체인점/전문점 체인" | "개인 전문점" | "기존 매장에 아이스크림 추가";

type FlowValues = {
  startup_type: StartupType | "";
  region_sido: string;
  region_sigungu: string;
  region_area_text: string;
  store_status: string;
  store_format: string;
  pos_kiosk_type: string;
  pos_kiosk_options: string[];
  cash_payment_type: string;
  sogyeon_code_choice: string;
  supply_type: string;
  freezer_support_status: string;
};

type StepId =
  | "startup-type"
  | "region"
  | "store-status"
  | "store-format"
  | "pos-kiosk"
  | "sogyeon-code"
  | "supply-type"
  | "freezer-support"
  | "report";

type Step = {
  id: StepId;
  eyebrow: string;
  title: string;
  description: string;
};

type OptionCardProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
};

type RegionField = {
  label: string;
  key: "region_sido" | "region_sigungu" | "region_area_text";
  placeholder: string;
};

const emptyValues: FlowValues = {
  startup_type: "",
  region_sido: "",
  region_sigungu: "",
  region_area_text: "",
  store_status: "",
  store_format: "",
  pos_kiosk_type: "",
  pos_kiosk_options: [],
  cash_payment_type: "",
  sogyeon_code_choice: "",
  supply_type: "",
  freezer_support_status: ""
};

const steps: Step[] = [
  {
    id: "startup-type",
    eyebrow: "1 / 8",
    title: "창업 종류 선택",
    description: "준비 중인 아이스크림 창업 형태와 가장 가까운 항목을 골라보세요."
  },
  {
    id: "region",
    eyebrow: "2 / 8",
    title: "지역 선택",
    description: "상담에 필요한 기본 지역 정보를 정리합니다. 아직 정확하지 않아도 괜찮습니다."
  },
  {
    id: "store-status",
    eyebrow: "3 / 8",
    title: "매장 상태 선택",
    description: "현재 매장 준비 단계에 맞는 항목을 선택해 상담 준비 범위를 좁힙니다."
  },
  {
    id: "store-format",
    eyebrow: "4 / 8",
    title: "매장 형태 선택",
    description: "선택한 창업 종류에 따라 확인할 수 있는 매장 형태를 정리합니다."
  },
  {
    id: "pos-kiosk",
    eyebrow: "5 / 8",
    title: "키오스크/POS 선택",
    description: "필요한 장비 방향과 자주 확인하는 옵션을 정리합니다."
  },
  {
    id: "sogyeon-code",
    eyebrow: "6 / 8",
    title: "소견 대표코드 안내",
    description: "상담 진행 방식에 맞춰 대표코드 활용 여부를 확인합니다."
  },
  {
    id: "supply-type",
    eyebrow: "7 / 8",
    title: "납품 방식 선택",
    description: "희망하는 납품 상담 방향을 정리합니다."
  },
  {
    id: "freezer-support",
    eyebrow: "8 / 8",
    title: "쇼케이스/냉동고 지원 확인",
    description: "제품 보관과 진열 장비의 준비 상태를 확인합니다."
  },
  {
    id: "report",
    eyebrow: "임시 보고서",
    title: "상담 전 조건 정리 보고서",
    description: "선택한 조건을 바탕으로 납품 상담 전에 확인할 내용을 요약합니다."
  }
];

const startupTypeOptions: StartupType[] = [
  "체인점/전문점 체인",
  "개인 전문점",
  "기존 매장에 아이스크림 추가"
];

const storeStatusOptions = [
  "아직 매장을 찾는 중이에요",
  "보고 있는 매장이 있어요",
  "매장 계약을 완료했어요",
  "기존 매장에서 아이스크림을 추가하려고 해요",
  "기존 아이스크림 매장을 리뉴얼하려고 해요"
];

const storeFormatOptions: Record<StartupType, string[]> = {
  "체인점/전문점 체인": [
    "직원 상주형",
    "테이크아웃 중심형",
    "매장 취식 가능형",
    "무인/반무인 체인형",
    "아직 브랜드 상담 전이에요"
  ],
  "개인 전문점": ["직원 상주형", "테이크아웃 중심형", "매장 취식 가능형", "무인 운영형", "반무인 운영형"],
  "기존 매장에 아이스크림 추가": [
    "냉동고만 추가",
    "아이스크림 코너 추가",
    "기존 POS에 같이 판매",
    "별도 키오스크/POS 추가",
    "배달/포장 메뉴로 추가"
  ]
};

const posKioskTypeOptions = [
  "POS만 필요해요",
  "키오스크가 필요해요",
  "POS + 키오스크 둘 다 필요해요",
  "기존 장비를 사용할 예정이에요",
  "아직 잘 모르겠어요"
];

const posKioskDetailOptions = [
  "카드 결제",
  "간편결제",
  "현금 결제 여부",
  "영수증 출력",
  "메뉴/상품 직접 수정",
  "매출 확인",
  "AS 지원",
  "월 사용료 확인"
];

const cashPaymentOptions = [
  "현금 결제 필요 없음",
  "키오스크에서 현금 결제까지 필요",
  "현금은 직원/POS에서 처리",
  "아직 모르겠어요"
];

const sogyeonCodeOptions = ["소견 대표코드로 상담받기", "개별 상담으로 진행하기"];

const supplyTypeOptions = [
  "여러 회사 제품을 같이 받고 싶어요",
  "지역 대리점 상담을 받고 싶어요",
  "아직 모르겠어요"
];

const freezerSupportOptions = ["필요해요", "이미 있어요", "직접 구매할 예정이에요", "아직 모르겠어요"];

const regionFields: RegionField[] = [
  { label: "시/도", key: "region_sido", placeholder: "예: 서울특별시" },
  { label: "시/군/구", key: "region_sigungu", placeholder: "예: 마포구" },
  { label: "동네/상권명 입력", key: "region_area_text", placeholder: "예: 홍대입구역 인근" }
];

function displayValue(value: string) {
  return value.trim() || "아직 선택하지 않음";
}

function displayList(values: string[]) {
  return values.length > 0 ? values.join(", ") : "아직 선택하지 않음";
}

function OptionCard({ label, selected, onClick, multi = false }: OptionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`min-h-16 w-full rounded-lg border px-4 py-4 text-left text-base font-bold leading-6 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-brand ${
        selected
          ? "border-brand bg-brand text-white shadow-soft"
          : "border-line bg-white text-ink hover:border-brand hover:bg-paper"
      }`}
    >
      <span className="flex items-center justify-between gap-3">
        <span>{label}</span>
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
            selected ? "border-white bg-white text-brand" : "border-line bg-paper text-muted"
          }`}
        >
          {selected ? "선" : multi ? "+" : ""}
        </span>
      </span>
    </button>
  );
}

function ReportRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-white p-4">
      <p className="text-sm font-bold text-muted">{label}</p>
      <p className="mt-2 text-base font-extrabold leading-6 text-ink">{value}</p>
    </div>
  );
}

export default function FlowPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [values, setValues] = useState<FlowValues>(emptyValues);
  const step = steps[activeIndex];
  const progress = Math.round(((activeIndex + 1) / steps.length) * 100);

  const currentStoreFormatOptions = useMemo(() => {
    if (!values.startup_type) {
      return [];
    }

    return storeFormatOptions[values.startup_type];
  }, [values.startup_type]);

  const updateValue = <Key extends keyof FlowValues>(key: Key, value: FlowValues[Key]) => {
    setValues((current) => ({
      ...current,
      [key]: value
    }));
  };

  const selectStartupType = (startupType: StartupType) => {
    setValues((current) => ({
      ...current,
      startup_type: startupType,
      store_format: ""
    }));
  };

  const togglePosKioskOption = (option: string) => {
    setValues((current) => {
      const exists = current.pos_kiosk_options.includes(option);
      return {
        ...current,
        pos_kiosk_options: exists
          ? current.pos_kiosk_options.filter((item) => item !== option)
          : [...current.pos_kiosk_options, option]
      };
    });
  };

  const goPrevious = () => {
    if (activeIndex === 0) {
      return;
    }

    setActiveIndex((current) => current - 1);
  };

  const goNext = () => {
    if (activeIndex === steps.length - 1) {
      return;
    }

    setActiveIndex((current) => current + 1);
  };

  const resetFlow = () => {
    setValues(emptyValues);
    setActiveIndex(0);
  };

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
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`rounded-lg px-3 py-2 text-left text-sm font-bold ${
                  activeIndex === index ? "bg-brand text-white" : "bg-paper text-muted"
                }`}
              >
                {index + 1}. {item.title}
              </button>
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

          {step.id === "startup-type" ? (
            <div className="grid gap-3">
              {startupTypeOptions.map((option) => (
                <OptionCard
                  key={option}
                  label={option}
                  selected={values.startup_type === option}
                  onClick={() => selectStartupType(option)}
                />
              ))}
            </div>
          ) : null}

          {step.id === "region" ? (
            <div className="grid gap-3">
              {regionFields.map((field) => (
                <label key={field.key} className="grid gap-2">
                  <span className="text-sm font-bold text-muted">{field.label}</span>
                  <input
                    value={values[field.key]}
                    onChange={(event) => updateValue(field.key, event.target.value)}
                    className="min-h-14 rounded-lg border border-line bg-paper px-4 text-base font-semibold text-ink outline-none focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand"
                    placeholder={field.placeholder}
                  />
                </label>
              ))}
            </div>
          ) : null}

          {step.id === "store-status" ? (
            <div className="grid gap-3">
              {storeStatusOptions.map((option) => (
                <OptionCard
                  key={option}
                  label={option}
                  selected={values.store_status === option}
                  onClick={() => updateValue("store_status", option)}
                />
              ))}
            </div>
          ) : null}

          {step.id === "store-format" ? (
            <div className="grid gap-4">
              {!values.startup_type ? (
                <div className="rounded-lg border border-line bg-paper p-4">
                  <p className="text-sm font-bold leading-6 text-muted">
                    창업 종류를 먼저 선택하면 매장 형태 선택지가 좁혀집니다.
                  </p>
                </div>
              ) : null}
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  currentStoreFormatOptions.length > 0
                    ? currentStoreFormatOptions
                    : Array.from(new Set(startupTypeOptions.flatMap((startupType) => storeFormatOptions[startupType])))
                ).map((option) => (
                  <OptionCard
                    key={option}
                    label={option}
                    selected={values.store_format === option}
                    onClick={() => updateValue("store_format", option)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {step.id === "pos-kiosk" ? (
            <div className="grid gap-5">
              <div className="grid gap-3">
                <h2 className="text-base font-extrabold text-ink">1차 선택</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {posKioskTypeOptions.map((option) => (
                    <OptionCard
                      key={option}
                      label={option}
                      selected={values.pos_kiosk_type === option}
                      onClick={() => updateValue("pos_kiosk_type", option)}
                    />
                  ))}
                </div>
              </div>
              <div className="grid gap-3">
                <h2 className="text-base font-extrabold text-ink">많이 선택해요 옵션</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {posKioskDetailOptions.map((option) => (
                    <OptionCard
                      key={option}
                      label={option}
                      multi
                      selected={values.pos_kiosk_options.includes(option)}
                      onClick={() => togglePosKioskOption(option)}
                    />
                  ))}
                </div>
              </div>
              <div className="grid gap-3">
                <h2 className="text-base font-extrabold text-ink">현금 결제</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {cashPaymentOptions.map((option) => (
                    <OptionCard
                      key={option}
                      label={option}
                      selected={values.cash_payment_type === option}
                      onClick={() => updateValue("cash_payment_type", option)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {step.id === "sogyeon-code" ? (
            <div className="grid gap-3">
              {sogyeonCodeOptions.map((option) => (
                <OptionCard
                  key={option}
                  label={option}
                  selected={values.sogyeon_code_choice === option}
                  onClick={() => updateValue("sogyeon_code_choice", option)}
                />
              ))}
            </div>
          ) : null}

          {step.id === "supply-type" ? (
            <div className="grid gap-3">
              {supplyTypeOptions.map((option) => (
                <OptionCard
                  key={option}
                  label={option}
                  selected={values.supply_type === option}
                  onClick={() => updateValue("supply_type", option)}
                />
              ))}
            </div>
          ) : null}

          {step.id === "freezer-support" ? (
            <div className="grid gap-3">
              {freezerSupportOptions.map((option) => (
                <OptionCard
                  key={option}
                  label={option}
                  selected={values.freezer_support_status === option}
                  onClick={() => updateValue("freezer_support_status", option)}
                />
              ))}
            </div>
          ) : null}

          {step.id === "report" ? (
            <div className="grid gap-4">
              <div className="rounded-lg border border-line bg-paper p-4">
                <h2 className="text-lg font-extrabold text-ink">임시 보고서 요약</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  정확한 견적이나 단가 비교가 아니라, 납품 상담 전 확인해야 할 조건을
                  정리하는 화면입니다.
                </p>
              </div>
              <div className="grid gap-3">
                <ReportRow label="창업 조건 요약" value={displayValue(values.startup_type)} />
                <ReportRow
                  label="지역 요약"
                  value={[values.region_sido, values.region_sigungu, values.region_area_text]
                    .filter((item) => item.trim())
                    .join(" ") || "아직 선택하지 않음"}
                />
                <ReportRow
                  label="매장 상태/형태 요약"
                  value={`${displayValue(values.store_status)} / ${displayValue(values.store_format)}`}
                />
                <ReportRow
                  label="키오스크/POS 선택 요약"
                  value={`1차 선택: ${displayValue(values.pos_kiosk_type)} · 옵션: ${displayList(
                    values.pos_kiosk_options
                  )} · 현금 결제: ${displayValue(values.cash_payment_type)}`}
                />
                <ReportRow
                  label="소견 대표코드 선택 요약"
                  value={displayValue(values.sogyeon_code_choice)}
                />
                <ReportRow label="납품 상담 방식 요약" value={displayValue(values.supply_type)} />
                <ReportRow
                  label="쇼케이스/냉동고 확인 요약"
                  value={displayValue(values.freezer_support_status)}
                />
              </div>
            </div>
          ) : null}

          <div className="mt-8 grid gap-3 border-t border-line pt-5 sm:grid-cols-[1fr_1fr]">
            <button
              type="button"
              onClick={goPrevious}
              className="flex min-h-14 items-center justify-center rounded-lg border border-line bg-white px-5 py-4 text-base font-bold text-ink disabled:cursor-not-allowed disabled:opacity-45"
              disabled={activeIndex === 0}
            >
              이전
            </button>
            <button
              type="button"
              onClick={goNext}
              className="flex min-h-14 items-center justify-center rounded-lg bg-brand px-5 py-4 text-base font-bold text-white disabled:cursor-not-allowed disabled:opacity-45"
              disabled={activeIndex === steps.length - 1}
            >
              다음 단계
            </button>
            <button
              type="button"
              onClick={resetFlow}
              className="flex min-h-14 items-center justify-center rounded-lg border border-line bg-paper px-5 py-4 text-base font-bold text-muted sm:col-span-2"
            >
              처음부터 다시하기
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
