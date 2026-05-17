# 상담 요청 API 설계

## 1. 문서 목적

이 문서는 소견 MVP의 상담 요청 저장 기능을 실제 구현하기 전에 Route Handler와 서버 검증 구조를 설계하기 위한 문서입니다.

- Phase 4.2.2-A에서는 실제 저장을 구현하지 않고 서버 저장 설계를 확정합니다.
- Supabase client 코드, 환경변수 파일, SQL migration은 생성하지 않습니다.
- 다음 구현 Phase에서 실제 저장 구현을 시작할 때 이 문서를 기준으로 파일 위치, payload 타입, 검증 함수, 응답 구조를 구현합니다.

## 2. 확정 환경변수와 서버 client 위치

Phase 4.2.2-A 기준으로 다음 환경변수 이름을 확정합니다.

| 이름 | 노출 범위 | 용도 |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | 클라이언트 노출 가능 | Supabase 프로젝트 URL |
| `SUPABASE_SERVICE_ROLE_KEY` | 서버 전용 | Route Handler에서 서버 권한 insert를 수행할 때 사용하는 key |

보안 원칙은 다음과 같습니다.

- `NEXT_PUBLIC_SUPABASE_URL`은 공개 URL이므로 클라이언트 노출이 가능합니다.
- `SUPABASE_SERVICE_ROLE_KEY`는 절대 `NEXT_PUBLIC_` 접두사를 사용하지 않습니다.
- `SUPABASE_SERVICE_ROLE_KEY`는 Client Component에서 import하거나 접근하지 않습니다.
- `.env.local`은 Git에 포함하지 않습니다.

Supabase server client 권장 위치는 다음으로 확정합니다.

```text
lib/supabase/server.ts
```

Phase 4.2.2-B에서 이 파일을 생성했고, Phase 4.2.2-C에서 `server-only` 보호를 적용했습니다.

## 3. Route Handler 위치

권장 Route Handler 경로는 다음과 같습니다.

```text
app/api/consultation-requests/route.ts
```

Phase 4.2.1에서 이 경로에 Route Handler 골격을 생성했습니다. 현재는 DB 저장 없이 검증 성공/실패 JSON 응답만 반환합니다.

설계 기준은 다음과 같습니다.

- `POST` 요청으로 상담 요청 저장 payload를 받습니다.
- 클라이언트 컴포넌트는 이 Route Handler에만 제출합니다.
- Route Handler는 입력값을 신뢰하지 않고 서버 검증을 다시 수행합니다.
- 검증 실패 시 Supabase insert를 시도하지 않습니다.
- DB 에러 원문은 사용자 응답에 포함하지 않습니다.
- 현재 Phase에서는 Supabase insert를 수행하지 않고 `mock_` prefix의 임시 `request_id`를 반환합니다.

## 4. Route Handler 실제 저장 흐름

실제 저장 Phase에서는 아래 흐름으로 확정합니다.

1. `POST /api/consultation-requests`
2. `request.json()` 파싱
3. `validateConsultationRequestPayload(input: unknown)` 호출
4. 검증 실패 시 400 응답과 `code: "VALIDATION_ERROR"`, `field_errors` 반환
5. 검증 성공 시 `mapConsultationInputToStoragePayload`로 저장 payload 확정
6. `consultation_requests` insert
7. `consultation_request_contacts` insert
8. `consultation_request_events` insert
9. 성공 시 201 응답과 실제 `request_id` 반환
10. 실패 시 500 응답과 일반 오류 메시지 반환

DB 에러 원문은 사용자 응답에 노출하지 않습니다.

## 5. 서버 검증 함수 위치

Phase 4.2.0에서 생성한 파일은 다음과 같습니다.

| 파일 | 역할 |
| --- | --- |
| `lib/consultation/types.ts` | 요청 payload, 정규화된 payload, 응답 타입, field error 타입을 정의합니다. |
| `lib/consultation/validation.ts` | 필수값, 길이, 선택값 허용 목록, 동의값 검증을 수행합니다. |
| `lib/consultation/mappers.ts` | 프론트의 `FlowValues`와 상담 폼 값을 DB insert payload로 변환합니다. |

역할 분리 원칙은 다음과 같습니다.

- `route.ts`는 요청 파싱, 검증 호출, insert 호출, 응답 생성에 집중합니다.
- `validation.ts`는 저장 가능 여부를 판단하고 field error를 만듭니다.
- `mappers.ts`는 UI 표시값과 DB 저장값을 분리합니다.
- `types.ts`는 타입 검사를 우회하는 범용 타입 없이 명확한 타입을 제공합니다.

## 6. 서버 payload 타입 설계

상담 요청 저장 payload는 아래 3개 그룹으로 나눕니다.

### customer/contact group

| 필드 | 설명 | 저장 후보 |
| --- | --- | --- |
| `customer_name` | 신청자명 | `consultation_request_contacts.customer_name` |
| `phone_number` | 연락처 | `consultation_request_contacts.phone_number` |
| `contact_memo` | 상담 요청 메모 | `consultation_request_contacts.memo` |
| `privacy_agreed` | 개인정보 수집 및 이용 동의 여부 | `consultation_request_contacts.privacy_agreed` |
| `forwarding_agreed` | 상담 전달 동의 여부 | `consultation_request_contacts.forwarding_agreed` |
| `privacy_consent_version` | 개인정보 동의 문구 버전 | `consultation_request_contacts.privacy_consent_version` |
| `forwarding_consent_version` | 상담 전달 동의 문구 버전 | `consultation_request_contacts.forwarding_consent_version` |
| `consented_at` | 동의 및 제출 일시 | `consultation_request_contacts.consented_at` |

### flow/business group

| 필드 | 설명 | 저장 후보 |
| --- | --- | --- |
| `startup_type` | 창업 유형 | `consultation_requests.startup_type` |
| `region_sido` | 시/도 | `consultation_requests.region_sido` |
| `region_sigungu` | 시/군/구 | `consultation_requests.region_sigungu` |
| `region_detail` | 동네/상권명 | `consultation_requests.region_area_text` |
| `store_status` | 매장 상태 | `consultation_requests.store_status` |
| `store_type` | 매장 형태 | `consultation_requests.store_format` |
| `kiosk_pos_needs` | 키오스크/POS 1차 선택 | `consultation_requests.pos_kiosk_type` |
| `cash_payment_type` | 현금 결제 방식 | `consultation_requests.cash_payment_type` |
| `supply_preference` | 납품 방식 | `consultation_requests.supply_type` |
| `freezer_showcase_status` | 쇼케이스/냉동고 상태 | `consultation_requests.freezer_support_status` |
| `sogyeon_code_requested` | 소견 대표코드 요청 여부 | `consultation_requests.sogyeon_code_choice` 또는 boolean 파생값 |

키오스크/POS 복수 선택 옵션은 Phase 4.2에서 현재 프론트 상태 구조를 확인한 뒤 `pos_kiosk_options`로 함께 저장할지 결정합니다.

### internal group

| 필드 | 설명 | 저장 후보 |
| --- | --- | --- |
| `internal_summary` | 내부 전달용 상담 요청서 요약문 | `consultation_request_contacts.internal_summary` |
| `source_channel` | 제출 출처 | `consultation_requests.source` |

## 7. 서버 검증 규칙

서버 검증은 클라이언트 검증과 별도로 반드시 수행합니다.

| 항목 | 검증 기준 |
| --- | --- |
| `customer_name` | 필수, 앞뒤 공백 제거, 빈 문자열 불가, 최대 50자 |
| `phone_number` | 필수, 앞뒤 공백 제거, 숫자/하이픈/공백 정규화, 최대 30자 |
| `privacy_agreed` | 반드시 `true` |
| `forwarding_agreed` | 반드시 `true` |
| `contact_memo` | 선택값, 앞뒤 공백 제거, 최대 1000자 |
| `internal_summary` | 선택값, 최대 3000자 |
| `region_sido` | 선택값, 최대 50자 |
| `region_sigungu` | 선택값, 최대 50자 |
| `region_detail` | 선택값, 최대 100자 |
| 선택형 값 | 허용된 enum 또는 상수 목록에 있는 값만 허용 |
| 미선택 값 | “아직 선택하지 않음” 문자열이 아니라 `null`로 처리 |
| 알 수 없는 필드 | 저장 payload에서 제거 |

검증 실패 시에는 DB insert를 시도하지 않습니다.

## 8. 선택값 허용 목록

서버 검증의 허용 목록은 현재 화면 선택지를 기준으로 하되, 구현 시에는 프론트 표시 문구와 DB 저장값이 섞이지 않게 주의합니다.

검증 대상 후보는 다음과 같습니다.

- `startup_type`
- `store_status`
- `store_type`
- `kiosk_pos_needs`
- `cash_payment_type`
- `supply_preference`
- `freezer_showcase_status`
- `sogyeon_code_requested`

Phase 4.2에서는 `app/flow/constants.ts`의 선택지와 서버 허용 목록이 어긋나지 않도록 확인합니다. 가능하면 표시 라벨과 저장 코드값을 분리하는 구조를 검토합니다.

## 9. FlowValues → 저장 payload 변환 기준

현재 프론트의 `FlowValues`는 화면 표시와 상담 보고서 생성을 위해 쓰입니다. DB 저장 payload로 보낼 때는 다음 원칙을 적용합니다.

- 화면 표시 문구는 UI에서만 사용합니다.
- DB에는 enum, `null`, 정규화된 문자열만 저장합니다.
- “아직 선택하지 않음” 같은 fallback 문구는 DB에 저장하지 않습니다.
- `region_detail`은 DB의 `region_area_text`로 매핑합니다.
- `store_type`은 DB의 `store_format`으로 매핑합니다.
- `kiosk_pos_needs`는 DB의 `pos_kiosk_type`으로 매핑합니다.
- `supply_preference`는 DB의 `supply_type`으로 매핑합니다.
- `freezer_showcase_status`는 DB의 `freezer_support_status`로 매핑합니다.
- `contact_memo`는 개인정보 가능성이 있으므로 contacts 테이블의 `memo`로 매핑합니다.
- `internal_summary`는 개인정보 가능성이 있으므로 contacts 테이블로 매핑합니다.

## 10. 성공/실패 응답 구조

현재 mock 단계와 실제 저장 단계를 구분합니다.

### 현재 Phase 4.2.1 응답

| 상황 | 상태 코드 | 응답 |
| --- | --- | --- |
| 검증 성공 | 201 | `ok: true`, `mock_` prefix의 임시 `request_id`, 안내 메시지 |
| 검증 실패 | 400 | `ok: false`, `code: "VALIDATION_ERROR"`, `field_errors` |
| JSON 파싱 실패 | 400 | `ok: false`, 요청 형식 오류 메시지 |

### 실제 저장 Phase 응답

| 상황 | 상태 코드 | 응답 |
| --- | --- | --- |
| 저장 성공 | 201 | `ok: true`, 실제 `request_id`, 접수 완료 메시지 |
| 검증 실패 | 400 | `ok: false`, `code: "VALIDATION_ERROR"`, `field_errors` |
| JSON 파싱 실패 | 400 | `ok: false`, `code: "BAD_REQUEST"` 구조를 권장 |
| 저장 실패 | 500 | `ok: false`, `code: "SERVER_ERROR"`, 일반 오류 메시지 |

사용자 응답에는 DB 에러 원문을 포함하지 않습니다. 내부 로그에는 원인 확인이 가능하도록 남길 수 있습니다.

### 성공 응답

```json
{
  "ok": true,
  "request_id": "uuid",
  "message": "상담 요청이 접수되었습니다."
}
```

### 검증 실패 응답

```json
{
  "ok": false,
  "code": "VALIDATION_ERROR",
  "field_errors": {
    "customer_name": "신청자명을 입력해 주세요.",
    "phone_number": "연락처를 입력해 주세요."
  }
}
```

### 서버 오류 응답

```json
{
  "ok": false,
  "code": "SERVER_ERROR",
  "message": "잠시 후 다시 시도해 주세요."
}
```

Phase 4.2.2-B부터 JSON 파싱 실패 응답은 `BAD_REQUEST` code를 포함합니다.

## 11. Supabase insert 순서와 실패 처리 전략

실제 구현은 다음 구현 Phase에서 진행합니다. insert 순서는 다음으로 확정합니다.

1. `consultation_requests` insert
2. `consultation_request_contacts` insert
3. `consultation_request_events` insert

초기 이벤트는 `request_created`를 기록하는 방향을 우선합니다.

### MVP 1차 구현 전략

- Supabase RPC 또는 DB transaction 함수를 만들기 전까지 Route Handler에서 순차 insert를 사용합니다.
- `consultation_request_contacts` insert 실패 시 개인정보 없는 `consultation_requests`만 남는 것은 운영상 위험하므로, 가능하면 생성된 `consultation_requests` 레코드를 보상 삭제합니다.
- `consultation_request_contacts` insert 실패 시 사용자에게는 500 응답과 `code: "SERVER_ERROR"` 형태의 일반 오류를 반환합니다.
- `consultation_request_events` insert만 실패하고 request/contact 저장이 성공했다면 핵심 상담 리드는 보존합니다.
- `consultation_request_events` insert 실패만으로 request/contact 데이터를 보상 삭제하지 않습니다.
- 이벤트 로그 누락은 운영 추적 보완 이슈로 취급하고, 서버 내부 로그 또는 운영 확인 TODO로 남깁니다.
- 이벤트 로그만 실패한 경우 MVP 1차 전략은 사용자에게 201 성공 응답과 실제 `request_id`를 반환하는 것입니다.
- contacts 실패 후 보상 삭제도 실패할 수 있으므로 서버 로그와 운영 확인 TODO를 남깁니다.
- insert 또는 보상 삭제 실패의 원문은 사용자 응답에 노출하지 않습니다.

### 장기 안정화 전략

- 3테이블 insert 중 일부만 성공하는 partial insert 위험이 있습니다.
- 장기적으로는 request/contact 핵심 리드 저장의 원자성 강화를 검토합니다.
- event log 실패가 핵심 리드 저장 전체를 실패시키거나 리드 데이터를 삭제하는 기본 전략이 되지 않도록 설계합니다.
- 관리자/운영 로그 구조가 안정화되면 실패 이벤트 기록 방식도 함께 정리합니다.

## 12. Phase 4.2.1 구현 메모

Phase 4.2.1에서 `app/api/consultation-requests/route.ts`를 생성했습니다.

- `POST` 요청만 구현했습니다.
- `request.json()` 파싱 실패 시 400 응답을 반환합니다.
- `validateConsultationRequestPayload(input: unknown)` 검증 실패 시 400 응답과 `code: "VALIDATION_ERROR"`, `field_errors`를 반환합니다.
- 검증 성공 시 실제 저장 없이 201 응답과 `mock_` prefix의 임시 `request_id`를 반환합니다.
- Supabase client, DB insert, 환경변수, SQL migration은 추가하지 않았습니다.

## 13. Phase 4.2.2-B 구현 메모

Phase 4.2.2-B에서 실제 DB insert 직전 준비만 진행합니다.

- `ConsultationApiBadRequestResponse` 타입을 추가하고 `ConsultationApiResponse` 유니온에 포함합니다.
- JSON 파싱 실패 응답을 400 응답과 `code: "BAD_REQUEST"` 구조로 맞춥니다.
- Supabase server client 생성 위치인 `lib/supabase/server.ts`를 준비합니다.
- `@supabase/supabase-js` 패키지를 설치합니다.
- Route Handler에서 Supabase insert 호출은 아직 하지 않습니다.

## 14. 다음 구현 Phase TODO

- `lib/consultation/repository.ts` 생성
- `saveConsultationRequest` 구현
- 환경변수 실제 추가는 로컬 `.env.local`에서만 진행
- Route Handler에서 `mapConsultationInputToStoragePayload` 연결
- Route Handler에서 repository 호출
- Supabase 저장 없는 mock 응답을 실제 저장 응답으로 전환
- mock `request_id` 제거
- 실제 `request_id` 반환
- 3테이블 insert 구현
- contacts insert 실패 시 requests 보상 삭제 구현
- events insert 실패 시 rollback 금지
- events insert 실패 시 서버 로그/운영 확인 TODO 처리
- 저장 실패 응답 타입 보정
- JSON 파싱 실패 응답에 `BAD_REQUEST` code 추가 검토 또는 구현
- 실제 API POST 테스트
- 중복 제출 방어 최소 구현 여부 결정
- `/flow` 제출 연동은 그 다음 Phase로 분리 가능

## 15. Phase 4.2.2-C 구현 메모

Phase 4.2.2-C에서 실제 DB insert 직전 보안 잠금만 진행합니다.

- `lib/supabase/server.ts`에 `server-only` 보호를 적용합니다.
- 실제 secret 없이 `.env.example`을 추가합니다.
- 실제 저장 함수 위치는 `lib/consultation/repository.ts`로 확정합니다.
- 저장 함수명은 `saveConsultationRequest`로 확정합니다.
- 이번 Phase에서는 `lib/consultation/repository.ts` 파일을 만들지 않습니다.
- Route Handler에서 Supabase insert 호출은 아직 하지 않습니다.

저장 함수 역할은 다음과 같이 확정합니다.

- `mapConsultationInputToStoragePayload` 결과를 입력으로 받습니다.
- Supabase 3테이블 insert와 보상 삭제 처리를 Route Handler 밖으로 분리합니다.
- `consultation_requests` insert를 수행합니다.
- `consultation_request_contacts` insert를 수행합니다.
- `consultation_request_events` insert를 수행합니다.
- contacts 실패 시 requests 보상 삭제를 시도합니다.
- events 실패 시 request/contact rollback을 하지 않고 서버 로그 또는 운영 확인 TODO로 처리합니다.
- 성공 시 실제 `request_id`를 반환합니다.

Route Handler는 요청 파싱, 검증, mapper 호출, repository 호출, 응답 생성에 집중합니다.

## 16. Phase 4.2.0 구현 메모

Phase 4.2.0에서 아래 순수 함수 파일을 먼저 구현합니다.

| 파일 | 구현 내용 |
| --- | --- |
| `lib/consultation/types.ts` | 상담 요청 입력, 저장 payload, 검증 결과, API 응답 타입 |
| `lib/consultation/validation.ts` | `validateConsultationRequestPayload(input: unknown)` 서버 검증 함수 |
| `lib/consultation/mappers.ts` | 문자열/전화번호/boolean/배열 정규화와 저장 payload 매핑 함수 |

이번 단계에서는 Route Handler, Supabase client, DB insert를 만들지 않습니다.

## 17. 이번 Phase 구현 금지

Phase 4.2.2-C에서는 아래를 하지 않습니다.

- 앱 코드 수정
- `/flow` 기능 변경
- Supabase 패키지 설치
- Supabase client 코드 생성
- DB 연결 코드 작성
- `.env` 또는 환경변수 파일 추가
- SQL migration 생성
- `package.json`, `package-lock.json` 변경
