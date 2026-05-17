# 상담 요청 API 설계

## 1. 문서 목적

이 문서는 소견 MVP의 상담 요청 저장 기능을 실제 구현하기 전에 Route Handler와 서버 검증 구조를 설계하기 위한 문서입니다.

- 이번 Phase 4.1에서는 구현하지 않습니다.
- `app/api` 파일, `lib` 파일, Supabase client, 환경변수, SQL migration은 생성하지 않습니다.
- Phase 4.2에서 실제 저장 구현을 시작할 때 이 문서를 기준으로 파일 위치, payload 타입, 검증 함수, 응답 구조를 구현합니다.

## 2. Route Handler 위치

권장 Route Handler 경로는 다음과 같습니다.

```text
app/api/consultation-requests/route.ts
```

설계 기준은 다음과 같습니다.

- `POST` 요청으로 상담 요청 저장 payload를 받습니다.
- 클라이언트 컴포넌트는 이 Route Handler에만 제출합니다.
- Route Handler는 입력값을 신뢰하지 않고 서버 검증을 다시 수행합니다.
- 검증 실패 시 Supabase insert를 시도하지 않습니다.
- DB 에러 원문은 사용자 응답에 포함하지 않습니다.

## 3. 서버 검증 함수 위치

Phase 4.2에서 생성할 후보 파일은 다음과 같습니다.

| 후보 파일 | 역할 |
| --- | --- |
| `lib/consultation/types.ts` | 요청 payload, 정규화된 payload, 응답 타입, field error 타입을 정의합니다. |
| `lib/consultation/validation.ts` | 필수값, 길이, 선택값 허용 목록, 동의값 검증을 수행합니다. |
| `lib/consultation/mappers.ts` | 프론트의 `FlowValues`와 상담 폼 값을 DB insert payload로 변환합니다. |

역할 분리 원칙은 다음과 같습니다.

- `route.ts`는 요청 파싱, 검증 호출, insert 호출, 응답 생성에 집중합니다.
- `validation.ts`는 저장 가능 여부를 판단하고 field error를 만듭니다.
- `mappers.ts`는 UI 표시값과 DB 저장값을 분리합니다.
- `types.ts`는 `any` 없이 명확한 타입을 제공합니다.

## 4. 서버 payload 타입 설계

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

## 5. 서버 검증 규칙

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

## 6. 선택값 허용 목록

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

## 7. FlowValues → 저장 payload 변환 기준

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

## 8. 성공/실패 응답 구조

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

서버 오류 응답에는 DB 에러 원문을 포함하지 않습니다. 내부 로그에는 원인 확인이 가능하도록 남길 수 있습니다.

## 9. Supabase insert 순서 설계

실제 구현은 Phase 4.2에서 진행합니다. 현재 설계상 insert 순서는 다음과 같습니다.

1. `consultation_requests` insert
2. `consultation_request_contacts` insert
3. `consultation_request_events` insert

초기 이벤트는 `request_created`를 기록하는 방향을 우선합니다.

주의할 점은 다음과 같습니다.

- 3테이블 insert 중 일부만 성공하는 partial insert 위험이 있습니다.
- 향후 Phase에서는 transaction, RPC, 또는 보상 처리 방식을 검토합니다.
- MVP 초기에는 insert 실패 시 사용자에게 일반 오류 메시지를 제공하고 내부 운영 로그 확인 가능성을 남깁니다.
- contacts insert 실패 시 개인정보가 없는 메인 요청만 남을 수 있으므로 운영상 위험합니다. Phase 4.2에서 실패 처리 기준을 반드시 확정합니다.

## 10. Phase 4.2로 넘길 TODO

- Phase 4.2.0에서 구현한 `lib/consultation` 순수 함수와 타입을 Route Handler에 연결
- 실제 Route Handler 파일 생성
- Supabase server client 생성
- 환경변수 이름 확정
- 실제 insert 구현
- 실패/성공 UI 연결
- 중복 제출 방어 최소 구현 여부 결정
- `FlowValues`와 저장 payload 매핑 함수 작성
- partial insert 실패 처리 전략 결정

## 11. Phase 4.2.0 구현 메모

Phase 4.2.0에서 아래 순수 함수 파일을 먼저 구현합니다.

| 파일 | 구현 내용 |
| --- | --- |
| `lib/consultation/types.ts` | 상담 요청 입력, 저장 payload, 검증 결과, API 응답 타입 |
| `lib/consultation/validation.ts` | `validateConsultationRequestPayload(input: unknown)` 서버 검증 함수 |
| `lib/consultation/mappers.ts` | 문자열/전화번호/boolean/배열 정규화와 저장 payload 매핑 함수 |

이번 단계에서는 Route Handler, Supabase client, DB insert를 만들지 않습니다.

## 12. 이번 Phase 구현 금지

Phase 4.2.0에서는 아래를 하지 않습니다.

- `app/api` 파일 생성
- `lib` 파일 생성
- 앱 코드 수정
- `/flow` 기능 변경
- Supabase 패키지 설치
- DB 연결 코드 작성
- `.env` 또는 환경변수 파일 추가
- SQL migration 생성
- `package.json`, `package-lock.json` 변경
