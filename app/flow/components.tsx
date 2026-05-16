import Link from "next/link";
import type { FlowValues, RegionField, ReportSection, Step } from "./types";

type OptionCardProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
  helperText?: string;
};

type SidebarProps = {
  activeIndex: number;
  progress: number;
  steps: Step[];
  onStepSelect: (index: number) => void;
};

type StepHeaderProps = {
  activeIndex: number;
  progress: number;
  step: Step;
  totalSteps: number;
};

type BottomActionsProps = {
  activeIndex: number;
  totalSteps: number;
  nextLabel?: string;
  showNext?: boolean;
  nextDisabled?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onReset: () => void;
};

type RegionInputsProps = {
  fields: RegionField[];
  values: Pick<FlowValues, "region_sido" | "region_sigungu" | "region_area_text">;
  onChange: (key: RegionField["key"], value: string) => void;
};

type ReportPanelProps = {
  sections: ReportSection[];
  onConsultationStart?: () => void;
};

export function FlowSidebar({ activeIndex, progress, steps, onStepSelect }: SidebarProps) {
  return (
    <aside className="hidden min-w-0 rounded-lg border border-line bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:block lg:h-[calc(100vh-48px)]">
      <div className="flex items-center justify-between gap-4 lg:block">
        <Link href="/" className="text-xl font-extrabold text-ink">
          소견
        </Link>
        <span className="rounded-full bg-paper px-3 py-2 text-sm font-bold text-brand">{progress}%</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">
        창업 조건을 정리해서 납품 상담을 제대로 받을 수 있게 도와주는 곳
      </p>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-paper">
        <div className="h-full rounded-full bg-brand" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-2 text-xs font-bold text-muted">
        {activeIndex + 1}단계 / 총 {steps.length}단계
      </p>
      <nav className="mt-5 hidden gap-2 lg:grid" aria-label="창업 조건 입력 단계">
        {steps.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onStepSelect(index)}
            className={`min-h-11 touch-manipulation rounded-lg px-3 py-2 text-left text-sm font-bold leading-5 ${
              activeIndex === index ? "bg-brand text-white" : "bg-paper text-muted hover:text-ink"
            }`}
          >
            {index + 1}. {item.title}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export function StepHeader({ activeIndex, progress, step, totalSteps }: StepHeaderProps) {
  return (
    <>
      <div className="border-b border-line p-4 sm:p-7">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-paper px-3 py-2 text-xs font-extrabold text-brand">
            {activeIndex + 1} / {totalSteps}
          </span>
          <span className="text-xs font-bold text-muted">선택값은 보고서에 자동 반영됩니다</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-paper">
          <div className="h-full rounded-full bg-brand" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-extrabold text-brand">{step.eyebrow}</p>
        <h1 className="mt-2 text-[1.55rem] font-extrabold leading-[1.22] tracking-normal text-ink sm:text-4xl">
          {step.title}
        </h1>
        <p className="mt-3 max-w-2xl break-words text-base leading-7 text-muted">{step.description}</p>
      </div>
    </>
  );
}

export function OptionCard({ label, selected, onClick, multi = false, helperText }: OptionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`min-h-[76px] w-full min-w-0 touch-manipulation rounded-lg border px-4 py-4 text-left text-base font-bold leading-6 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-brand ${
        selected
          ? "border-brand bg-brand text-white shadow-soft"
          : "border-line bg-white text-ink hover:border-brand hover:bg-paper"
      }`}
    >
      <span className="flex min-w-0 items-start justify-between gap-3">
        <span className="min-w-0">
          <span className="block break-words">{label}</span>
          {helperText ? (
            <span className={`mt-2 block break-words text-sm font-semibold leading-6 ${selected ? "text-white/85" : "text-muted"}`}>
              {helperText}
            </span>
          ) : null}
        </span>
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${
            selected ? "border-white bg-white text-brand" : "border-line bg-paper text-muted"
          }`}
        >
          {selected ? "✓" : multi ? "+" : ""}
        </span>
      </span>
    </button>
  );
}

export function FilterChip({ label, selected, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`min-h-12 max-w-full touch-manipulation rounded-lg border px-4 py-3 text-sm font-extrabold leading-5 transition focus:outline-none focus:ring-2 focus:ring-brand ${
        selected
          ? "border-brand bg-brand text-white shadow-sm"
          : "border-line bg-white text-ink hover:border-brand hover:bg-paper"
      }`}
    >
      <span className="inline-flex min-w-0 items-center gap-2">
        <span>{selected ? "✓" : "+"}</span>
        <span className="break-words text-left">{label}</span>
      </span>
    </button>
  );
}

export function OptionGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3">{children}</div>;
}

export function RegionInputs({ fields, values, onChange }: RegionInputsProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {fields.map((field) => (
        <label key={field.key} className="grid gap-2">
          <span className="text-sm font-bold text-muted">{field.label}</span>
          <input
            value={values[field.key]}
            onChange={(event) => onChange(field.key, event.target.value)}
            className="min-h-14 scroll-mb-32 rounded-lg border border-line bg-paper px-4 text-base font-semibold text-ink outline-none transition placeholder:text-muted/70 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand"
            placeholder={field.placeholder}
          />
        </label>
      ))}
    </div>
  );
}

export function ReportPanel({ sections, onConsultationStart }: ReportPanelProps) {
  return (
    <div className="grid gap-4">
      <div className="rounded-lg border border-line bg-paper p-4 sm:p-5">
        <h2 className="text-lg font-extrabold text-ink">임시 보고서 요약</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          정확한 견적이나 단가 비교가 아니라, 납품 상담 전 확인해야 할 조건을 정리하는 화면입니다.
        </p>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {sections.map((section) => (
          <ReportRow key={section.label} label={section.label} value={section.value} />
        ))}
      </div>
      {onConsultationStart ? (
        <div className="rounded-lg border border-brand bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-lg font-extrabold text-ink">상담 요청서로 이어가기</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            정리한 창업 조건을 바탕으로 이름과 연락처를 남기면, 다음 단계에서 상담 요청서 저장 기능을 연결할 수 있습니다.
          </p>
          <button
            type="button"
            onClick={onConsultationStart}
            className="mt-4 flex min-h-14 w-full touch-manipulation items-center justify-center rounded-lg bg-brand px-5 py-4 text-base font-extrabold text-white shadow-soft"
          >
            상담 요청서 작성하기
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function BottomActions({
  activeIndex,
  totalSteps,
  nextLabel = "다음 단계",
  showNext = true,
  nextDisabled = false,
  onPrevious,
  onNext,
  onReset
}: BottomActionsProps) {
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-10 grid gap-2 border-t border-line bg-white/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-16px_35px_rgba(23,32,42,0.08)] backdrop-blur sm:static sm:mt-8 sm:bg-transparent sm:p-0 sm:pt-5 sm:shadow-none sm:backdrop-blur-0 ${
        showNext ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"
      }`}
    >
      <button
        type="button"
        onClick={onPrevious}
        className="flex min-h-14 touch-manipulation items-center justify-center rounded-lg border border-line bg-white px-4 py-4 text-base font-bold text-ink disabled:cursor-not-allowed disabled:opacity-45"
        disabled={activeIndex === 0}
      >
        이전
      </button>
      {showNext ? (
        <button
          type="button"
          onClick={onNext}
          className="flex min-h-14 touch-manipulation items-center justify-center rounded-lg bg-brand px-4 py-4 text-base font-bold text-white disabled:cursor-not-allowed disabled:opacity-45"
          disabled={activeIndex === totalSteps - 1 || nextDisabled}
        >
          {nextLabel}
        </button>
      ) : null}
      <button
        type="button"
        onClick={onReset}
        className={`flex min-h-12 touch-manipulation items-center justify-center rounded-lg border border-line bg-paper px-4 py-3 text-sm font-bold text-muted ${
          showNext ? "col-span-2" : ""
        }`}
      >
        처음부터 다시하기
      </button>
    </div>
  );
}

function ReportRow({ label, value }: { label: string; value: string }) {
  const isEmpty = value === "아직 선택하지 않음" || value.includes("아직 선택하지 않음");

  return (
    <div className="rounded-lg border border-line bg-white p-4 shadow-sm">
      <p className="text-sm font-bold text-muted">{label}</p>
      <p className={`mt-2 break-words text-base font-extrabold leading-7 ${isEmpty ? "text-muted" : "text-ink"}`}>
        {value}
      </p>
    </div>
  );
}
