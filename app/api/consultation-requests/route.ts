import { NextResponse } from "next/server";
import { mapConsultationInputToStoragePayload } from "../../../lib/consultation/mappers";
import { saveConsultationRequest } from "../../../lib/consultation/repository";
import { validateConsultationRequestPayload } from "../../../lib/consultation/validation";
import type {
  ConsultationApiBadRequestResponse,
  ConsultationApiServerErrorResponse,
  ConsultationApiSuccessResponse,
  ConsultationApiValidationErrorResponse
} from "../../../lib/consultation/types";

type JsonParseResult =
  | {
      ok: true;
      body: unknown;
    }
  | {
      ok: false;
    };

async function parseJsonRequest(request: Request): Promise<JsonParseResult> {
  try {
    return {
      ok: true,
      body: await request.json()
    };
  } catch {
    return {
      ok: false
    };
  }
}

export async function POST(request: Request) {
  const parsed = await parseJsonRequest(request);

  if (!parsed.ok) {
    const response: ConsultationApiBadRequestResponse = {
      ok: false,
      code: "BAD_REQUEST"
    };

    return NextResponse.json(response, { status: 400 });
  }

  const validation = validateConsultationRequestPayload(parsed.body);

  if (!validation.ok) {
    const response: ConsultationApiValidationErrorResponse = {
      ok: false,
      code: "VALIDATION_ERROR",
      field_errors: validation.field_errors
    };

    return NextResponse.json(response, { status: 400 });
  }

  const payload = mapConsultationInputToStoragePayload(parsed.body);
  const saveResult = await saveConsultationRequest(payload);

  if (!saveResult.ok) {
    const response: ConsultationApiServerErrorResponse = {
      ok: false,
      code: "SERVER_ERROR"
    };

    return NextResponse.json(response, { status: 500 });
  }

  const response: ConsultationApiSuccessResponse = {
    ok: true,
    request_id: saveResult.request_id,
    message: "상담 요청이 접수되었습니다."
  };

  return NextResponse.json(response, { status: 201 });
}
