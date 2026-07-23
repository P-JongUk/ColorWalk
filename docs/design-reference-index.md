# Hueday 디자인 레퍼런스 인덱스

마지막 갱신: 2026-07-23 KST
물리 위치: `D:\JongUk\Documents\ColorWalk\.design-references\`, `D:\JongUk\Documents\ColorWalk\.lazyweb\`
저장 정책: 대형 이미지·외부 캡처·렌더는 Git에 올리지 않고 D 드라이브에 보존한다. 이 추적 문서는 상태와 경로만 관리한다.

## 1. 상태 표기

- **승인**: 후속 디자인의 기준으로 사용한다.
- **기준선**: 현재 구현 또는 비교 자료이며 최종 시안이라는 뜻은 아니다.
- **후보**: 추후 승인 전까지 구현 근거로 사용하지 않는다.
- **역사적/보류**: 판단 과정 보존용이다. 사용자 재승인 없이 재개하지 않는다.
- **외부 근거**: 구조·흐름·패턴 참고용이다. 그대로 복제하지 않는다.

## 2. 현재 승인 기준

| 결정 | 상태 | D 드라이브 경로 | 사용 규칙 |
| --- | --- | --- | --- |
| 1장은 진행, 8장은 3x3·미션 완성 | 승인 | `.design-references/06-design-direction/gate-1-m1-meaning/` | B 흐름이 제품 기준. A는 비교 대안 |
| D — Chromatic Archive 외부 UI | 승인된 작업 방향 | `.design-references/06-design-direction/gate-2-four-directions/` | 홈·내비게이션·도구 UI의 모던하고 정돈된 언어를 유지 |
| Hue Canvas | 제품 승인, 시각 미승인 | `.design-references/07-found-color-content/` | 기존 Hue Studio/Charm 시안은 아이디어 자료일 뿐 최종 Canvas 디자인이 아님 |
| 원본 모바일 목업 | 기준선 | `.design-references/00-target-mockup/` | 감정적 톤과 모바일 밀도 비교에 사용. 현재 제품 계약과 충돌하면 계약 우선 |

## 3. 폴더별 역할

| 경로 | 상태 | 내용 |
| --- | --- | --- |
| `.design-references/00-target-mockup/` | 기준선 | 초기 목표 모바일 목업 |
| `.design-references/01-current-screens/` | 기준선 | 실제 구현 430x932 캡처 |
| `.design-references/02-lazyweb-story-editor/` | 외부 근거 | Story 편집 구조 |
| `.design-references/03-stickers/` | 외부 근거 | 스티커 탐색·배치 |
| `.design-references/04-template-gallery/` | 외부 근거 | 템플릿 갤러리 |
| `.design-references/05-hue-room/` | 역사적/보류 | H1/H2/H3와 가구·공간 시안. 출시 작업에 사용 금지 |
| `.design-references/06-design-direction/gate-1-m1-meaning/` | 승인/역사 혼합 | B 승인, A 비교 대안 |
| `.design-references/06-design-direction/gate-2-four-directions/` | 승인/역사 혼합 | D 선택, A/B/C 비교 대안 |
| `.design-references/07-found-color-content/` | 후보/프로토타입 | Hue Studio·Hue Charm·SVG 현실성 실험. Hue Canvas 신규 게이트 산출물도 이 아래 날짜 폴더에 저장 |
| `.lazyweb/design-research/` | 외부 근거 | 초기 웹 조사 임시본 |
| `.lazyweb/deep-design-research/` | 외부 근거 | Lazyweb·Mobbin·UI Bowl 기반 선별 조사 |

## 4. Hue Canvas 다음 산출물 구조

새 작업은 다음처럼 날짜 폴더를 만든다.

```text
.design-references/07-found-color-content/
└─ hue-canvas-gate-YYYY-MM-DD/
   ├─ 00-reference-board/
   ├─ 01-empty-and-palette/
   ├─ 02-free-canvas/
   ├─ 03-template-resize/
   ├─ 04-complete-and-export/
   ├─ 05-extreme-colors/
   ├─ prototype/
   └─ notes.md
```

`notes.md`에는 다음을 기록한다.

- 사용한 원본 3x3과 HEX
- 외부 레퍼런스 URL·제품명·접근일
- 가져온 패턴과 가져오지 않은 패턴
- 생성형 시안인지 실제 Canvas/SVG 렌더인지
- 승인/후보/폐기 상태
- 430x932 렌더 크기
- Android/PWA 검증 결과

## 5. 품질 게이트

Hue Canvas 디자인은 다음을 모두 만족하기 전 최종 승인으로 말하지 않는다.

1. 빈 상태, 색 부족, 자유 작업, 도안 크기 조절, 완성, export가 같은 언어다.
2. 유리 질감이 종이 조각처럼 평평하지 않고, 지나치게 사실적이어서 앱 UI와 분리되지 않는다.
3. 검정 그라우트가 작품을 압도하지 않는다.
4. 밝고 어둡고 저채도인 HEX에서도 타일 경계와 선택 상태가 보인다.
5. 발견 색 수량과 남은 사용량이 스트레스를 주지 않으면서 이해된다.
6. 색을 누르면 원본 3x3으로 돌아가는 기억 연결이 보인다.
7. 생성 이미지뿐 아니라 실제 Canvas 2D/SVG 프로토타입으로 같은 인상을 재현한다.
8. 430x932와 Android emulator에서 손가락 조작·하단 시트·키보드·system inset을 검증한다.
9. D 외부 UI와 따뜻한 유리 캔버스가 하나의 앱으로 느껴진다.
10. 승인 전 전체 에셋 대량 제작이나 렌더러 확장을 하지 않는다.

## 6. 보존 후보

- **Hue Charm**: 발견 색을 모듈형 파츠에 배치하고 여러 Charm을 연결하는 컬렉션. 성별·연령 편향과 작은 색 면적을 해결할 새 형태가 필요하다.
- **Hue Deck**: 완성 3x3과 원본 기억이 연결된 카드 컬렉션. 단순 수집으로 끝나지 않도록 조합·게임·공유 규칙이 필요하다.
- **Hue Bouquet**: 색을 꽃잎·줄기 단위로 모으는 감정적 컬렉션. 계절 팩이나 Story 결과물 후보로만 보존한다.
- **Hue Loom / Hue Glass**: 독립 제품보다 Hue Canvas의 재질·도안 확장 후보로 보존한다.
- **Hue Cinema / Constellation / Soundscape / Passport / Garden**: 출시 후 실사용 근거가 생길 때 다시 비교한다.
- **Hue Room**: 별도 아트 파이프라인과 운영 가치가 증명될 때만 재검토한다.

## 7. 자동 참고 계약

- 모든 제품 UI 작업 시작 시 이 문서와 `docs/design-qa-log.md`를 읽는다.
- Hue Canvas 작업은 `docs/hue-canvas-product-spec.md`를 추가로 읽는다.
- 새 레퍼런스는 D 드라이브에 저장하고 이 문서에 상태와 경로를 추가한다.
- 승인 상태를 바꾸려면 사용자 대화의 명시적 선택과 날짜를 남긴다.
- 과거 후보 이미지를 최신 승인 시안으로 재사용하지 않는다.
- 작업 완료 시 실제 430x932 캡처를 `.design-references/01-current-screens/<date>-<feature>/`에 보존한다.
