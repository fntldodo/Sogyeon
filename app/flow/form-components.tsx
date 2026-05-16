import { consultationCompletionNotice, privacyAgreementText } from "./constants";
import type { ConsultationFormErrors, ConsultationFormValues, ReportSection } from "./types";

type ConsultationFormPanelProps = {
  values: ConsultationFormValues;
  errors: ConsultationFormErrors;
  onChange: <Key extends keyof ConsultationFormValues>(
    key: Key,
    value: ConsultationFormValues[Key]
  ) => void;
};

type ConsultationCompletePanelProps = {
  formValues: ConsultationFormValues;
  reportSections: ReportSection[];
};

export function ConsultationFormPanel({ values, errors, onChange }: ConsultationFormPanelProps) {
  return (
    <div className="grid gap-4">
      <div className="rounded-lg border border-line bg-paper p-4 sm:p-5">
        <h2 className="text-lg font-extrabold text-ink">고객 기본 정보</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          실제 접수 저장은 아직 연결하지 않고, 입력값 확인 화면까지만 제공합니다.
        </p>
      </div>

      <div className="grid gap-4">
        <TextField
          id="customer-name"
          label="이름 또는 신청자명"
          value={values.customer_name}
          placeholder="예: 홍길동"
          error={errors.customer_name}
          autoComplete="name"
          onChange={(value) => onChange("customer_name", value)}
        />
        <TextField
          id="customer-phone"
          label="연락처"
          value={values.phone}
          placeholder="예: 010-0000-0000"
          error={errors.phone}
          autoComplete="tel"
          inputMode="tel"
          onChange={(value) => onChange("phone", value)}
        />
        <div className="grid gap-2">
          <label htmlFor="consultation-memo" className="text-sm font-bold text-muted">
            상담 요청 메모
          </label>
          <textarea
            id="consultation-memo"
            value={values.memo}
            onChange={(event) => onChange("memo", event.target.value)}
            className="min-h-32 scroll-mb-40 rounded-lg border border-line bg-paper px-4 py-4 text-base font-semibold leading-7 text-ink outline-none transition placeholder:text-muted/70 focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand"
            placeholder="예: 오픈 예상 시기, 보고 있는 상권, 꼭 확인하고 싶은 내용을 적어주세요."
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label className="flex min-h-16 touch-manipulation items-start gap-3 rounded-lg border border-line bg-white p-4 shadow-sm">
          <input
            type="checkbox"
            checked={values.privacy_agreed}
            onChange={(event) => onChange("privacy_agreed", event.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 accent-brand"
          />
          <span className="min-w-0">
            <span className="block break-words text-sm font-extrabold leading-6 text-ink">
              개인정보 및 상담 전달 동의
            </span>
            <span className="mt-1 block break-words text-sm leading-6 text-muted">
              {privacyAgreementText}
            </span>
          </span>
        </label>
        {errors.privacy_agreed ? <ErrorMessage message={errors.privacy_agreed} /> : null}
      </div>
    </div>
  );
}

export function ConsultationCompletePanel({
  formValues,
  reportSections
}: ConsultationCompletePanelProps) {
  return (
    <div className="grid gap-4">
      <div className="rounded-lg border border-brand bg-paper p-4 sm:p-5">
        <h2 className="text-lg font-extrabold text-ink">상담 요청서 확인/완료</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-brand">
          창업 조건을 정리해서 납품 상담을 제대로 받을 수 있게 도와주는 곳
        </p>
        <p className="mt-3 text-sm leading-6 text-muted">{consultationCompletionNotice}</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <SummaryRow label="이름 또는 신청자명" value={formValues.customer_name} />
        <SummaryRow label="연락처" value={formValues.phone} />
        <SummaryRow label="상담 요청 메모" value={formValues.memo || "작성한 메모 없음"} wide />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {reportSections.map((section) => (
          <SummaryRow key={section.label} label={section.label} value={section.value} />
        ))}
      </div>
    </div>
  );
}

function TextField({
  id,
  label,
  value,
  placeholder,
  error,
  autoComplete,
  inputMode,
  onChange
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel";
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-bold text-muted">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={`min-h-14 scroll-mb-40 rounded-lg border bg-paper px-4 text-base font-semibold text-ink outline-none transition placeholder:text-muted/70 focus:bg-white focus:ring-2 focus:ring-brand ${
          error ? "border-red-400" : "border-line focus:border-brand"
        }`}
        placeholder={placeholder}
      />
      {error ? <ErrorMessage message={error} /> : null}
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return <span className="break-words text-sm font-bold leading-6 text-red-600">{message}</span>;
}

function SummaryRow({
  label,
  value,
  wide = false
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={`rounded-lg border border-line bg-white p-4 shadow-sm ${wide ? "lg:col-span-2" : ""}`}>
      <p className="text-sm font-bold text-muted">{label}</p>
      <p className="mt-2 break-words text-base font-extrabold leading-7 text-ink">{value}</p>
    </div>
  );
}
