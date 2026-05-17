export type ConsultationInputField =
  | "customer_name"
  | "phone_number"
  | "contact_memo"
  | "privacy_agreed"
  | "forwarding_agreed"
  | "privacy_consent_version"
  | "forwarding_consent_version"
  | "consented_at"
  | "startup_type"
  | "region_sido"
  | "region_sigungu"
  | "region_detail"
  | "store_status"
  | "store_type"
  | "kiosk_pos_needs"
  | "cash_payment_type"
  | "supply_preference"
  | "freezer_showcase_status"
  | "sogyeon_code_requested"
  | "internal_summary"
  | "source_channel";

export type ConsultationRequestInput = Partial<Record<ConsultationInputField, unknown>>;

export type ConsultationContactPayload = {
  customer_name: string;
  phone_number: string;
  contact_memo: string | null;
  privacy_agreed: boolean;
  forwarding_agreed: boolean;
  privacy_consent_version: string | null;
  forwarding_consent_version: string | null;
  consented_at: string | null;
};

export type ConsultationBusinessPayload = {
  startup_type: string | null;
  region_sido: string | null;
  region_sigungu: string | null;
  region_detail: string | null;
  store_status: string | null;
  store_type: string | null;
  kiosk_pos_needs: string[];
  cash_payment_type: string | null;
  supply_preference: string | null;
  freezer_showcase_status: string | null;
  sogyeon_code_requested: boolean | null;
};

export type ConsultationInternalPayload = {
  internal_summary: string | null;
  source_channel: string;
};

export type ConsultationStoragePayload = {
  contact: ConsultationContactPayload;
  business: ConsultationBusinessPayload;
  internal: ConsultationInternalPayload;
};

export type ConsultationFieldErrors = Partial<Record<ConsultationInputField, string>>;

export type ConsultationValidationResult =
  | {
      ok: true;
      data: ConsultationStoragePayload;
    }
  | {
      ok: false;
      field_errors: ConsultationFieldErrors;
    };

export type ConsultationApiSuccessResponse = {
  ok: true;
  request_id: string;
  message: string;
};

export type ConsultationApiValidationErrorResponse = {
  ok: false;
  code: "VALIDATION_ERROR";
  field_errors: ConsultationFieldErrors;
};

export type ConsultationApiBadRequestResponse = {
  ok: false;
  code: "BAD_REQUEST";
};

export type ConsultationApiServerErrorResponse = {
  ok: false;
  code: "SERVER_ERROR";
  message: string;
};

export type ConsultationApiResponse =
  | ConsultationApiSuccessResponse
  | ConsultationApiValidationErrorResponse
  | ConsultationApiBadRequestResponse
  | ConsultationApiServerErrorResponse;
