import type { ConsultationRequestInput, ConsultationStoragePayload } from "./types";

const DISPLAY_ONLY_NULL_VALUES = new Set(["아직 선택하지 않음", "작성한 메모 없음"]);

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function nullIfDisplayOnly(value: string): string | null {
  return DISPLAY_ONLY_NULL_VALUES.has(value) ? null : value;
}

export function normalizeNullableString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  return nullIfDisplayOnly(trimmed);
}

export function normalizeRequiredString(value: unknown): string | null {
  return normalizeNullableString(value);
}

export function normalizePhoneNumber(value: unknown): string | null {
  const normalized = normalizeRequiredString(value);

  if (!normalized) {
    return null;
  }

  return normalized
    .replace(/[()\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") {
    return value;
  }

  return null;
}

export function normalizeStringArray(value: unknown): string[] {
  const source = Array.isArray(value) ? value : [value];
  const normalized = source
    .map((item) => normalizeNullableString(item))
    .filter((item): item is string => item !== null);

  return Array.from(new Set(normalized));
}

function normalizeSogyeonCodeRequested(value: unknown): boolean | null {
  if (typeof value === "boolean") {
    return value;
  }

  const normalized = normalizeNullableString(value);

  if (normalized === "소견 대표코드로 상담받기") {
    return true;
  }

  if (normalized === "개별 상담으로 진행하기") {
    return false;
  }

  return null;
}

export function mapConsultationInputToStoragePayload(input: unknown): ConsultationStoragePayload {
  const source: ConsultationRequestInput = isRecord(input) ? input : {};

  return {
    contact: {
      customer_name: normalizeRequiredString(source.customer_name) ?? "",
      phone_number: normalizePhoneNumber(source.phone_number) ?? "",
      contact_memo: normalizeNullableString(source.contact_memo),
      privacy_agreed: normalizeBoolean(source.privacy_agreed) === true,
      forwarding_agreed: normalizeBoolean(source.forwarding_agreed) === true,
      privacy_consent_version: normalizeNullableString(source.privacy_consent_version),
      forwarding_consent_version: normalizeNullableString(source.forwarding_consent_version),
      consented_at: normalizeNullableString(source.consented_at)
    },
    business: {
      startup_type: normalizeNullableString(source.startup_type),
      region_sido: normalizeNullableString(source.region_sido),
      region_sigungu: normalizeNullableString(source.region_sigungu),
      region_detail: normalizeNullableString(source.region_detail),
      store_status: normalizeNullableString(source.store_status),
      store_type: normalizeNullableString(source.store_type),
      kiosk_pos_needs: normalizeStringArray(source.kiosk_pos_needs),
      cash_payment_type: normalizeNullableString(source.cash_payment_type),
      supply_preference: normalizeNullableString(source.supply_preference),
      freezer_showcase_status: normalizeNullableString(source.freezer_showcase_status),
      sogyeon_code_requested: normalizeSogyeonCodeRequested(source.sogyeon_code_requested)
    },
    internal: {
      internal_summary: normalizeNullableString(source.internal_summary),
      source_channel: normalizeNullableString(source.source_channel) ?? "web_mvp"
    }
  };
}
