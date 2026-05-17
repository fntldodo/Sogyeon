# Supabase 스키마/RLS 설계 초안

## 1. 목적

이 문서는 소견 MVP의 상담 요청 데이터를 저장하기 위한 Supabase 스키마 초안입니다.

- 현재 단계에서는 구현이 아니라 설계 문서입니다.
- MVP에서는 고객이 `/flow`에서 입력한 창업 조건과 상담 요청서 정보를 저장하는 것을 목표로 합니다.
- 실제 Supabase 연결, DB 생성, API Route 구현, 환경변수 추가는 Phase 4에서 별도 작업으로 진행합니다.

## 2. 기본 저장 방식

MVP 1차 저장 테이블은 `consultation_requests` 하나로 시작합니다.

이유는 다음과 같습니다.

- 초기에는 상담 요청 건수가 많지 않을 것으로 예상합니다.
- 관리자 페이지가 준비되기 전까지 Supabase dashboard에서 수동 확인이 가능해야 합니다.
- 너무 이른 테이블 분리는 개발 복잡도를 높입니다.

다만 향후 `admin_users`, `partners`, `consultation_status_logs`, `attachments` 등으로 확장할 수 있도록 필드와 상태값은 확장 여지를 남깁니다.

## 3. `consultation_requests` 테이블 초안

| 구분 | 필드명 | 타입 | 필수 | 기본값 | 설명 |
| --- | --- | --- | --- | --- | --- |
| 기본 | `id` | `uuid` | 예 | generated uuid | 상담 요청 고유 식별자, primary key |
| 기본 | `created_at` | `timestamptz` | 예 | `now()` | 상담 요청 생성 일시 |
| 기본 | `updated_at` | `timestamptz` | 아니오 | 없음 | 관리자 수정 또는 상태 변경 일시 |
| 기본 | `customer_name` | `text` | 예 | 없음 | 신청자명 |
| 기본 | `phone` | `text` | 예 | 없음 | 연락처 |
| 기본 | `privacy_agreed` | `boolean` | 예 | `false` | 개인정보 및 상담 목적 안내 동의 여부 |
| 기본 | `memo` | `text` | 아니오 | 없음 | 고객 상담 메모 |
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
| 보고서/요약 | `report_summary` | `text` | 아니오 | 없음 | 고객용 임시 보고서 요약 |
| 보고서/요약 | `internal_summary` | `text` | 아니오 | 없음 | 내부 전달용 상담 요청서 요약문 |
| 운영 상태 | `request_status` | `text` | 예 | `new` | 상담 요청 처리 상태 |
| 운영 상태 | `admin_note` | `text` | 아니오 | 없음 | 관리자 내부 메모 |
| 운영 상태 | `contacted_at` | `timestamptz` | 아니오 | 없음 | 고객에게 최초 연락한 일시 |
| 운영 상태 | `sent_to_partner_at` | `timestamptz` | 아니오 | 없음 | 파트너 또는 지역 대리점에 전달한 일시 |
| 운영 상태 | `consultation_done_at` | `timestamptz` | 아니오 | 없음 | 상담 완료 일시 |
| 운영 상태 | `contracted_at` | `timestamptz` | 아니오 | 없음 | 계약 또는 납품 진행 확정 일시 |
| 메타 | `source` | `text` | 아니오 | `web_mvp` | 유입 출처 |
| 메타 | `user_agent` | `text` | 아니오 | 없음 | 제출 당시 브라우저 user agent |
| 메타 | `consent_version` | `text` | 아니오 | 없음 | 개인정보 동의 문구 버전 |

## 4. `request_status` 값

| 값 | 의미 |
| --- | --- |
| `new` | 신규 상담 요청이 접수된 상태 |
| `reviewing` | 내부에서 요청 내용을 확인하고 있는 상태 |
| `sent_to_partner` | 파트너 또는 지역 대리점에 상담 요청을 전달한 상태 |
| `consultation_done` | 고객 상담이 완료된 상태 |
| `contracted` | 계약 또는 납품 진행이 확정된 상태 |
| `pending` | 고객 응답 대기, 정보 부족 등으로 보류된 상태 |
| `cancelled` | 고객 요청 또는 내부 판단으로 취소된 상태 |

## 5. 필수값 정책

Phase 4 저장 시 최소 필수값은 다음과 같습니다.

- `customer_name`
- `phone`
- `privacy_agreed = true`

상담 품질을 위해 가능하면 권장할 값은 다음과 같습니다.

- `startup_type`
- `region_sigungu` 또는 `region_area_text` 중 하나
- `sogyeon_code_choice`
- `supply_type`
- `freezer_support_status`

주의할 점은 다음과 같습니다.

- 창업 초반 고객은 아직 모르는 항목이 많으므로 모든 창업 조건을 필수로 막지 않습니다.
- 미선택 항목은 “아직 선택하지 않음” 또는 `null`로 저장할 수 있습니다.
- 단, 고객 식별과 상담 동의를 위한 이름, 연락처, 개인정보 동의는 필수입니다.

## 6. 개인정보/보안 설계

- `customer_name`, `phone`, `memo`, `internal_summary`는 개인정보 또는 민감 상담정보가 포함될 수 있습니다.
- 클라이언트에 Supabase service role key를 절대 노출하지 않습니다.
- Phase 4 구현 시 저장은 클라이언트에서 직접 Supabase에 insert하지 않고, Next.js 서버 측 Route Handler 또는 Server Action을 통해 처리하는 방향을 우선 검토합니다.
- service role key를 사용할 경우 반드시 서버 환경변수에서만 사용합니다.
- 초기 관리자 화면이 없을 때는 Supabase dashboard에서 수동 확인합니다.
- 공개 클라이언트에서 `select`, `update`, `delete`를 허용하지 않습니다.

## 7. RLS 정책 초안

RLS는 활성화합니다.

MVP 초기 권장 정책은 다음과 같습니다.

- public anonymous 직접 `select` 금지
- public anonymous 직접 `update` 금지
- public anonymous 직접 `delete` 금지
- `insert`는 서버 경유를 우선합니다.
- 만약 임시로 anon insert를 허용해야 한다면 insert 전용 정책만 제한적으로 허용하고 `select`, `update`, `delete`는 금지합니다.
- 관리자 조회/수정은 추후 Supabase Auth 기반 admin role 또는 별도 관리자 인증 설계 후 허용합니다.

아래는 정책 방향을 설명하기 위한 의사 SQL 수준의 예시이며, 실제 적용 SQL로 확정하지 않습니다.

```sql
-- Pseudo SQL only
Enable RLS on consultation_requests;

Deny public select on consultation_requests;
Deny public update on consultation_requests;
Deny public delete on consultation_requests;

Allow server-side insert only;

-- Future
Allow authenticated admin users to select consultation_requests;
Allow authenticated admin users to update request_status and admin fields;
```

## 8. Phase 4 구현 전 체크리스트

- Supabase 프로젝트 생성 여부 확인
- 환경변수 이름 확정
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY` 또는 서버 전용 key
- `.env.local`은 Git에 커밋하지 않음
- 상담 요청 저장 Route Handler 설계
- 서버 측 검증 함수 설계
- 저장 성공/실패 UI 설계
- 개인정보 동의 문구 버전 관리
- RLS 정책 적용 확인
- Supabase dashboard 수동 운영 방법 정리

## 9. 향후 확장 테이블

| 테이블 | 나중에 필요한 이유 |
| --- | --- |
| `partners` | 납품 회사 또는 지역 대리점 정보를 별도로 관리하기 위해 필요합니다. |
| `partner_regions` | 파트너별 담당 지역을 관리하고 지역 기반 상담 전달을 준비하기 위해 필요합니다. |
| `consultation_status_logs` | 상담 요청 상태 변경 이력을 남기기 위해 필요합니다. |
| `admin_users` | 관리자 권한과 접근 범위를 관리하기 위해 필요합니다. |
| `consultation_assignments` | 상담 요청을 특정 담당자 또는 파트너에게 배정하기 위해 필요합니다. |
| `attachments` | 사업자등록증, 매장 사진 등 첨부 자료가 필요해질 때 분리 저장하기 위해 필요합니다. |
| `audit_logs` | 개인정보 접근과 주요 운영 변경 이력을 추적하기 위해 필요합니다. |

## 10. 구현 금지 사항

이번 Phase 3.8에서는 아래를 하지 않습니다.

- Supabase 패키지 설치
- Supabase 프로젝트 연결
- `.env` 파일 생성
- API Route 구현
- DB 저장 구현
- 관리자 페이지 구현
- 로그인 구현
- RLS 실제 SQL 적용
- 외부 API 호출
