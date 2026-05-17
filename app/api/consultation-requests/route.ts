import { NextResponse } from "next/server";
import { validateConsultationRequestPayload } from "../../../lib/consultation/validation";
import type {
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

type ConsultationJsonParseFailureResponse = {
  ok: false;
  message: string;
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
    const response: ConsultationJsonParseFailureResponse = {
      ok: false,
      message: "요청 형식이 올바르지 않습니다."
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

  // Temporary mock id for Phase 4.2.1. No database write is performed in this phase.
  const response: ConsultationApiSuccessResponse = {
    ok: true,
    request_id: `mock_${crypto.randomUUID()}`,
    message: "상담 요청 검증이 완료되었습니다. 저장 기능은 아직 연결되지 않았습니다."
  };

  return NextResponse.json(response, { status: 201 });
}
