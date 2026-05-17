# Codex 이어받기 문서

이 문서는 다른 컴퓨터 또는 다른 Codex 세션에서 소견(Sogyeon) MVP 작업을 이어가기 위한 인수인계 기준입니다.

## 저장소

- GitHub: `https://github.com/fntldodo/Sogyeon`
- 로컬 예시 경로: `C:\Users\tEa\Documents\GitHub\Sogyeon`

## 먼저 읽을 문서

새 작업을 시작하기 전에 아래 문서를 반드시 확인합니다.

- `AGENTS.md`
- `docs/PRODUCT_BRIEF.md`
- `docs/SCREEN_FLOW.md`
- `docs/DATA_FIELDS.md`
- `docs/DEVELOPMENT_PLAN.md`
- `docs/CODEX_HANDOFF.md`

## 현재까지 진행 상태

- Phase 1 완료: Next.js + TypeScript + Tailwind CSS 기반 랜딩 페이지와 `/flow` 기본 화면 구조 구현
- Phase 2 완료: `/flow` 선택값 상태 관리와 임시 보고서 실제 선택값 반영 구현
- Phase 2.5 완료: 모바일 우선 반응형 UI 정리, 카드형 선택 UI, 진행 단계 표시, 버튼/입력창 터치 영역 개선, 코드 구조 일부 분리
- Phase 3 완료: 임시 보고서 이후 상담 요청서 작성 폼, 필수값 검증, 프론트 상태 기반 상담 요청서 확인/완료 화면 구현
- Phase 4.2.1 완료: 상담 요청 검증 Route Handler 골격 추가, DB 저장 없이 mock 응답 단계
- Phase 4.2.2-A 완료: Supabase 실제 저장 구현 전 서버 저장 설계 확정
- Phase 4.2.2-B 진행 중: API 에러 응답 타입과 Supabase server client 준비, DB insert 미구현
- 아직 Supabase, DB 저장, 로그인, 관리자, 채팅, 결제, 이메일/SMS, 외부 API 기능은 없습니다.

## 현재 주요 파일

- `app/page.tsx`
- `app/globals.css`
- `app/flow/page.tsx`
- `app/flow/components.tsx`
- `app/flow/form-components.tsx`
- `app/flow/constants.ts`
- `app/flow/types.ts`
- `app/flow/utils.ts`
- `app/api/consultation-requests/route.ts`
- `lib/consultation/types.ts`
- `lib/consultation/validation.ts`
- `lib/consultation/mappers.ts`
- `lib/supabase/server.ts`
- `docs/CONSULTATION_API_DESIGN.md`
- `docs/STORAGE_POLICY.md`
- `docs/SUPABASE_SCHEMA.md`

## 현재 기능 요약

- 랜딩 페이지에서 `/flow`로 진입할 수 있습니다.
- `/flow`에서 아래 선택값을 클라이언트 상태로 저장합니다.
  - `startup_type`
  - `region_sido`
  - `region_sigungu`
  - `region_area_text`
  - `store_status`
  - `store_format`
  - `pos_kiosk_type`
  - `pos_kiosk_options`
  - `cash_payment_type`
  - `sogyeon_code_choice`
  - `supply_type`
  - `freezer_support_status`
- 매장 형태는 `startup_type`에 따라 조건부 선택지를 표시합니다.
- 키오스크/POS 세부 옵션은 복수 선택할 수 있습니다.
- 임시 보고서 화면에서 실제 선택값 요약을 표시합니다.
- 임시 보고서 하단의 “상담 요청서 작성하기” CTA로 상담 요청서 작성 단계로 이동합니다.
- 상담 요청서 필드는 아래 값을 사용합니다.
  - `customer_name`
  - `phone`
  - `memo`
  - `privacy_agreed`
- 이름, 연락처, 개인정보 및 상담 전달 동의는 필수 검증 대상입니다.
- 연락처는 8자 미만이면 오류를 표시합니다.
- 검증 통과 시 “상담 요청서 확인/완료 화면”을 표시합니다.
- 완료 화면에는 고객 정보, `FlowValues` 기반 창업 조건 요약, 대표코드 선택 여부, 납품 상담 방식, 쇼케이스/냉동고 상태, 상담 요청 메모를 표시합니다.
- 완료 화면에는 아래 문구를 포함합니다.

```text
아직 실제 접수 저장 기능은 연결되지 않았습니다. 다음 단계에서 Supabase 저장 기능을 연결할 예정입니다.
```

## 중요 개발 기준

- 모바일 우선 반응형 웹사이트 MVP로 작업합니다.
- 최소 360px 폭에서 카드, 버튼, 입력창, 오류 문구, 보고서 섹션이 깨지지 않아야 합니다.
- 터치 영역은 충분히 크게 유지합니다.
- 긴 문구는 자연스럽게 줄바꿈되고 가로 스크롤이 생기지 않아야 합니다.
- PC에서는 `max-width` 컨테이너로 화면이 지나치게 넓게 퍼지지 않게 합니다.
- 핵심 문구는 아래 기준을 유지합니다.

```text
창업 조건을 정리해서 납품 상담을 제대로 받을 수 있게 도와주는 곳
```

- 고객에게 즉시 단가 비교, 확정 견적, 최저가 비교처럼 보이는 문구를 쓰지 않습니다.
- 소견 대표코드는 “창업 조건을 정리해 납품회사·지역 대리점 상담에 필요한 자료를 준비하는 방식”으로 설명합니다.
- 실제 조건과 혜택은 납품업체 상담 후 확정된다는 취지를 유지합니다.

## 금지 범위

- Supabase 연동 금지, 단 Phase 4를 명시적으로 요청받은 경우에만 진행
- DB 저장 금지, 단 Phase 4를 명시적으로 요청받은 경우에만 진행
- 로그인 구현 금지
- 관리자 페이지 구현 금지, 단 Phase 5를 명시적으로 요청받은 경우에만 진행
- 업체용 페이지 구현 금지
- 실시간 채팅 구현 금지
- 결제 구현 금지
- 이메일/SMS 발송 구현 금지
- 외부 API 호출 금지
- 인테리어/부동산 중개 기능 구현 금지
- 앱/PWA 설정 금지
- 임의 기능 확장 금지
- 타입 검사를 우회하는 범용 타입 사용 금지

## 검증 기준

변경 후 아래 검증을 수행합니다.

```bash
npm.cmd run build
git diff --check
rg "\bany\b" app lib tsconfig.json tailwind.config.ts
```

로컬 서버를 실행한 뒤 아래 응답도 확인합니다.

```bash
http://localhost:3000/
http://localhost:3000/flow
```

기능 검증 기준:

- `/flow` 기존 선택값 저장이 유지되어야 합니다.
- 임시 보고서 출력이 유지되어야 합니다.
- 상담 요청서 필수값 검증이 동작해야 합니다.
- 검증 통과 후 완료 화면에 입력값과 선택 요약이 표시되어야 합니다.

## 다른 컴퓨터에서 이어받는 절차

처음 받는 컴퓨터:

```bash
git clone https://github.com/fntldodo/Sogyeon.git
cd Sogyeon
npm install
npm.cmd run dev
```

이미 저장소가 있는 컴퓨터:

```bash
cd Sogyeon
git pull
npm install
npm.cmd run dev
```

## 다른 Codex에 붙여 넣을 하네스 프롬프트

아래 프롬프트를 다른 컴퓨터의 Codex 첫 메시지로 그대로 붙여 넣습니다.

```text
소견(Sogyeon) 반응형 웹사이트 MVP 작업을 이어서 진행해줘.

저장소:
https://github.com/fntldodo/Sogyeon

먼저 아래 문서를 반드시 읽고 현재 프로젝트 기준을 확인해줘.
- AGENTS.md
- docs/PRODUCT_BRIEF.md
- docs/SCREEN_FLOW.md
- docs/DATA_FIELDS.md
- docs/DEVELOPMENT_PLAN.md
- docs/CODEX_HANDOFF.md

현재까지 진행 상태:
- Phase 1 완료: Next.js + TypeScript + Tailwind CSS 기반 랜딩 페이지와 /flow 기본 화면 구조 구현
- Phase 2 완료: /flow 선택값 상태 관리와 임시 보고서 실제 선택값 반영 구현
- Phase 2.5 완료: 모바일 우선 반응형 UI 정리, 카드형 선택 UI, 진행 단계 표시, 버튼/입력창 터치 영역 개선, 코드 구조 일부 분리
- Phase 3 완료: 임시 보고서 이후 상담 요청서 작성 폼, 필수값 검증, 프론트 상태 기반 상담 요청서 확인/완료 화면 구현
- 아직 Supabase, DB 저장, 로그인, 관리자, 채팅, 결제, 이메일/SMS, 외부 API 기능은 없음

현재 주요 파일:
- app/page.tsx
- app/globals.css
- app/flow/page.tsx
- app/flow/components.tsx
- app/flow/form-components.tsx
- app/flow/constants.ts
- app/flow/types.ts
- app/flow/utils.ts

현재 기능 요약:
- 랜딩 페이지에서 /flow로 진입 가능
- /flow에서 아래 선택값을 클라이언트 상태로 저장
  - startup_type
  - region_sido
  - region_sigungu
  - region_area_text
  - store_status
  - store_format
  - pos_kiosk_type
  - pos_kiosk_options
  - cash_payment_type
  - sogyeon_code_choice
  - supply_type
  - freezer_support_status
- 매장 형태는 startup_type에 따라 조건부 선택지 표시
- 키오스크/POS 세부 옵션은 복수 선택 가능
- 임시 보고서 화면에서 실제 선택값 요약 표시
- 임시 보고서 하단의 “상담 요청서 작성하기” CTA로 상담 요청서 작성 단계 이동
- 상담 요청서 필드:
  - customer_name
  - phone
  - memo
  - privacy_agreed
- 이름, 연락처, 개인정보 및 상담 전달 동의는 필수 검증
- 연락처는 8자 미만이면 오류 표시
- 검증 통과 시 “상담 요청서 확인/완료 화면” 표시
- 완료 화면에는 고객 정보, FlowValues 기반 창업 조건 요약, 대표코드 선택 여부, 납품 상담 방식, 쇼케이스/냉동고 상태, 상담 요청 메모 표시
- 완료 화면에는 다음 문구 포함:
  “아직 실제 접수 저장 기능은 연결되지 않았습니다. 다음 단계에서 Supabase 저장 기능을 연결할 예정입니다.”

중요 개발 기준:
- 모바일 우선 반응형 웹사이트 MVP로 작업
- 최소 360px 폭에서 카드, 버튼, 입력창, 오류 문구, 보고서 섹션이 깨지지 않아야 함
- 터치 영역은 충분히 크게 유지
- 긴 문구는 자연스럽게 줄바꿈되고 가로 스크롤이 생기지 않아야 함
- PC에서는 max-width 컨테이너로 너무 넓게 퍼지지 않게 함
- 핵심 문구는 다음 기준 유지:
  “창업 조건을 정리해서 납품 상담을 제대로 받을 수 있게 도와주는 곳”
- 고객에게 즉시 단가 비교, 확정 견적, 최저가 비교처럼 보이는 문구 금지
- 소견 대표코드는 “창업 조건을 정리해 납품회사·지역 대리점 상담에 필요한 자료를 준비하는 방식”으로 설명
- 실제 조건과 혜택은 납품업체 상담 후 확정된다는 취지를 유지

금지:
- Supabase 연동 금지, 단 Phase 4를 명시적으로 요청받은 경우에만 진행
- DB 저장 금지, 단 Phase 4를 명시적으로 요청받은 경우에만 진행
- 로그인 구현 금지
- 관리자 페이지 구현 금지, 단 Phase 5를 명시적으로 요청받은 경우에만 진행
- 업체용 페이지 구현 금지
- 실시간 채팅 구현 금지
- 결제 구현 금지
- 이메일/SMS 발송 구현 금지
- 외부 API 호출 금지
- 인테리어/부동산 중개 기능 구현 금지
- 앱/PWA 설정 금지
- 임의 기능 확장 금지
- 타입 검사를 우회하는 범용 타입 사용 금지

검증 기준:
- 변경 후 npm.cmd run build 성공
- git diff --check 통과
- 타입 검사를 우회하는 범용 타입 검색 결과 없어야 함:
  rg "\bany\b" app lib tsconfig.json tailwind.config.ts
- http://localhost:3000/ 응답 200 확인
- http://localhost:3000/flow 응답 200 확인
- /flow 기존 선택값 저장, 임시 보고서 출력, 상담 요청서 필수값 검증, 완료 화면 요약 기능이 유지되어야 함

다음으로 추천되는 작업:
1. Phase 4 전에 Supabase 저장 스키마와 DATA_FIELDS.md 필드 매핑 확정
2. 상담 요청서 완료 화면의 내부 전달용 요약 문구 다듬기
3. 모바일 360px 기준으로 전체 플로우 QA 및 UI 미세 조정
```
