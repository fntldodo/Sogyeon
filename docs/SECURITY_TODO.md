# 보안 점검 TODO

## Next.js 보안 패치 검토

- Phase 3.6에서 `next`를 `15.0.4`에서 `15.5.18`로 업데이트했습니다.
- `npm audit` 기준으로 critical Next.js 경고는 해소되었습니다.
- 다만 `next` 내부 `postcss` 경유 moderate 경고가 남아 있습니다.
- 현재 `npm audit`의 남은 자동 수정안은 SemVer major 변경으로 표시되므로 이번 정리 작업에서는 적용하지 않습니다.

## 다음 확인 기준

- Next.js 15.x 라인에서 `postcss` 경유 경고를 해소하는 패치 릴리스가 나오는지 확인합니다.
- `npm audit fix --force`는 major 변경 가능성이 있으므로 별도 과업에서 검토합니다.
- 의존성 업데이트 후에는 `npm.cmd run build`와 `/flow` 핵심 흐름 회귀 확인을 다시 수행합니다.
