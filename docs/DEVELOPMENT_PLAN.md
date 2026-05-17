# 소견 MVP 개발 계획

## Phase 1: 정적 랜딩 페이지와 화면 플로우 구현

### 목표

- 모바일 우선 반응형 웹사이트의 기본 레이아웃을 구성합니다.
- 고객 플로우를 따라갈 수 있는 정적 화면을 구현합니다.
- 실제 데이터 저장이나 제출 기능은 구현하지 않습니다.

### 완료 기준

- 랜딩 페이지에서 서비스 포지션과 CTA가 명확히 보입니다.
- `SCREEN_FLOW.md`의 주요 단계가 화면 구조로 반영됩니다.
- 모바일 화면에서 우선적으로 읽기 쉽고 조작하기 쉬운 구조입니다.
- 데스크톱에서도 레이아웃이 깨지지 않습니다.

### 제외 범위

- 서버 연동
- 데이터 저장
- 관리자 페이지
- 실제 상담 요청 제출
- 정확한 견적 계산

## Phase 2: 선택값 상태 관리와 임시 보고서 화면 구현

### 목표

- 고객이 선택한 값을 클라이언트 상태로 관리합니다.
- 선택값을 바탕으로 임시 보고서 화면을 생성합니다.

### 완료 기준

- 창업 종류, 지역, 매장 상태, 매장 형태, 키오스크/POS, 납품 방식, 쇼케이스/냉동고 선택값이 유지됩니다.
- 임시 보고서에 고객 선택값이 요약됩니다.
- 보고서 문구가 확정 견적처럼 보이지 않습니다.

### 제외 범위

- 데이터베이스 저장
- 관리자 페이지
- 파트너 자동 매칭
- 단가 산출 로직

## Phase 3: 상담 요청서 제출 폼 구현

### 목표

- 임시 보고서를 확인한 고객이 상담 요청서를 작성할 수 있게 합니다.
- 고객명, 연락처, 메모를 입력받습니다.

### 완료 기준

- 필수 입력값 검증이 동작합니다.
- 제출 전 고객 선택값과 연락처 정보를 다시 확인할 수 있습니다.
- 제출 완료 화면 또는 메시지가 표시됩니다.

### 제외 범위

- 실제 외부 업체 전달
- 결제
- 실시간 채팅
- 업체 로그인

## Phase 3.9: favicon 404 제거

### 목표

- 브라우저 기본 요청에서 발생할 수 있는 favicon 404를 제거합니다.
- 앱 기능 변경 없이 정적 아이콘 파일 또는 메타데이터를 정리합니다.

### 완료 기준

- `/favicon.ico` 요청이 404를 반환하지 않습니다.
- 랜딩 페이지와 `/flow` 화면 동작이 유지됩니다.

### 제외 범위

- 브랜딩 리뉴얼
- 앱/PWA 설정
- 대규모 디자인 변경

## Phase 4.0: Supabase 실제 연결 전 저장 정책 확정

### 목표

- `docs/SUPABASE_SCHEMA.md`의 3테이블 구조와 RLS 방향을 실제 구현 기준으로 확정합니다.
- 개인정보 분리 저장, null 처리, enum 후보, 관리자/파트너 권한 범위를 구현 전 문서로 확정합니다.
- `docs/STORAGE_POLICY.md`에 Route Handler 우선 저장 방식, 서버 검증, 동의 버전, 에러 응답, 스팸 방어 정책을 정리합니다.

### 완료 기준

- `consultation_requests`, `consultation_request_contacts`, `consultation_request_events` 구조가 확정됩니다.
- 미선택 값 저장 방식이 `null` 또는 제한된 enum 값 중 하나로 정리됩니다.
- 상담 요청 저장은 Route Handler 방식을 우선 권장하는 것으로 정리됩니다.
- 필수값, 동의값, 에러 응답, 키 보안 원칙이 문서화됩니다.
- 관리자 페이지는 Phase 5 이후 범위로 유지됩니다.

### 제외 범위

- Supabase 패키지 설치
- DB 연결 코드 작성
- 실제 SQL migration 작성
- 관리자 페이지 구현

## Phase 4.1: 상담 요청 저장 Route Handler/server validation 설계

### 목표

- 상담 요청 저장을 위한 Next.js 서버 측 처리 방식을 설계합니다.
- 클라이언트 입력값을 서버에서 검증하는 기준을 정리합니다.
- `docs/CONSULTATION_API_DESIGN.md`에 Route Handler 위치, 서버 검증 함수 위치, payload 타입, 응답 구조, insert 순서를 문서화합니다.

### 완료 기준

- Route Handler 파일 위치와 서버 검증 함수 위치가 정리됩니다.
- 고객명, 연락처, 개인정보 동의, 상담 전달 동의 필수 검증 기준이 정리됩니다.
- 개인정보 필드와 비개인정보 필드가 각각 어느 테이블에 저장되는지 매핑됩니다.
- 성공/검증 실패/서버 오류 응답 구조가 정리됩니다.
- Supabase 3테이블 insert 순서와 partial insert 위험이 문서화됩니다.

### 제외 범위

- 실제 Supabase 저장 구현
- 관리자 페이지 구현
- 파트너 권한 구현

## Phase 4.2.0: 서버 payload 타입/검증/매퍼 구현

### 목표

- 상담 요청 저장 API 구현 전에 서버에서 사용할 payload 타입, 검증 함수, 매퍼 순수 함수를 구현합니다.
- Supabase 연결이나 Route Handler 생성 없이 `lib/consultation`에 순수 함수만 추가합니다.

### 완료 기준

- `lib/consultation/types.ts`에 상담 요청 입력, 저장 payload, 응답 타입이 정의됩니다.
- `lib/consultation/validation.ts`에 서버 검증 함수가 구현됩니다.
- `lib/consultation/mappers.ts`에 정규화와 payload 매핑 함수가 구현됩니다.
- 타입 검사를 우회하는 범용 타입 없이 `unknown` 입력을 검증 가능한 구조로 처리합니다.

### 제외 범위

- Route Handler 생성
- Supabase client 생성
- DB insert 구현
- 환경변수 추가
- SQL migration 작성

## Phase 4.2.1: Route Handler 골격 및 저장 연결 준비

### 목표

- Phase 4.2.0의 순수 함수를 사용해 상담 요청 저장 Route Handler 골격을 준비합니다.
- 실제 Supabase 저장 연결 전 요청/응답 흐름과 UI 연결 방식을 확인합니다.

### 완료 기준

- `app/api/consultation-requests/route.ts`가 생성됩니다.
- 검증 성공/실패 응답이 API 설계와 일치합니다.
- Supabase 저장 연결 전 mock/no-op 응답을 반환합니다.

### 제외 범위

- 실제 DB 저장
- Supabase client 생성
- 환경변수 추가
- 관리자 페이지 구현
- 파트너 권한 구현

## Phase 4.2.2-A: Supabase 저장 구현 전 서버 저장 설계 확정

### 목표

- 실제 Supabase 저장 구현 전에 서버 저장 설계를 문서로 확정합니다.
- 환경변수 이름, Supabase server client 위치, 3테이블 insert 순서, partial insert 실패 처리 전략을 고정합니다.
- mock 응답 단계와 실제 저장 단계의 API 응답 구조를 구분합니다.

### 완료 기준

- 환경변수 이름은 `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`로 확정됩니다.
- Supabase server client 위치는 `lib/supabase/server.ts`로 확정됩니다.
- insert 순서는 `consultation_requests` → `consultation_request_contacts` → `consultation_request_events`로 확정됩니다.
- MVP 1차 구현 전략은 contacts 실패 시 requests 보상 삭제, events 실패 시 리드 데이터 보존으로 정리됩니다.
- 장기 안정화 전략은 request/contact 핵심 리드 저장의 원자성 강화와 event log 실패 분리로 정리됩니다.
- Phase 4.2.2-B 또는 다음 구현 Phase TODO가 문서화됩니다.

### 제외 범위

- Supabase 패키지 설치
- Supabase client 코드 생성
- 실제 DB insert 구현
- 환경변수 파일 생성 또는 수정
- SQL migration 작성
- `/flow` UI 또는 상태관리 변경

## Phase 4.2.2-B: Supabase 저장 직전 서버 준비

### 목표

- 실제 DB insert 구현 전에 API 에러 응답 타입과 Supabase server client 생성 위치를 준비합니다.
- JSON 파싱 실패 응답을 `BAD_REQUEST` 구조로 맞춥니다.
- Supabase client 패키지와 서버 전용 client 생성 함수를 준비하되 Route Handler에 실제 저장 호출은 연결하지 않습니다.

### 완료 기준

- `ConsultationApiBadRequestResponse`가 API 응답 타입 유니온에 포함됩니다.
- JSON 파싱 실패 응답이 400 상태와 `code: "BAD_REQUEST"` 구조를 반환합니다.
- `lib/supabase/server.ts`에 `createSupabaseServiceClient`가 준비됩니다.
- `@supabase/supabase-js` 설치 상태가 확인됩니다.
- 3테이블 insert 구현은 다음 Phase로 유지됩니다.

### 제외 범위

- 실제 DB insert 구현
- Route Handler에서 Supabase insert 호출
- 환경변수 파일 생성 또는 수정
- SQL migration 작성
- `/flow` UI 또는 상태관리 변경

## Phase 4.2.2-C: Supabase 저장 직전 보안 잠금

### 목표

- Supabase server client에 서버 전용 보호를 적용합니다.
- 실제 secret 없이 `.env.example`을 추가합니다.
- 실제 insert 구현 전 repository 저장 함수 구조를 문서로 확정합니다.
- Phase 4.2.3에서 구현할 3테이블 insert 범위를 명확히 정리합니다.

### 완료 기준

- `lib/supabase/server.ts`에 `server-only` 보호가 적용됩니다.
- `.env.example`에 안전한 placeholder만 포함됩니다.
- 저장 함수 위치는 `lib/consultation/repository.ts`로 확정됩니다.
- 저장 함수명은 `saveConsultationRequest`로 확정됩니다.
- 실제 DB insert 구현은 다음 Phase로 유지됩니다.

### 제외 범위

- 실제 DB insert 구현
- Route Handler에서 Supabase insert 호출
- `.env` 또는 `.env.local` 생성/수정
- SQL migration 작성
- `/flow` UI 또는 상태관리 변경

## Phase 4.2.3: Route Handler Supabase 저장 연결

### 목표

- `POST /api/consultation-requests` Route Handler에 실제 Supabase 저장을 연결합니다.
- 저장 로직을 `lib/consultation/repository.ts`의 `saveConsultationRequest`로 분리합니다.
- 3테이블 insert 순서와 partial insert 실패 처리 정책을 구현합니다.

### 완료 기준

- `lib/consultation/repository.ts`가 생성됩니다.
- `saveConsultationRequest`가 `consultation_requests`, `consultation_request_contacts`, `consultation_request_events` 순서로 insert합니다.
- contacts insert 실패 시 requests 보상 삭제를 시도합니다.
- events insert 실패 시 request/contact rollback을 하지 않습니다.
- Route Handler는 mock `request_id` 대신 실제 `request_id`를 반환합니다.
- 저장 실패 시 500 응답과 `code: "SERVER_ERROR"`를 반환합니다.

### 제외 범위

- `.env` 또는 `.env.local` 생성/수정
- SQL migration 작성
- `/flow` 제출 연동
- `/flow` UI 또는 상태관리 변경

## Phase 4.2: Supabase 저장 구현

### 목표

- 상담 요청 데이터를 Supabase에 저장합니다.
- `DATA_FIELDS.md`와 `SUPABASE_SCHEMA.md`의 MVP 필드를 기준으로 저장 스키마를 구성합니다.

### 전제 조건

- Phase 4.0에서 `docs/SUPABASE_SCHEMA.md`의 Supabase 스키마/RLS 설계 초안이 실제 구현 기준으로 확정되어 있어야 합니다.
- Phase 4.1에서 저장 Route Handler와 서버 검증 기준이 설계되어 있어야 합니다.
- `docs/CONSULTATION_API_DESIGN.md`의 payload, 응답, insert 순서를 기준으로 구현합니다.
- Phase 4.2.2-A에서 확정한 환경변수 이름, server client 위치, partial insert 실패 처리 전략을 기준으로 구현합니다.
- Phase 4.2.2-C에서 확정한 repository 위치와 `saveConsultationRequest` 구조를 기준으로 구현합니다.
- Phase 4는 상담 요청 저장 구현에 집중하며, 관리자 페이지와 관리자 인증은 Phase 5 범위로 유지합니다.

### 완료 기준

- 상담 요청 제출 시 데이터가 Supabase에 저장됩니다.
- 저장 실패 시 고객에게 재시도 가능한 안내를 제공합니다.
- 민감 정보가 클라이언트에 불필요하게 노출되지 않습니다.

### 제외 범위

- 복잡한 권한 체계
- 업체별 로그인
- 자동 업체 매칭
- 결제 데이터 저장

## Phase 5: 관리자 페이지 구현

### 목표

- 상담 요청 목록을 확인하고 처리 상태를 관리할 수 있는 관리자 화면을 구현합니다.

### 완료 기준

- 상담 요청 목록을 최신순으로 확인할 수 있습니다.
- 요청 상세 정보를 확인할 수 있습니다.
- `request_status` 값을 변경할 수 있습니다.
- 기본 필터 또는 상태별 확인이 가능합니다.

### 제외 범위

- 파트너 전용 포털
- 정산 기능
- 계약서 생성
- 고급 통계 대시보드

## Phase 6: 보고서 문구와 조건별 체크리스트 고도화

### 목표

- 고객 선택 조건에 따라 더 유용한 상담 준비 체크리스트를 제공합니다.
- 업종과 매장 상태별로 안내 문구를 세분화합니다.

### 완료 기준

- 창업 종류와 매장 상태에 따라 보고서 문구가 달라집니다.
- 키오스크/POS, 납품 방식, 쇼케이스/냉동고 선택에 따라 확인 항목이 표시됩니다.
- 문구가 과장된 단가 비교 또는 확정 견적으로 오해되지 않습니다.

### 제외 범위

- 정확한 견적 자동 계산
- 업체별 가격 비교
- 인테리어 업체 연결
- 부동산 중개
- 실시간 채팅
