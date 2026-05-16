import type { ConsultationFormValues, FlowValues, RegionField, StartupType, Step } from "./types";

export const emptyValues: FlowValues = {
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

export const emptyConsultationFormValues: ConsultationFormValues = {
  customer_name: "",
  phone: "",
  memo: "",
  privacy_agreed: false
};

export const steps: Step[] = [
  {
    id: "startup-type",
    eyebrow: "1 / 11",
    title: "창업 종류 선택",
    description: "준비 중인 아이스크림 창업 형태와 가장 가까운 항목을 골라보세요."
  },
  {
    id: "region",
    eyebrow: "2 / 11",
    title: "지역 선택",
    description: "상담에 필요한 기본 지역 정보를 정리합니다. 아직 정확하지 않아도 괜찮습니다."
  },
  {
    id: "store-status",
    eyebrow: "3 / 11",
    title: "매장 상태 선택",
    description: "현재 매장 준비 단계에 맞는 항목을 선택해 상담 준비 범위를 좁힙니다."
  },
  {
    id: "store-format",
    eyebrow: "4 / 11",
    title: "매장 형태 선택",
    description: "선택한 창업 종류에 따라 확인할 수 있는 매장 형태를 정리합니다."
  },
  {
    id: "pos-kiosk",
    eyebrow: "5 / 11",
    title: "키오스크/POS 선택",
    description: "필요한 장비 방향과 자주 확인하는 옵션을 정리합니다."
  },
  {
    id: "sogyeon-code",
    eyebrow: "6 / 11",
    title: "소견 대표코드 안내",
    description: "상담 진행 방식에 맞춰 대표코드 활용 여부를 확인합니다."
  },
  {
    id: "supply-type",
    eyebrow: "7 / 11",
    title: "납품 방식 선택",
    description: "희망하는 납품 상담 방향을 정리합니다."
  },
  {
    id: "freezer-support",
    eyebrow: "8 / 11",
    title: "쇼케이스/냉동고 지원 확인",
    description: "제품 보관과 진열 장비의 준비 상태를 확인합니다."
  },
  {
    id: "report",
    eyebrow: "9 / 11",
    title: "상담 전 조건 정리 보고서",
    description: "선택한 조건을 바탕으로 납품 상담 전에 확인할 내용을 요약합니다."
  },
  {
    id: "consultation-form",
    eyebrow: "10 / 11",
    title: "상담 요청서 작성",
    description: "납품 상담에 필요한 연락처와 요청 메모를 남겨주세요."
  },
  {
    id: "consultation-complete",
    eyebrow: "11 / 11",
    title: "상담 요청서 확인",
    description: "입력한 고객 정보와 창업 조건 요약을 한 번 더 확인합니다."
  }
];

export const startupTypeOptions: StartupType[] = [
  "체인점/전문점 체인",
  "개인 전문점",
  "기존 매장에 아이스크림 추가"
];

export const storeStatusOptions = [
  "아직 매장을 찾는 중이에요",
  "보고 있는 매장이 있어요",
  "매장 계약을 완료했어요",
  "기존 매장에서 아이스크림을 추가하려고 해요",
  "기존 아이스크림 매장을 리뉴얼하려고 해요"
];

export const storeFormatOptions: Record<StartupType, string[]> = {
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

export const posKioskTypeOptions = [
  "POS만 필요해요",
  "키오스크가 필요해요",
  "POS + 키오스크 둘 다 필요해요",
  "기존 장비를 사용할 예정이에요",
  "아직 잘 모르겠어요"
];

export const posKioskDetailOptions = [
  "카드 결제",
  "간편결제",
  "현금 결제 여부",
  "영수증 출력",
  "메뉴/상품 직접 수정",
  "매출 확인",
  "AS 지원",
  "월 사용료 확인"
];

export const cashPaymentOptions = [
  "현금 결제 필요 없음",
  "키오스크에서 현금 결제까지 필요",
  "현금은 직원/POS에서 처리",
  "아직 모르겠어요"
];

export const sogyeonCodeOptions = ["소견 대표코드로 상담받기", "개별 상담으로 진행하기"];

export const sogyeonCodeHelp: Record<string, string> = {
  "소견 대표코드로 상담받기": "상담 담당자가 소견에서 정리한 조건을 기준으로 확인할 수 있게 돕습니다.",
  "개별 상담으로 진행하기": "대표코드 없이 직접 상담을 진행하되, 정리한 조건은 그대로 참고할 수 있습니다."
};

export const supplyTypeOptions = [
  "여러 회사 제품을 같이 받고 싶어요",
  "지역 대리점 상담을 받고 싶어요",
  "아직 모르겠어요"
];

export const freezerSupportOptions = ["필요해요", "이미 있어요", "직접 구매할 예정이에요", "아직 모르겠어요"];

export const regionFields: RegionField[] = [
  { label: "시/도", key: "region_sido", placeholder: "예: 서울특별시" },
  { label: "시/군/구", key: "region_sigungu", placeholder: "예: 마포구" },
  { label: "동네/상권명 입력", key: "region_area_text", placeholder: "예: 홍대입구역 인근" }
];

export const reportSectionLabels = {
  startup: "창업 조건 요약",
  region: "지역 요약",
  store: "매장 상태/형태 요약",
  pos: "키오스크/POS 선택 요약",
  code: "소견 대표코드 선택 요약",
  supply: "납품 상담 방식 요약",
  freezer: "쇼케이스/냉동고 확인 요약"
};

export const consultationCompletionNotice =
  "아직 실제 접수 저장 기능은 연결되지 않았습니다. 다음 단계에서 Supabase 저장 기능을 연결할 예정입니다.";

export const privacyAgreementText =
  "개인정보와 상담 요청 내용을 납품 상담 준비 목적으로 확인하는 데 동의합니다.";

export const partnerCheckRequestItems = [
  "냉동고/쇼케이스 지원 가능 여부",
  "초도 증정품/지원품 가능 여부",
  "배송 주기",
  "혼판 가능 여부",
  "최소 발주 조건",
  "긴급 발주 대응 가능 여부"
];

export const internalSummaryCopyFeedback = {
  success: "복사되었습니다.",
  error: "복사하지 못했습니다. 요약문을 직접 선택해 복사해주세요."
};
