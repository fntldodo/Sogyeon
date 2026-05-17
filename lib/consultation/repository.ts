import { createSupabaseServiceClient } from "../supabase/server";
import type { ConsultationStoragePayload } from "./types";

type SaveConsultationRequestResult =
  | {
      ok: true;
      request_id: string;
    }
  | {
      ok: false;
    };

type ConsultationRequestInsertRow = {
  startup_type: string | null;
  region_sido: string | null;
  region_sigungu: string | null;
  region_area_text: string | null;
  store_status: string | null;
  store_format: string | null;
  pos_kiosk_type: string | null;
  pos_kiosk_options: string[] | null;
  cash_payment_type: string | null;
  sogyeon_code_choice: string | null;
  supply_type: string | null;
  freezer_support_status: string | null;
  request_status: "new";
  source: string;
};

type ConsultationRequestContactsInsertRow = {
  request_id: string;
  customer_name: string;
  phone_number: string;
  memo: string | null;
  internal_summary: string | null;
  privacy_agreed: boolean;
  forwarding_agreed: boolean;
  privacy_consent_version: string | null;
  forwarding_consent_version: string | null;
  consented_at: string | null;
};

type ConsultationRequestEventInsertRow = {
  request_id: string;
  event_type: "request_created";
  actor_type: "system";
  metadata: {
    source_channel: string;
  };
};

type InsertedRequestRow = {
  id: string;
};

function isInsertedRequestRow(value: unknown): value is InsertedRequestRow {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    value.id.length > 0
  );
}

function getPrimaryKioskChoice(values: string[]): string | null {
  return values[0] ?? null;
}

function getKioskOptions(values: string[]): string[] | null {
  return values.length > 0 ? values : null;
}

function getSogyeonCodeChoice(value: boolean | null): string | null {
  if (value === true) {
    return "requested";
  }

  if (value === false) {
    return "not_requested";
  }

  return null;
}

function toConsultationRequestInsertRow(payload: ConsultationStoragePayload): ConsultationRequestInsertRow {
  return {
    startup_type: payload.business.startup_type,
    region_sido: payload.business.region_sido,
    region_sigungu: payload.business.region_sigungu,
    region_area_text: payload.business.region_detail,
    store_status: payload.business.store_status,
    store_format: payload.business.store_type,
    pos_kiosk_type: getPrimaryKioskChoice(payload.business.kiosk_pos_needs),
    pos_kiosk_options: getKioskOptions(payload.business.kiosk_pos_needs),
    cash_payment_type: payload.business.cash_payment_type,
    sogyeon_code_choice: getSogyeonCodeChoice(payload.business.sogyeon_code_requested),
    supply_type: payload.business.supply_preference,
    freezer_support_status: payload.business.freezer_showcase_status,
    request_status: "new",
    source: payload.internal.source_channel
  };
}

function toConsultationRequestContactsInsertRow(
  requestId: string,
  payload: ConsultationStoragePayload
): ConsultationRequestContactsInsertRow {
  return {
    request_id: requestId,
    customer_name: payload.contact.customer_name,
    phone_number: payload.contact.phone_number,
    memo: payload.contact.contact_memo,
    internal_summary: payload.internal.internal_summary,
    privacy_agreed: payload.contact.privacy_agreed,
    forwarding_agreed: payload.contact.forwarding_agreed,
    privacy_consent_version: payload.contact.privacy_consent_version,
    forwarding_consent_version: payload.contact.forwarding_consent_version,
    consented_at: payload.contact.consented_at
  };
}

function toConsultationRequestEventInsertRow(
  requestId: string,
  payload: ConsultationStoragePayload
): ConsultationRequestEventInsertRow {
  return {
    request_id: requestId,
    event_type: "request_created",
    actor_type: "system",
    metadata: {
      source_channel: payload.internal.source_channel
    }
  };
}

export async function saveConsultationRequest(
  payload: ConsultationStoragePayload
): Promise<SaveConsultationRequestResult> {
  try {
    const supabase = createSupabaseServiceClient();

    const requestResult = await supabase
      .from("consultation_requests")
      .insert(toConsultationRequestInsertRow(payload))
      .select("id")
      .single();

    if (requestResult.error) {
      console.error("consultation_requests insert failed", { code: requestResult.error.code });
      return { ok: false };
    }

    const requestData: unknown = requestResult.data;

    if (!isInsertedRequestRow(requestData)) {
      console.error("consultation_requests insert returned no request id");
      return { ok: false };
    }

    const requestId = requestData.id;
    const contactResult = await supabase
      .from("consultation_request_contacts")
      .insert(toConsultationRequestContactsInsertRow(requestId, payload));

    if (contactResult.error) {
      console.error("consultation_request_contacts insert failed", { code: contactResult.error.code });

      const deleteResult = await supabase.from("consultation_requests").delete().eq("id", requestId);

      if (deleteResult.error) {
        console.error("consultation_requests compensation delete failed", { code: deleteResult.error.code });
      }

      return { ok: false };
    }

    const eventResult = await supabase
      .from("consultation_request_events")
      .insert(toConsultationRequestEventInsertRow(requestId, payload));

    if (eventResult.error) {
      // TODO: Surface this in an internal operations log once admin tooling exists.
      console.error("consultation_request_events insert failed", { code: eventResult.error.code });
    }

    return {
      ok: true,
      request_id: requestId
    };
  } catch (error) {
    console.error("consultation request save failed", { name: error instanceof Error ? error.name : "UnknownError" });
    return { ok: false };
  }
}
