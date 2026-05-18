import {
  forwardingConsentVersion,
  partnerCheckRequestItems,
  privacyConsentVersion,
  reportSectionLabels
} from "./constants";
import type { ConsultationFormValues, FlowValues, ReportSection } from "./types";
import type { ConsultationRequestInput } from "../../lib/consultation/types";

export function displayValue(value: string) {
  return value.trim() || "아직 선택하지 않음";
}

export function displayList(values: string[]) {
  return values.length > 0 ? values.join(", ") : "아직 선택하지 않음";
}

export function createReportSections(values: FlowValues): ReportSection[] {
  const regionValue =
    [values.region_sido, values.region_sigungu, values.region_area_text]
      .filter((item) => item.trim())
      .join(" ") || "아직 선택하지 않음";

  return [
    {
      label: reportSectionLabels.startup,
      value: displayValue(values.startup_type)
    },
    {
      label: reportSectionLabels.region,
      value: regionValue
    },
    {
      label: reportSectionLabels.store,
      value: `${displayValue(values.store_status)} / ${displayValue(values.store_format)}`
    },
    {
      label: reportSectionLabels.pos,
      value: `1차 선택: ${displayValue(values.pos_kiosk_type)} · 옵션: ${displayList(
        values.pos_kiosk_options
      )} · 현금 결제: ${displayValue(values.cash_payment_type)}`
    },
    {
      label: reportSectionLabels.code,
      value: displayValue(values.sogyeon_code_choice)
    },
    {
      label: reportSectionLabels.supply,
      value: displayValue(values.supply_type)
    },
    {
      label: reportSectionLabels.freezer,
      value: displayValue(values.freezer_support_status)
    }
  ];
}

export function createInternalConsultationSummary(
  values: FlowValues,
  consultationValues: ConsultationFormValues
): string {
  const regionValue =
    [values.region_sido, values.region_sigungu, values.region_area_text]
      .filter((item) => item.trim())
      .join(" ") || "아직 선택하지 않음";
  const memoValue = consultationValues.memo.trim() || "작성한 메모 없음";
  const checkItems = partnerCheckRequestItems.map((item) => `- ${item}`).join("\n");

  return [
    "[소견 내부 전달용 상담 요청서]",
    "",
    `신청자명: ${displayValue(consultationValues.customer_name)}`,
    `연락처: ${displayValue(consultationValues.phone)}`,
    `창업 유형: ${displayValue(values.startup_type)}`,
    `지역: ${regionValue}`,
    `매장 상태: ${displayValue(values.store_status)}`,
    `매장 형태: ${displayValue(values.store_format)}`,
    `키오스크/POS 선택: ${displayValue(values.pos_kiosk_type)}`,
    `키오스크/POS 복수 선택 옵션: ${displayList(values.pos_kiosk_options)}`,
    `현금 결제 방식: ${displayValue(values.cash_payment_type)}`,
    `소견 대표코드 선택 여부: ${displayValue(values.sogyeon_code_choice)}`,
    `납품 방식: ${displayValue(values.supply_type)}`,
    `쇼케이스/냉동고 상태: ${displayValue(values.freezer_support_status)}`,
    `상담 메모: ${memoValue}`,
    "",
    "업체에 확인 요청할 항목:",
    checkItems
  ].join("\n");
}

export function createConsultationRequestPayload(
  values: FlowValues,
  consultationValues: ConsultationFormValues,
  internalSummaryText: string
): ConsultationRequestInput {
  return {
    customer_name: consultationValues.customer_name,
    phone_number: consultationValues.phone,
    contact_memo: consultationValues.memo,
    privacy_agreed: consultationValues.privacy_agreed,
    forwarding_agreed: consultationValues.privacy_agreed,
    privacy_consent_version: privacyConsentVersion,
    forwarding_consent_version: forwardingConsentVersion,
    consented_at: new Date().toISOString(),
    startup_type: values.startup_type,
    region_sido: values.region_sido,
    region_sigungu: values.region_sigungu,
    region_detail: values.region_area_text,
    store_status: values.store_status,
    store_type: values.store_format,
    kiosk_pos_needs: [values.pos_kiosk_type, ...values.pos_kiosk_options],
    cash_payment_type: values.cash_payment_type,
    supply_preference: values.supply_type,
    freezer_showcase_status: values.freezer_support_status,
    sogyeon_code_requested: values.sogyeon_code_choice,
    internal_summary: internalSummaryText,
    source_channel: "web_flow"
  };
}
