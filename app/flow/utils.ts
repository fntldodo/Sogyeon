import { reportSectionLabels } from "./constants";
import type { FlowValues, ReportSection } from "./types";

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
