# Chess Indie Desktop

Electron + React + TypeScript 기반의 데스크톱 체스 게임입니다.

## 실행 방법

```bash
npm install
npm run dev
```

빌드 확인:

```bash
npm run build
```

## 주요 기능

- 로컬 2인 대전
- AI 대전
- 한국어 UI/상태 문구
- 프로모션 선택(퀸/룩/비숍/나이트)
- 체크메이트/스테일메이트/반복/50수/기물 부족 무승부 판정

## AI 난이도

- `쉬움`: 빠른 응답, 초보자용 난이도
- `보통`: 균형 잡힌 응답 속도와 수읽기
- `어려움`: 응답은 느리지만 더 강한 수 선택

## 종료 상태 입력 잠금

게임이 종료 상태(`checkmate`, `stalemate`, `threefoldRepetition`, `fiftyMoveRule`, `insufficientMaterial`, `draw`)에 들어가면:

- 추가 말 선택이 차단됩니다.
- 추가 착수가 차단됩니다.
- AI 자동 착수도 차단됩니다.

즉, 종료 상태에서는 새 게임 시작 전까지 게임 진행이 고정됩니다.

## 테스트

```bash
npm run typecheck
npm run test:unit
npm run test:component
npm run test:e2e
```

## CI

GitHub Actions CI는 push/PR 시 다음을 자동 검증합니다.

- `npm run typecheck`
- `npm run test:unit`
- `npm run test:component`
- `npm run build:assets`
