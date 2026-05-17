# 상담 요청 저장 정책

## 1. 문서 목적

이 문서는 소견 MVP의 상담 요청 데이터를 실제 DB에 저장하기 전에 저장 방식과 검증 기준을 확정하기 위한 정책 문서입니다.

- 이번 Phase 4.0에서는 구현하지 않습니다.
- Supabase 연결, DB 저장, 환경변수 추가, 패키지 설치, API Route 작성은 하지 않습니다.
- Phase 4.1과 Phase 4.2에서 구현할 때 이 문서를 기준으로 저장 흐름과 서버 검증을 설계합니다.
- Route Handler와 서버 검증의 상세 설계는 `docs/CONSULTATION_API_DESIGN.md`를 기준으로 합니다.

## 2. 저장 방식 결정

MVP에서는 Next.js Route Handler 방식을 우선 권장합니다.

Route Handler를 우선하는 이유는 다음과 같습니다.

- 공개 상담 폼 저장에 적합합니다.
- 서버 검증을 명확히 넣기 쉽습니다.
- 에러 응답 구조를 일관되게 관리하기 쉽습니다.
- 추후 rate limit, 운영 로그, 외부 전달 연동으로 확장하기 쉽습니다.
- 클라이언트 컴포넌트에서 Supabase service role key가 노출될 위험을 줄일 수 있습니다.

Server Action은 후순위 후보로만 남깁니다. 폼 UX와 서버 검증 구조가 명확해진 뒤 필요할 때 다시 검토합니다.

## 3. 저장 흐름 초안

```text
브라우저 상담 요청서 제출
→ Next.js Route Handler
→ 서버 검증
→ Supabase insert
→ 성공/실패 응답
→ 완료 화면 표시
```

Phase 4.2 구현 시에는 `consultation_requests`, `consultation_request_contacts`, `consultation_request_events` 저장 순서와 실패 시 롤백 또는 보정 방식을 별도로 확정합니다.

## 4. 서버 검증 정책

클라이언트에서 검증했더라도 서버에서 다시 검증합니다.

반드시 서버에서 검증할 항목은 다음과 같습니다.

- `customer_name` 필수
- `phone_number` 필수
- `privacy_agreed` 필수 `true`
- `forwarding_agreed` 필수 `true`
- `startup_type` 허용 선택값 검증
- 지역 값 길이 제한
- `store_status` 허용 선택값 검증
- `store_type` 허용 선택값 검증
- 키오스크/POS 선택값 검증
- `cash_payment_type` 허용 선택값 검증
- `supply_preference` 허용 선택값 검증
- `freezer_showcase_status` 허용 선택값 검증
- `memo` 길이 제한
- `internal_summary` 길이 제한
- 허용되지 않은 필드는 저장하지 않음

권장 길이 제한 초안은 다음과 같습니다.

| 필드 | 권장 제한 |
| --- | --- |
| `customer_name` | 50자 이하 |
| `phone_number` | 30자 이하 |
| `region_sido` | 50자 이하 |
| `region_sigungu` | 50자 이하 |
| `region_area_text` | 100자 이하 |
| `memo` | 1000자 이하 |
| `internal_summary` | 3000자 이하 |

선택값 목록은 `docs/SCREEN_FLOW.md`와 `app/flow/constants.ts`의 현재 화면 선택지를 기준으로 Phase 4.1에서 서버용 허용 목록으로 분리합니다.

## 5. 필수값/선택값 정책

상담 요청 저장 최소 필수값은 다음과 같습니다.

- `customer_name`
- `phone_number`
- `privacy_agreed`
- `forwarding_agreed`

창업 조건 선택값은 일부 미선택을 허용합니다.

- 고객이 창업 초반이라 모르는 항목이 있을 수 있으므로 모든 창업 조건을 필수로 막지 않습니다.
- 미선택 값은 “아직 선택하지 않음” 문자열로 저장하지 않고 `null`로 저장합니다.
- 화면 표시 문구와 DB 저장값을 분리합니다.
- 추후 enum을 도입하더라도 표시 문구가 아니라 안정적인 저장 코드값을 우선 검토합니다.

## 6. 개인정보/비개인정보 저장 위치

저장 위치는 3테이블 구조를 기준으로 합니다.

| 테이블 | 저장 대상 |
| --- | --- |
| `consultation_requests` | 창업 조건, 지역, 장비, 납품 선호, 상담 상태 등 비개인정보 중심 |
| `consultation_request_contacts` | 고객명, 연락처, 상담 메모, 동의값, `internal_summary` 등 개인정보 또는 민감 상담정보 |
| `consultation_request_events` | 생성, 상태 변경, 배정, 전달, 메모 등 운영 로그 |

`internal_summary`는 고객명, 연락처, 상담 메모가 포함될 수 있으므로 `consultation_request_contacts` 또는 별도 민감 저장 영역에 두는 방향을 우선합니다.

## 7. 동의 버전 관리

동의 관련 필드 후보는 다음과 같습니다.

| 필드 | 설명 |
| --- | --- |
| `privacy_consent_version` | 개인정보 수집 및 이용 동의 문구 버전 |
| `forwarding_consent_version` | 상담 전달 동의 문구 버전 |
| `consented_at` | 고객이 동의하고 제출한 일시 |
| `consent_text_snapshot` | 제출 당시 동의 문구 전문 스냅샷 |

추천 버전값 예시는 다음과 같습니다.

- `privacy-v2026-05-17`
- `forwarding-v2026-05-17`

`consent_text_snapshot`은 MVP에서는 선택 사항으로 두고, 법무/운영 필요성이 커질 때 저장 여부를 다시 검토합니다.

## 8. 에러 응답 정책

- DB 에러 원문을 사용자에게 그대로 노출하지 않습니다.
- 사용자에게는 짧고 일반적인 메시지를 제공합니다.
- 내부 로그에는 원인 확인이 가능하도록 남길 수 있습니다.
- 필수값 누락, 형식 오류, 서버 오류를 구분합니다.

에러 응답 분류 초안은 다음과 같습니다.

| 구분 | 사용자 메시지 방향 | 내부 처리 방향 |
| --- | --- | --- |
| 필수값 누락 | 필수 정보를 다시 확인해 달라고 안내 | 누락 필드 목록 기록 |
| 형식 오류 | 입력 형식을 확인해 달라고 안내 | 실패한 검증 규칙 기록 |
| 서버 오류 | 잠시 후 다시 시도해 달라고 안내 | DB 또는 서버 오류 원인 로그 기록 |

## 9. 스팸/중복 제출 방어

MVP 최소 정책은 다음과 같습니다.

- 같은 연락처의 짧은 시간 내 반복 제출 방지 검토
- 메모, 이름, 지역 필드 길이 제한
- 허용되지 않은 필드와 과도하게 긴 payload 제거
- 너무 잦은 요청 차단 방식은 Phase 4.2 이후 검토
- reCAPTCHA 또는 Turnstile은 MVP 후순위 후보로 기록

초기에는 과도한 보안 장치보다 서버 검증, 길이 제한, 로그 확인을 우선합니다.

## 10. 환경변수/키 보안 원칙

- Supabase service role key는 서버 전용입니다.
- service role key에는 절대 `NEXT_PUBLIC_` 접두사를 사용하지 않습니다.
- 클라이언트 컴포넌트에서 service role key에 접근하지 않습니다.
- `.env.local`은 Git에 포함하지 않습니다.
- `.env.example`은 실제 키 없이 환경변수 이름만 문서화할 수 있습니다.
- 이번 Phase 4.0에서는 `.env` 파일을 만들지 않습니다.

## 11. Phase 4.1/4.2로 넘길 TODO

- Route Handler 파일 위치 결정: `app/api/consultation-requests/route.ts`
- 서버 검증 함수 위치 결정: `lib/consultation/validation.ts`
- 서버 타입/매핑 후보 위치 결정: `lib/consultation/types.ts`, `lib/consultation/mappers.ts`
- Supabase client 서버 전용 생성 방식 결정
- 실제 insert 순서 결정
- 실패 시 UI 처리 방식 결정
- 성공 시 완료 화면 데이터 처리 방식 결정
- 선택값 허용 목록을 서버 검증에 재사용할 구조 결정
- 중복 제출 방어 기준 결정
