import { mapConsultationInputToStoragePayload, normalizeNullableString } from "./mappers";
import type { ConsultationFieldErrors, ConsultationInputField, ConsultationValidationResult } from "./types";

const MAX_LENGTHS = {
  customer_name: 50,
  phone_number: 30,
  contact_memo: 1000,
  internal_summary: 3000,
  region_sido: 50,
  region_sigungu: 50,
  region_detail: 100
} as const;

const STARTUP_TYPE_OPTIONS = ["체인점/전문점 체인", "개인 전문점", "기존 매장에 아이스크림 추가"];

const STORE_STATUS_OPTIONS = [
  "아직 매장을 찾는 중이에요",
  "보고 있는 매장이 있어요",
  "매장 계약을 완료했어요",
  "기존 매장에서 아이스크림을 추가하려고 해요",
  "기존 아이스크림 매장을 리뉴얼하려고 해요"
];

const STORE_TYPE_OPTIONS = [
  "직원 상주형",
  "테이크아웃 중심형",
  "매장 취식 가능형",
  "무인/반무인 체인형",
  "아직 브랜드 상담 전이에요",
  "무인 운영형",
  "반무인 운영형",
  "냉동고만 추가",
  "아이스크림 코너 추가",
  "기존 POS에 같이 판매",
  "별도 키오스크/POS 추가",
  "배달/포장 메뉴로 추가"
];

const KIOSK_POS_NEEDS_OPTIONS = [
  "POS만 필요해요",
  "키오스크가 필요해요",
  "POS + 키오스크 둘 다 필요해요",
  "기존 장비를 사용할 예정이에요",
  "아직 잘 모르겠어요",
  "카드 결제",
  "간편결제",
  "현금 결제 여부",
  "영수증 출력",
  "메뉴/상품 직접 수정",
  "매출 확인",
  "AS 지원",
  "월 사용료 확인"
];

const CASH_PAYMENT_TYPE_OPTIONS = [
  "현금 결제 필요 없음",
  "키오스크에서 현금 결제까지 필요",
  "현금은 직원/POS에서 처리",
  "아직 모르겠어요"
];

const SUPPLY_PREFERENCE_OPTIONS = [
  "여러 회사 제품을 같이 받고 싶어요",
  "지역 대리점 상담을 받고 싶어요",
  "아직 모르겠어요"
];

const FREEZER_SHOWCASE_STATUS_OPTIONS = ["필요해요", "이미 있어요", "직접 구매할 예정이에요", "아직 모르겠어요"];

const PHONE_ALLOWED_PATTERN = /^[0-9()\-\s]+$/;

// TODO: Keep these server allow-lists in sync with app/flow/constants.ts until shared stable values are introduced.
function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function setLengthError(
  errors: ConsultationFieldErrors,
  field: ConsultationInputField,
  value: string | null,
  maxLength: number
) {
  if (value && value.length > maxLength) {
    errors[field] = `${maxLength}자 이하로 입력해 주세요.`;
  }
}

function setAllowedValueError(
  errors: ConsultationFieldErrors,
  field: ConsultationInputField,
  value: string | null,
  allowedValues: readonly string[]
) {
  if (value && !allowedValues.includes(value)) {
    errors[field] = "허용된 선택값만 저장할 수 있습니다.";
  }
}

export function validateConsultationRequestPayload(input: unknown): ConsultationValidationResult {
  const source = isRecord(input) ? input : {};
  const data = mapConsultationInputToStoragePayload(input);
  const field_errors: ConsultationFieldErrors = {};

  if (!data.contact.customer_name) {
    field_errors.customer_name = "신청자명을 입력해 주세요.";
  }

  setLengthError(field_errors, "customer_name", data.contact.customer_name, MAX_LENGTHS.customer_name);

  if (!data.contact.phone_number) {
    field_errors.phone_number = "연락처를 입력해 주세요.";
  } else {
    const rawPhoneNumber = normalizeNullableString(source.phone_number);

    if (rawPhoneNumber && !PHONE_ALLOWED_PATTERN.test(rawPhoneNumber)) {
      field_errors.phone_number = "연락처는 숫자, 하이픈, 공백, 괄호만 사용할 수 있습니다.";
    } else {
      setLengthError(field_errors, "phone_number", data.contact.phone_number, MAX_LENGTHS.phone_number);
    }
  }

  if (!data.contact.privacy_agreed) {
    field_errors.privacy_agreed = "개인정보 수집 및 이용 동의가 필요합니다.";
  }

  if (!data.contact.forwarding_agreed) {
    field_errors.forwarding_agreed = "상담 전달 동의가 필요합니다.";
  }

  setLengthError(field_errors, "contact_memo", data.contact.contact_memo, MAX_LENGTHS.contact_memo);
  setLengthError(field_errors, "internal_summary", data.internal.internal_summary, MAX_LENGTHS.internal_summary);
  setLengthError(field_errors, "region_sido", data.business.region_sido, MAX_LENGTHS.region_sido);
  setLengthError(field_errors, "region_sigungu", data.business.region_sigungu, MAX_LENGTHS.region_sigungu);
  setLengthError(field_errors, "region_detail", data.business.region_detail, MAX_LENGTHS.region_detail);

  setAllowedValueError(field_errors, "startup_type", data.business.startup_type, STARTUP_TYPE_OPTIONS);
  setAllowedValueError(field_errors, "store_status", data.business.store_status, STORE_STATUS_OPTIONS);
  setAllowedValueError(field_errors, "store_type", data.business.store_type, STORE_TYPE_OPTIONS);
  setAllowedValueError(field_errors, "cash_payment_type", data.business.cash_payment_type, CASH_PAYMENT_TYPE_OPTIONS);
  setAllowedValueError(field_errors, "supply_preference", data.business.supply_preference, SUPPLY_PREFERENCE_OPTIONS);
  setAllowedValueError(
    field_errors,
    "freezer_showcase_status",
    data.business.freezer_showcase_status,
    FREEZER_SHOWCASE_STATUS_OPTIONS
  );

  if (data.business.kiosk_pos_needs.some((item) => !KIOSK_POS_NEEDS_OPTIONS.includes(item))) {
    field_errors.kiosk_pos_needs = "허용된 키오스크/POS 선택값만 저장할 수 있습니다.";
  }

  const rawSogyeonCodeRequested = source.sogyeon_code_requested;
  const normalizedSogyeonCodeRequested = normalizeNullableString(rawSogyeonCodeRequested);
  const isValidSogyeonCodeRequested =
    rawSogyeonCodeRequested === undefined ||
    rawSogyeonCodeRequested === null ||
    typeof rawSogyeonCodeRequested === "boolean" ||
    normalizedSogyeonCodeRequested === null ||
    normalizedSogyeonCodeRequested === "소견 대표코드로 상담받기" ||
    normalizedSogyeonCodeRequested === "개별 상담으로 진행하기";

  if (!isValidSogyeonCodeRequested) {
    field_errors.sogyeon_code_requested = "소견 대표코드 요청 여부는 true, false 또는 null만 저장할 수 있습니다.";
  }

  if (Object.keys(field_errors).length > 0) {
    return {
      ok: false,
      field_errors
    };
  }

  return {
    ok: true,
    data
  };
}
