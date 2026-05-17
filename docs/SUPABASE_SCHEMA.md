# Supabase 스키마/RLS 설계 초안

## 1. 목적

이 문서는 소견 MVP의 상담 요청 데이터를 저장하기 위한 Supabase 스키마 초안입니다.

- 현재 단계에서는 구현이 아니라 설계 문서입니다.
- MVP에서는 고객이 `/flow`에서 입력한 창업 조건과 상담 요청서 정보를 저장하는 것을 목표로 합니다.
- 실제 Supabase 연결, DB 생성, API Route 구현, 환경변수 추가는 Phase 4.1 이후 별도 작업으로 진행합니다.
- 상담 요청 저장 정책은 `docs/STORAGE_POLICY.md`를 기준으로 합니다.

## 2. 기본 저장 방식

MVP 1차 저장 구조는 아래 3개 테이블로 시작하는 방향을 기준으로 합니다.

| 테이블 | 역할 |
| --- | --- |
| `consultation_requests` | 상담 요청 메인 레코드입니다. 창업 조건, 지역, 장비, 납품 선호, 대표코드 요청 여부 등 상담 분류용 비개인정보를 중심으로 저장합니다. |
| `consultation_request_contacts` | 고객명, 연락처, 상세 상담 메모, 개인정보 동의값 등 개인정보 또는 민감 상담정보를 분리 저장합니다. |
| `consultation_request_events` | 상태 변경, 상담 진행, 파트너 전달, 운영 메모 등 시간순 이벤트 로그를 저장합니다. |

3테이블 구조를 우선 검토하는 이유는 다음과 같습니다.

- 개인정보 접근 범위를 상담 분류 데이터와 분리할 수 있습니다.
- 관리자 페이지 구현 전에도 Supabase dashboard에서 요청과 연락처 정보를 구분해서 확인할 수 있습니다.
- 향후 파트너 조회 권한을 만들 때 개인정보 노출 범위를 더 좁게 통제할 수 있습니다.
- 상태 변경 이력을 별도 이벤트로 남겨 운영 추적과 KPI 집계에 활용할 수 있습니다.

단, 이 문서는 실제 migration SQL이 아니며 Phase 4 구현 전에 최종 필드명, enum 전략, RLS 정책을 다시 확정합니다.

## 3. 개인정보 분리 원칙

- `customer_name`, `phone_number`, 상세 `memo`, `privacy_agreed`, `forwarding_agreed`, 동의 버전 정보는 `consultation_request_contacts`에 저장합니다.
- `consultation_requests`에는 창업 조건, 지역, 매장 상태, 키오스크/POS, 납품 방식, 쇼케이스/냉동고 상태, 대표코드 선택 여부처럼 상담 분류에 필요한 값을 저장합니다.
- `internal_summary`는 고객명, 연락처, 상담 메모가 포함될 수 있으므로 개인정보 또는 민감 상담정보로 봅니다.
- `internal_summary`를 저장해야 한다면 `consultation_request_contacts`에 두거나, 별도 민감 필드로 분리하고 운영자 또는 서버 전용 접근으로 제한합니다.
- 파트너에게 전달할 요약문은 Phase 4 이후 권한 모델이 확정되기 전까지 자동 공개하지 않습니다.
- 화면 표시용 “아직 선택하지 않음” 문구는 DB에 그대로 저장하지 않고 `null` 또는 제한된 enum 값으로 처리하는 방향을 우선합니다.

## 4. `consultation_requests` 테이블 초안

상담 요청의 메인 레코드입니다. 개인정보를 직접 저장하지 않는 것을 원칙으로 합니다.

| 구분 | 필드명 | 타입 | 필수 | 기본값 | 설명 |
| --- | --- | --- | --- | --- | --- |
| 기본 | `id` | `uuid` | 예 | generated uuid | 상담 요청 고유 식별자, primary key |
| 기본 | `created_at` | `timestamptz` | 예 | `now()` | 상담 요청 생성 일시 |
| 기본 | `updated_at` | `timestamptz` | 아니오 | 없음 | 요청 분류 정보 또는 상태 변경 일시 |
| 창업 조건 | `startup_type` | `text` | 아니오 | 없음 | 창업 유형 |
| 창업 조건 | `region_sido` | `text` | 아니오 | 없음 | 시/도 |
| 창업 조건 | `region_sigungu` | `text` | 아니오 | 없음 | 시/군/구 |
| 창업 조건 | `region_area_text` | `text` | 아니오 | 없음 | 동네/상권명 |
| 창업 조건 | `store_status` | `text` | 아니오 | 없음 | 매장 상태 |
| 창업 조건 | `store_format` | `text` | 아니오 | 없음 | 매장 형태 |
| 키오스크/POS | `pos_kiosk_type` | `text` | 아니오 | 없음 | 키오스크/POS 1차 선택 |
| 키오스크/POS | `pos_kiosk_options` | `text[]` | 아니오 | 없음 | 키오스크/POS 복수 선택 옵션 |
| 키오스크/POS | `cash_payment_type` | `text` | 아니오 | 없음 | 현금 결제 방식 |
| 대표코드/납품 | `sogyeon_code_choice` | `text` | 아니오 | 없음 | 소견 대표코드 선택 여부 |
| 대표코드/납품 | `supply_type` | `text` | 아니오 | 없음 | 납품 방식 |
| 대표코드/납품 | `freezer_support_status` | `text` | 아니오 | 없음 | 쇼케이스/냉동고 상태 |
| 보고서/요약 | `report_summary` | `text` | 아니오 | 없음 | 고객용 임시 보고서 요약, 개인정보가 들어가지 않게 제한 |
| 운영 상태 | `request_status` | `text` | 예 | `new` | 상담 요청 처리 상태 |
| 운영 상태 | `contacted_at` | `timestamptz` | 아니오 | 없음 | 고객에게 최초 연락한 일시 |
| 운영 상태 | `sent_to_partner_at` | `timestamptz` | 아니오 | 없음 | 파트너 또는 지역 대리점에 전달한 일시 |
| 운영 상태 | `consultation_done_at` | `timestamptz` | 아니오 | 없음 | 상담 완료 일시 |
| 운영 상태 | `contracted_at` | `timestamptz` | 아니오 | 없음 | 계약 또는 납품 진행 확정 일시 |
| 메타 | `source` | `text` | 아니오 | `web_mvp` | 유입 출처 |
| 메타 | `user_agent` | `text` | 아니오 | 없음 | 제출 당시 브라우저 user agent |

## 5. `consultation_request_contacts` 테이블 초안

고객 식별 정보와 민감 상담정보를 분리 저장하는 테이블입니다.

| 구분 | 필드명 | 타입 | 필수 | 기본값 | 설명 |
| --- | --- | --- | --- | --- | --- |
| 기본 | `id` | `uuid` | 예 | generated uuid | 연락처 레코드 고유 식별자, primary key |
| 기본 | `request_id` | `uuid` | 예 | 없음 | `consultation_requests.id` 참조 |
| 기본 | `created_at` | `timestamptz` | 예 | `now()` | 연락처 레코드 생성 일시 |
| 기본 | `updated_at` | `timestamptz` | 아니오 | 없음 | 연락처 또는 동의 정보 수정 일시 |
| 개인정보 | `customer_name` | `text` | 예 | 없음 | 신청자명 |
| 개인정보 | `phone_number` | `text` | 예 | 없음 | 연락처 |
| 민감 상담정보 | `memo` | `text` | 아니오 | 없음 | 고객 상담 메모 |
| 민감 상담정보 | `internal_summary` | `text` | 아니오 | 없음 | 내부 전달용 상담 요청서 요약문 |
| 동의 | `privacy_agreed` | `boolean` | 예 | `false` | 개인정보 및 상담 목적 안내 동의 여부 |
| 동의 | `forwarding_agreed` | `boolean` | 예 | `false` | 상담 전달 동의 여부 |
| 동의 | `privacy_consent_version` | `text` | 아니오 | 없음 | 개인정보 동의 문구 버전 |
| 동의 | `forwarding_consent_version` | `text` | 아니오 | 없음 | 상담 전달 동의 문구 버전 |
| 동의 | `consented_at` | `timestamptz` | 아니오 | 없음 | 고객이 동의하고 제출한 일시 |
| 동의 | `consent_text_snapshot` | `text` | 아니오 | 없음 | 제출 당시 동의 문구 전문, MVP에서는 선택 사항 |

## 6. `consultation_request_events` 테이블 초안

상담 요청 생성 이후의 상태 변경과 운영 로그를 시간순으로 남기는 테이블입니다.

| 구분 | 필드명 | 타입 | 필수 | 기본값 | 설명 |
| --- | --- | --- | --- | --- | --- |
| 기본 | `id` | `uuid` | 예 | generated uuid | 이벤트 고유 식별자, primary key |
| 기본 | `request_id` | `uuid` | 예 | 없음 | `consultation_requests.id` 참조 |
| 기본 | `created_at` | `timestamptz` | 예 | `now()` | 이벤트 생성 일시 |
| 이벤트 | `event_type` | `text` | 예 | 없음 | 이벤트 종류 |
| 이벤트 | `actor_type` | `text` | 예 | `system` | 이벤트를 만든 주체 |
| 이벤트 | `actor_id` | `uuid` | 아니오 | 없음 | 향후 관리자 또는 파트너 사용자 식별자 |
| 이벤트 | `from_status` | `text` | 아니오 | 없음 | 상태 변경 전 값 |
| 이벤트 | `to_status` | `text` | 아니오 | 없음 | 상태 변경 후 값 |
| 이벤트 | `note` | `text` | 아니오 | 없음 | 운영 메모 또는 변경 사유 |
| 이벤트 | `metadata` | `jsonb` | 아니오 | 없음 | 이벤트별 부가 정보 |

`event_type` 후보는 다음과 같습니다.

| 값 | 의미 |
| --- | --- |
| `request_created` | 상담 요청이 최초 생성됨 |
| `status_changed` | `request_status` 값이 변경됨 |
| `partner_assigned` | 파트너 또는 지역 대리점 배정이 발생함 |
| `contact_forwarded` | 연락처 또는 상담 요청 정보가 담당자에게 전달됨 |
| `memo_added` | 운영 메모가 추가됨 |

`actor_type` 후보는 다음과 같습니다.

| 값 | 의미 |
| --- | --- |
| `system` | 서버 로직 또는 자동 처리 |
| `admin` | 관리자 또는 내부 운영자 |
| `partner` | 향후 파트너 계정 |

## 7. `request_status` 값

| 값 | 의미 |
| --- | --- |
| `new` | 신규 상담 요청이 접수된 상태 |
| `reviewing` | 내부에서 요청 내용을 확인하고 있는 상태 |
| `sent_to_partner` | 파트너 또는 지역 대리점에 상담 요청을 전달한 상태 |
| `consultation_done` | 고객 상담이 완료된 상태 |
| `contracted` | 계약 또는 납품 진행이 확정된 상태 |
| `pending` | 고객 응답 대기, 정보 부족 등으로 보류된 상태 |
| `cancelled` | 고객 요청 또는 내부 판단으로 취소된 상태 |

## 8. 필수값 정책

Phase 4 저장 시 최소 필수값은 다음과 같습니다.

- `consultation_request_contacts.customer_name`
- `consultation_request_contacts.phone_number`
- `consultation_request_contacts.privacy_agreed = true`
- `consultation_request_contacts.forwarding_agreed = true`

상담 품질을 위해 가능하면 권장할 값은 다음과 같습니다.

- `consultation_requests.startup_type`
- `consultation_requests.region_sigungu` 또는 `consultation_requests.region_area_text` 중 하나
- `consultation_requests.sogyeon_code_choice`
- `consultation_requests.supply_type`
- `consultation_requests.freezer_support_status`

주의할 점은 다음과 같습니다.

- 창업 초반 고객은 아직 모르는 항목이 많으므로 모든 창업 조건을 필수로 막지 않습니다.
- 미선택 항목은 DB에 표시용 문구로 저장하지 않고 `null` 또는 제한된 enum 값으로 저장하는 방향을 우선합니다.
- 단, 고객 식별과 상담 동의를 위한 이름, 연락처, 개인정보 동의는 필수입니다.

## 9. 개인정보/보안 설계

- 클라이언트에 Supabase service role key를 절대 노출하지 않습니다.
- Phase 4 구현 시 저장은 클라이언트에서 직접 Supabase에 insert하지 않고, Next.js Route Handler를 우선 검토합니다.
- Server Action은 후순위 후보로 남깁니다.
- service role key를 사용할 경우 반드시 서버 환경변수에서만 사용합니다.
- 초기 관리자 화면이 없을 때는 Supabase dashboard에서 수동 확인합니다.
- 공개 클라이언트에서 `select`, `update`, `delete`를 허용하지 않습니다.
- `consultation_request_contacts`는 운영자 또는 서버 전용 접근으로 제한하는 방향을 기준으로 합니다.
- 파트너 권한 모델이 생기더라도 contacts 테이블의 개인정보 전체 조회는 기본 허용하지 않습니다.

## 10. RLS 정책 초안

모든 테이블은 RLS 활성화를 전제로 합니다.

MVP 초기 권장 정책은 다음과 같습니다.

- anon 사용자는 모든 테이블에 직접 `select`, `update`, `delete` 불가
- 상담 요청 생성은 향후 Route Handler 또는 서버 전용 로직을 통해 처리
- `consultation_request_contacts`는 운영자 또는 서버 전용 접근으로 제한
- `consultation_request_events`는 서버 또는 관리자만 생성/조회 가능
- 파트너는 향후 자신에게 배정된 요청만 볼 수 있도록 설계
- 관리자 권한 모델이 확정되기 전까지 관리자 페이지 구현은 보류

아래는 정책 방향을 설명하기 위한 의사 SQL 수준의 예시이며, 실제 적용 SQL로 확정하지 않습니다.

```sql
-- Pseudo SQL only
Enable RLS on consultation_requests;
Enable RLS on consultation_request_contacts;
Enable RLS on consultation_request_events;

Deny anonymous select/update/delete on consultation_requests;
Deny anonymous select/update/delete on consultation_request_contacts;
Deny anonymous select/update/delete on consultation_request_events;

Allow server-side insert into consultation_requests;
Allow server-side insert into consultation_request_contacts;
Allow server-side insert into consultation_request_events;

-- Future admin policy
Allow authenticated admin users to select/update consultation_requests;
Allow authenticated admin users to select/update consultation_request_contacts only when needed;
Allow authenticated admin users to select/insert consultation_request_events;

-- Future partner policy
Allow authenticated partners to select only assigned consultation_requests;
Deny partners direct access to consultation_request_contacts by default;
```

## 11. Phase 4 구현 전 체크리스트

- Supabase 프로젝트 생성 여부 확인
- 3테이블 구조를 그대로 적용할지, MVP 운영 비용을 고려해 일부 필드를 조정할지 확정
- 환경변수 이름은 아래로 확정
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`는 서버 전용이며 `NEXT_PUBLIC_` 접두사를 사용하지 않음
- Supabase server client 위치는 `lib/supabase/server.ts`로 확정
- `.env.local`은 Git에 커밋하지 않음
- 상담 요청 저장 Route Handler 설계
- 서버 측 검증 함수 설계
- 실제 저장 순서는 `consultation_requests` → `consultation_request_contacts` → `consultation_request_events`
- MVP 1차 partial insert 처리는 contacts 실패 시 requests 보상 삭제, events 실패 시 리드 데이터 보존을 기준으로 함
- 장기적으로는 request/contact 핵심 리드 저장의 원자성 강화를 검토하고, event log 실패가 리드 삭제로 이어지지 않게 설계
- 저장 성공/실패 UI 설계
- 개인정보 동의 문구 버전 관리
- RLS 정책 적용 확인
- Supabase dashboard 수동 운영 방법 정리
- 파트너/관리자 권한 모델 확정 전에는 관리자 페이지 구현 보류

## 12. 향후 확장 후보 테이블

아래 테이블은 이번 단계에서 구현하지 않는 설계 후보입니다.

| 테이블 | 나중에 필요한 이유 |
| --- | --- |
| `partners` | 납품 회사 또는 지역 대리점 정보를 별도로 관리하기 위해 필요합니다. |
| `partner_regions` | 파트너별 담당 지역을 관리하고 지역 기반 상담 전달을 준비하기 위해 필요합니다. |
| `partner_assignments` | 상담 요청을 특정 파트너에게 배정하고 파트너별 조회 범위를 제한하기 위해 필요합니다. |
| `consultation_quotes` | 향후 실제 견적 또는 상담 제안 정보를 별도로 저장해야 할 때 필요합니다. |

## 13. 구현 금지 사항

이번 문서 보정 작업에서는 아래를 하지 않습니다.

- Supabase 패키지 설치
- Supabase 프로젝트 연결
- `.env` 파일 생성
- 실제 SQL migration 파일 생성
- API Route 구현
- DB 저장 구현
- 관리자 페이지 구현
- 로그인 구현
- RLS 실제 SQL 적용
- 외부 API 호출
