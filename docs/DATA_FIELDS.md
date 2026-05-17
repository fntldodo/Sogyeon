# 소견 MVP 데이터 필드 정의

## 저장 대상 필드

Phase 4 저장 구현에서는 `docs/SUPABASE_SCHEMA.md`의 3테이블 초안을 기준으로 상담 요청 데이터를 저장합니다.
현재 `/flow`에서 수집하는 값과 DB 저장 후보 필드의 대응 관계를 함께 정리합니다.

표시용 “아직 선택하지 않음” 문구는 DB에 그대로 저장하지 않고 `null` 또는 제한된 enum 값으로 처리하는 방향을 우선합니다.

| 화면/저장 필드 | 저장 후보 위치 | 설명 | 개인정보 | 필수값 | null 저장 권장 | 임시 보고서 | 상담 요청서 | 내부 전달용 요약문 | 관리자 운영 | KPI |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `id` | `consultation_requests.id` | 상담 요청 고유 식별자 | 아니오 | 예 | 아니오 | 아니오 | 아니오 | 아니오 | 예 | 예 |
| `created_at` | `consultation_requests.created_at` | 요청 생성 일시 | 아니오 | 예 | 아니오 | 아니오 | 아니오 | 아니오 | 예 | 예 |
| `updated_at` | `consultation_requests.updated_at` | 요청 수정 또는 상태 변경 일시 | 아니오 | 아니오 | 예 | 아니오 | 아니오 | 아니오 | 예 | 아니오 |
| `customer_name` | `consultation_request_contacts.customer_name` | 고객 이름 | 예 | 예 | 아니오 | 아니오 | 예 | 예 | 예 | 아니오 |
| `phone` | `consultation_request_contacts.phone` | 고객 연락처 | 예 | 예 | 아니오 | 아니오 | 예 | 예 | 예 | 아니오 |
| `privacy_agreed` | `consultation_request_contacts.privacy_agreed` | 개인정보 및 상담 목적 안내 동의 여부 | 예 | 예 | 아니오 | 아니오 | 예 | 아니오 | 예 | 아니오 |
| `startup_type` | `consultation_requests.startup_type` | 창업 종류 | 아니오 | 아니오 | 예 | 예 | 예 | 예 | 예 | 예 |
| `region_sido` | `consultation_requests.region_sido` | 시/도 | 아니오 | 아니오 | 예 | 예 | 예 | 예 | 예 | 예 |
| `region_sigungu` | `consultation_requests.region_sigungu` | 시/군/구 | 아니오 | 아니오 | 예 | 예 | 예 | 예 | 예 | 예 |
| `region_area_text` | `consultation_requests.region_area_text` | 동네/상권명 | 부분 가능 | 아니오 | 예 | 예 | 예 | 예 | 예 | 예 |
| `store_status` | `consultation_requests.store_status` | 매장 상태 | 아니오 | 아니오 | 예 | 예 | 예 | 예 | 예 | 예 |
| `store_format` | `consultation_requests.store_format` | 매장 형태 | 아니오 | 아니오 | 예 | 예 | 예 | 예 | 예 | 예 |
| `pos_kiosk_type` | `consultation_requests.pos_kiosk_type` | 키오스크/POS 1차 선택 | 아니오 | 아니오 | 예 | 예 | 예 | 예 | 예 | 예 |
| `pos_kiosk_options` | `consultation_requests.pos_kiosk_options` | 키오스크/POS 세부 옵션 | 아니오 | 아니오 | 예 | 예 | 예 | 예 | 예 | 아니오 |
| `cash_payment_type` | `consultation_requests.cash_payment_type` | 현금 결제 방식 | 아니오 | 아니오 | 예 | 예 | 예 | 예 | 예 | 아니오 |
| `sogyeon_code_choice` | `consultation_requests.sogyeon_code_choice` | 소견 대표코드 선택 | 아니오 | 아니오 | 예 | 예 | 예 | 예 | 예 | 예 |
| `supply_type` | `consultation_requests.supply_type` | 납품 방식 | 아니오 | 아니오 | 예 | 예 | 예 | 예 | 예 | 예 |
| `freezer_support_status` | `consultation_requests.freezer_support_status` | 쇼케이스/냉동고 지원 상태 | 아니오 | 아니오 | 예 | 예 | 예 | 예 | 예 | 예 |
| `memo` | `consultation_request_contacts.memo` | 고객 추가 메모 | 예 | 아니오 | 예 | 아니오 | 예 | 예 | 예 | 아니오 |
| `report_summary` | `consultation_requests.report_summary` | 임시 보고서 요약 문구 | 아니오 | 아니오 | 예 | 예 | 예 | 아니오 | 예 | 아니오 |
| `internal_summary` | `consultation_request_contacts.internal_summary` | 회사 또는 지역 대리점 전달용 요약문 | 예 | 아니오 | 예 | 아니오 | 아니오 | 예 | 예 | 아니오 |
| `request_status` | `consultation_requests.request_status` | 상담 요청 처리 상태 | 아니오 | 예 | 아니오 | 아니오 | 아니오 | 아니오 | 예 | 예 |
| `contacted_at` | `consultation_requests.contacted_at` | 고객 최초 연락 일시 | 아니오 | 아니오 | 예 | 아니오 | 아니오 | 아니오 | 예 | 예 |
| `sent_to_partner_at` | `consultation_requests.sent_to_partner_at` | 파트너 또는 지역 대리점 전달 일시 | 아니오 | 아니오 | 예 | 아니오 | 아니오 | 아니오 | 예 | 예 |
| `consultation_done_at` | `consultation_requests.consultation_done_at` | 상담 완료 일시 | 아니오 | 아니오 | 예 | 아니오 | 아니오 | 아니오 | 예 | 예 |
| `contracted_at` | `consultation_requests.contracted_at` | 계약 또는 납품 진행 확정 일시 | 아니오 | 아니오 | 예 | 아니오 | 아니오 | 아니오 | 예 | 예 |
| `source` | `consultation_requests.source` | 유입 출처 | 아니오 | 아니오 | 예 | 아니오 | 아니오 | 아니오 | 예 | 예 |
| `user_agent` | `consultation_requests.user_agent` | 제출 당시 브라우저 user agent | 부분 가능 | 아니오 | 예 | 아니오 | 아니오 | 아니오 | 예 | 아니오 |
| `consent_version` | `consultation_request_contacts.consent_version` | 개인정보 동의 문구 버전 | 예 | 아니오 | 예 | 아니오 | 예 | 아니오 | 예 | 아니오 |
| `event_type` | `consultation_request_events.event_type` | 상태 변경 또는 운영 이벤트 종류 | 아니오 | 예 | 아니오 | 아니오 | 아니오 | 아니오 | 예 | 예 |
| `actor_type` | `consultation_request_events.actor_type` | 이벤트 생성 주체 | 아니오 | 예 | 아니오 | 아니오 | 아니오 | 아니오 | 예 | 예 |
| `event_note` | `consultation_request_events.note` | 운영 이벤트 메모 | 부분 가능 | 아니오 | 예 | 아니오 | 아니오 | 아니오 | 예 | 아니오 |

## request_status 값

| 값 | 의미 |
| --- | --- |
| new | 신규 요청 |
| reviewing | 내부 검토 중 |
| sent_to_partner | 파트너 또는 상담 담당자에게 전달됨 |
| consultation_done | 상담 완료 |
| contracted | 계약 또는 납품 진행 확정 |
| pending | 보류 |
| cancelled | 취소 |

## 저장 원칙

- MVP에서는 상담 요청에 필요한 최소 필드만 저장합니다.
- 정확한 견적 금액 산출이나 단가 비교용 데이터는 저장 범위에 포함하지 않습니다.
- 개인정보 필드는 `consultation_request_contacts`에 분리 저장하는 방향을 우선합니다.
- 상담 분류와 KPI에 필요한 비개인정보 필드는 `consultation_requests`에 저장합니다.
- 상태 변경, 담당자 전달, 운영 메모는 `consultation_request_events`에 이벤트로 남기는 방향을 우선합니다.
- 미선택 항목은 표시용 문구 대신 `null` 또는 제한된 enum 값으로 저장합니다.
- Phase 4 저장 구현 전에는 `docs/SUPABASE_SCHEMA.md`의 스키마/RLS 설계를 기준으로 서버 측 검증과 저장 방식을 확정합니다.
