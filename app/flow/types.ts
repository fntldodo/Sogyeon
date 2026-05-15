export type StartupType = "체인점/전문점 체인" | "개인 전문점" | "기존 매장에 아이스크림 추가";

export type FlowValues = {
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

export type StepId =
  | "startup-type"
  | "region"
  | "store-status"
  | "store-format"
  | "pos-kiosk"
  | "sogyeon-code"
  | "supply-type"
  | "freezer-support"
  | "report";

export type Step = {
  id: StepId;
  eyebrow: string;
  title: string;
  description: string;
};

export type RegionField = {
  label: string;
  key: "region_sido" | "region_sigungu" | "region_area_text";
  placeholder: string;
};

export type ReportSection = {
  label: string;
  value: string;
};
