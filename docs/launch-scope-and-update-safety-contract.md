# 첫 출시 범위와 업데이트 안전 계약

마지막 갱신: 2026-07-28 KST
상태: **approved**

## 1. 첫 출시 제품 묶음

첫 출시는 “사진을 찍고 색을 모으는 개인 습관”이 완결되도록 다음을 포함한다.

1. 날씨·시간·대략 위치 문맥의 일일 Color Hunt, 3회 문맥 재추천 뒤 균등 랜덤, 첫 확정 사진 후 색 잠금
2. 1–7장의 유효한 일일 기록과 8장의 완성 3×3, 로컬 우선 저장·안전한 동기화·복구
3. Living Hue Deck의 1/3/5/8 카드 성장과 canonical mission HEX 기반 Color Volume
4. 최소 일상 미션 팩과 그 ID 기반 최대 3개 컬렉션, 이후 주간 Hueprint/Color DNA, 기존 Story 내보내기
5. 누적 완료 기반 보상과 기본 프로필·달력·기록함
6. PWA와 Android의 실제 사용자 흐름, 개인정보·RLS·저장·업데이트 안전 검증

## 2. 첫 출시에서 의도적으로 제외하는 것

- Hue Canvas의 생산 기능, 별도 탭, G2 이후 기능, 유료 Studio 기능
- Hue Room, 가구/방 꾸미기
- Hue Drop, 모든 친구 공동 촬영/Relay, 공개 피드·익명 참여·댓글/좋아요/팔로우
- 생성형 AI 사진→도안, 이미지 생성, 공개 커뮤니티 모더레이션
- 미래 기능 전용 테이블·서버·Realtime 채널·feature flag 프레임워크

제외는 기능을 포기한다는 뜻이 아니라, 개인 루프와 업데이트 안전성을 먼저 증명한다는 뜻이다. 결제·paywall·entitlement는 무료 버전의 실제 인플레이스 업데이트에서 기존 사용자 데이터 보존을 먼저 증명한 뒤 `M8M` 우선 업데이트로 진행한다. Hue Canvas는 출시 후 가능한 한 빠르게 제공할 **필수 초기 기능 업데이트**다. Hue Drop은 **첫 소셜 업데이트**이며, 이들을 한 번에 묶어 위험을 키우지 않는다. 결제 상세 계약은 `docs/post-launch-monetization-and-payment-safety.md`다.

## 3. 유지보수·아키텍처 원칙

- 기존 `posts`와 로컬 일일 기록을 중심으로 파생 가능한 화면은 파생한다. 같은 사실을 여러 테이블/캐시에 복제하지 않는다.
- 새 데이터는 버전 필드를 갖고, 로컬 migration은 copy-forward → 읽기/복구 검증 → 이전 형식 제거 순서를 따른다.
- 서버 변경은 expand/contract 원칙을 따른다. 출시 중인 구버전이 읽어야 할 필드·정책·경로를 먼저 깨지 않는다.
- 지금 필요한 수준의 에러 처리만 둔다: 네트워크 실패 재시도, 앱 종료 후 복구, 권한 거절 대안, 중복 저장 방지, owner 권한 차단. 실제 사용자 경로가 아닌 조합 폭발·가상 대규모 트래픽을 위한 일반화는 보류한다.
- 기능별 작은 도메인 helper, 기존 저장 패턴 재사용, focused test를 우선한다. 새 패키지·추상화는 기존 코드로 해결할 수 없다는 근거가 있을 때만 추가한다.

## 4. 업데이트 안전 검증

새 기능을 출시하기 전 최소한 다음의 **일반 사용자 경로**를 확인한다.

- 기존 Android 앱 위에 새 APK를 설치한 뒤 로그인·오늘 기록·로컬 draft/master·기록함·Story가 보존되는지
- 기존 PWA에서 Service Worker 업데이트 뒤 같은 기록/초안이 보존되고 재시작되는지
- 새 local schema가 이전 날짜 기록을 읽고, 실패 시 원래 레코드를 지우지 않는지
- additive DB migration 후 구버전의 기본 읽기/쓰기와 새 버전의 읽기/쓰기가 충돌하지 않는지
- 변경한 happy path 1개와 발생 가능성이 높은 복구 path 1개를 우선 검증하는지

이 계약은 출시 직전 한 번만 확인하는 것이 아니라, 저장 모델·DB·앱 버전을 바꾸는 기능마다 적용한다. 다만 UI로 만들 수 없는 입력, 존재하지 않는 사용자 조합, 대규모 부하 추정은 telemetry·보안 경계·실제 장애 신호가 생길 때까지 P2 보류로 둔다.

### M2-3 local master 수동 정리 적용 (2026-07-26)

- 정리는 자동·일괄 작업이 아니다. 닫히고 정상 동기화된 날짜의 `ready` master만 사용자가 확인 창에서 명시적으로 요청할 수 있다. 서버 Post와 preview는 정리 범위에 포함하지 않는다.
- Android QA는 versionCode/versionName을 바꾸지 않는다. baseline/candidate debug APK의 `com.colorwalk.app` package ID와 signing certificate SHA-256 fingerprint가 같은지 확인한 뒤, uninstall·data clear 없이 `adb install -r`로 검증한다. Play release version, upload key, Play App Signing은 별도 출시 gate다.
- PWA QA는 운영 beta 배포 대신 동일 localhost origin/고정 port에서 baseline build → candidate build를 순서대로 제공한다. Service Worker cache version, `registration.update()`와 controller 교체, IndexedDB/auth/draft/master/history/Story 보존을 확인한다. 실제 HTTPS beta 배포는 별도 gate다.

### Hue Canvas 업데이트 특별 계약

- Play Store 업데이트는 영구 package ID와 동일한 Play App Signing 계보를 유지한다. 재설치·앱 데이터 삭제·새 package로의 교체를 업데이트 절차로 사용하지 않는다.
- production recipe는 `version`이 있는 별도 로컬 저장 경계에 둔다. Color Hunt의 `daily-record`/`media-asset` key, pending/error 동기화 조회, local master 파일을 이동하거나 재해석하지 않는다.
- 첫 production 실행은 기존 완료 3×3에서 Palette를 다시 **파생**한다. 발견 색을 소모하거나 기존 Post를 Canvas 형식으로 변환하지 않는다.
- G1 prototype DB와 production DB는 자동 병합하지 않는다. G1은 출시 전 실험 데이터이므로, 필요한 코드만 검토해 옮기고 실제 사용자 데이터 migration 대상으로 취급하지 않는다.
- recipe 형식 변경은 `v1 읽기 유지 → v2 copy-forward → 새 recipe 읽기/렌더/저장 검증 → 충분한 출시 기간 뒤 구형 쓰기 제거` 순서를 따른다. migration 실패 시 원본 recipe와 일일 기록을 그대로 남긴다.
- 클라우드 recipe가 필요해질 때만 additive table/RLS를 추가한다. 구버전 앱은 Canvas 필드가 없어도 Color Hunt·Deck·Story를 계속 읽고 저장할 수 있어야 한다.
- 기능을 끄거나 롤백할 때 Canvas 진입점만 숨길 수 있어야 하며 recipe를 삭제하지 않는다. 범용 원격 설정 플랫폼은 만들지 않고 최소한의 기능 gate만 사용한다.
- Android 기존 사용자 데이터가 채워진 기준 버전 → Canvas 버전 인플레이스 업데이트, PWA 열린 draft 상태 → 새 Service Worker 활성화를 각각 검증한다.

## 5. 수익화 경계

무료 핵심은 Color Hunt, 3×3, Living Hue Deck, 기본 Hueprint/Story, 로컬 고화질 기록과 기본 내보내기다. 친구 참여는 훗날 Hue Drop이 추가되더라도 무료다.

출시 후 검증할 가설만 유지한다. 첫 결제 구현은 Hueday Studio 1회 구매를 기본안으로 하며, 기존 데이터와 분리된 additive entitlement·구매 복원·인플레이스 업데이트 보존을 통과해야 한다. Cloud는 실제 저장/전송 비용과 자동 복구 범위가 승인된 뒤 별도 단계로 연다.

| 가설 | 가격 가설 | 제공 가치 | 출시 전 원칙 |
| --- | --- | --- | --- |
| 선택형 크리에이티브 팩 | 1,500–3,900원 | 추가 카드/Story 테마·미션 팩 | 기본 기록/보상을 가두지 않는다. |
| Hueday Studio 1회 구매 | 출시가 14,900원, 정가 19,900원 후보 | 고급 스타일·고해상도 편집/내보내기·향후 Canvas 고급 기능 | Canvas 출시 여부와 별개이며 반응 뒤 결정한다. |
| Hueday Cloud 구독 | 월 1,500원 또는 연 9,900원, 5GB 후보 | 자동 동기화·기기 복구·고화질 재다운로드 | 로컬 기록을 인질로 삼지 않는다. |

광고, 일일 사용 제한, 발견한 무료 색의 회수, 친구 기능 유료 잠금은 첫 출시와 현 가설에서 제외한다. 가격은 실제 유지율·저장 비용·결제 의향을 본 뒤에만 확정한다.

## 6. 방향 변경 절차

Living Hue Deck을 다른 첫 출시 대표 콘텐츠로 바꾸거나, Hue Canvas를 버전 1로 앞당기거나 무기한 보류하거나, Hue Drop을 첫 출시로 앞당기거나, 공개 UGC를 열거나, 무료/유료 경계를 바꾸려면 현재 계약·근거·사용자 영향·최소 두 선택지를 텍스트로 먼저 제시하고 사용자의 명시 승인을 받는다.
