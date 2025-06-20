# i18n-sheets 📊

Google Sheets와 TypeScript 프로젝트 간의 국제화(i18n) 리소스를 동기화하는 강력한 CLI 도구입니다. 자동화된 클론, 업로드, 3-way 병합 동기화로 번역 워크플로우를 간소화하세요.

## 🌟 주요 기능

- **📥 Clone**: Google Sheets에서 로컬 파일로 번역 다운로드
- **📤 Upload**: 로컬 번역을 Google Sheets로 업로드
- **🔄 Sync**: 로컬, 원격, 앵커 버전 간의 지능적인 3-way 병합
- **⚙️ 설정 가능**: JSON, JS, MJS 설정 파일 지원
- **🎯 강제 모드**: 필요시 동기화 검사 건너뛰기
- **✨ 자동 포맷팅**: 일관된 코드 스타일을 위한 Prettier 통합
- **🛡️ 타입 안전**: 적절한 타입 정의가 있는 완전한 TypeScript 지원

## 📦 설치

```bash
npm install -g i18n-sheets
```

또는 프로젝트에서 로컬로 사용:

```bash
npm install --save-dev i18n-sheets
```

## 🚀 빠른 시작

1. **프로젝트 루트에 설정 파일 생성**:

```javascript
// i18n-sheets.config.js
export default {
  googleSheetId: 'your-google-sheet-id',
  clientEmail: 'your-service-account@project.iam.gserviceaccount.com',
  privateKey: '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n',
  outputPath: './src/i18n/resources',
  anchorOutputPath: './src/i18n/anchor',
  remoteOutputPath: './src/i18n/remote'
};
```

2. **첫 번째 동기화 실행**:

```bash
i18n-sheets sync
```

## 📋 명령어

### `clone` - Google Sheets에서 다운로드
Google Sheets에서 최신 번역을 로컬 파일로 다운로드합니다.

```bash
# 표준 클론 (먼저 sync 실행)
i18n-sheets clone

# 강제 클론 (sync 건너뛰기)
i18n-sheets clone -f
i18n-sheets clone --force
```

### `upload` - Google Sheets로 업로드
로컬 번역을 Google Sheets로 업로드합니다.

```bash
# 표준 업로드 (먼저 sync 실행)
i18n-sheets upload

# 강제 업로드 (sync 건너뛰기)
i18n-sheets upload -f
i18n-sheets upload --force
```

### `sync` - 3-way 병합
로컬, 원격, 앵커 버전 간의 지능적인 3-way 병합을 수행합니다.

```bash
i18n-sheets sync
```

## ⚙️ 설정

프로젝트 루트에 설정 파일을 생성하세요. 지원되는 형식:

- `i18n-sheets.config.js` (ES 모듈)
- `i18n-sheets.config.mjs` (ES 모듈)
- `i18n-sheets.config.json` (JSON)

### 설정 옵션

| 옵션 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `googleSheetId` | string | ✅ | Google Sheets 문서 ID |
| `clientEmail` | string | ✅ | 서비스 계정 이메일 |
| `privateKey` | string | ✅ | 서비스 계정 개인 키 |
| `outputPath` | string | ✅ | 생성된 리소스 파일 경로 |
| `anchorOutputPath` | string | ✅ | 앵커/백업 파일 경로 |
| `remoteOutputPath` | string | ✅ | 원격 스냅샷 파일 경로 |

### 설정 예시

#### JavaScript (ES 모듈)
```javascript
// i18n-sheets.config.js
export default {
  googleSheetId: '1ABC123def456GHI789jkl',
  clientEmail: 'i18n-service@my-project.iam.gserviceaccount.com',
  privateKey: process.env.GOOGLE_PRIVATE_KEY,
  outputPath: './src/i18n/resources',
  anchorOutputPath: './src/i18n/anchor', 
  remoteOutputPath: './src/i18n/remote'
};
```

#### JSON
```json
{
  "googleSheetId": "1ABC123def456GHI789jkl",
  "clientEmail": "i18n-service@my-project.iam.gserviceaccount.com",
  "privateKey": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "outputPath": "./src/i18n/resources",
  "anchorOutputPath": "./src/i18n/anchor",
  "remoteOutputPath": "./src/i18n/remote"
}
```

## 🔄 워크플로우

### 표준 워크플로우
1. **Clone**: `i18n-sheets clone` - Google Sheets에서 최신 버전 다운로드
2. **Edit**: 로컬 번역 파일 수정
3. **Upload**: `i18n-sheets upload` - 변경사항을 Google Sheets로 업로드
4. **Sync**: 자동 3-way 병합으로 충돌 해결

### 강제 모드
덮어쓰기에 확신이 있을 때 자동 동기화를 건너뛰려면 강제 플래그를 사용하세요:

```bash
# sync 건너뛰고 시트에서 직접 클론
i18n-sheets clone --force

# sync 건너뛰고 시트로 직접 업로드
i18n-sheets upload --force
```

## 📁 파일 구조

i18n-sheets 실행 후 프로젝트는 다음과 같은 구조를 갖습니다:

```
your-project/
├── i18n-sheets.config.js          # 설정 파일
├── src/i18n/
│   ├── resources/                 # 📄 현재 작업 파일 (OUTPUT_PATH)
│   │   ├── en.ts
│   │   ├── ko.ts
│   │   └── index.ts
│   ├── anchor/                    # 📌 앵커/백업 버전 (ANCHOR_OUTPUT_PATH)
│   │   ├── en_20250621.ts
│   │   └── ko_20250621.ts
│   └── remote/                    # 🌐 임시 원격 스냅샷 (REMOTE_OUTPUT_PATH)
│       ├── en_20250621.ts
│       └── ko_20250621.ts
```

### 디렉토리 용도:

- **`resources/` (OUTPUT_PATH)**: 애플리케이션에서 실제로 사용하는 번역 파일들이 저장되는 경로
- **`anchor/` (ANCHOR_OUTPUT_PATH)**: 3-way 병합 작업을 위한 비교 기준점으로 사용되는 스냅샷 버전들이 저장되는 경로
- **`remote/` (REMOTE_OUTPUT_PATH)**: 동기화 과정에서 임시로 생성되는 원격 데이터 - 동기화 완료 후 자동으로 제거됨

## 🔧 Google Sheets 설정

### 단계 1: Google Cloud 프로젝트 및 서비스 계정 생성

1. **Google Cloud 프로젝트 생성**
   - [Google Cloud Console](https://console.cloud.google.com/)로 이동
   - "새 프로젝트"를 클릭하고 프로젝트 생성

2. **Google Sheets API 활성화**
   - 프로젝트에서 "API 및 서비스" > "라이브러리"로 이동
   - "Google Sheets API"를 검색하고 활성화

3. **서비스 계정 생성**
   - "API 및 서비스" > "사용자 인증 정보"로 이동
   - "사용자 인증 정보 만들기" > "서비스 계정" 클릭
   - 서비스 계정 이름을 입력하고 "만들기" 클릭

4. **사용자 인증 정보 생성 및 다운로드**
   - 생성된 서비스 계정을 클릭
   - "키" 탭으로 이동
   - "키 추가" > "새 키 만들기" > "JSON" 선택
   - JSON 파일 다운로드

5. **JSON에서 인증 정보 추출**
   - 다운로드한 JSON 파일 열기
   - `client_email` 찾기 - 이것이 **clientEmail**입니다
   - `private_key` 찾기 - 이것이 **privateKey**입니다 (`\n` 문자 유지)

   ```json
   {
     "client_email": "your-service@project.iam.gserviceaccount.com",
     "private_key": "-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
   }
   ```

### 단계 2: Google Sheet ID 가져오기

1. **Google Sheet 열기**
2. **URL에서 Sheet ID 복사**
   - URL 형식: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`
   - `/d/`와 `/edit` 사이의 `[SHEET_ID]` 부분 복사

   예시:
   ```
   https://docs.google.com/spreadsheets/d/1ABC123def456GHI789jkl/edit#gid=0
                                      ^^^^^^^^^^^^^^^^^^^^
                                      이 부분이 googleSheetId입니다
   ```

### 단계 3: 서비스 계정과 시트 공유

1. **Google Sheet 공유**
   - Google Sheet 열기
   - "공유" 버튼 클릭
   - 서비스 계정 JSON의 `client_email` 추가
   - "편집자" 권한 부여

### 템플릿 시트 설정

**중요**: Google Spreadsheet에 **`template`**이라는 이름의 시트를 반드시 생성해야 합니다. 이 템플릿 시트는 도메인별로 리소스 시트를 생성할 때 복사해서 사용하는 원본 템플릿 역할을 합니다.

템플릿 시트 사용의 장점:
- **조건부 서식**: 헤더 영역이나 빈 셀을 강조하는 조건부 서식을 미리 설정 가능
- **일관된 구조**: 모든 도메인별 시트가 동일한 형식을 따르도록 보장
- **시각적 보조**: 가독성 향상을 위한 색상, 테두리 등의 서식 적용

### 시트 형식

Google Sheet는 다음과 같은 깊이 기반 열 구조를 따라야 합니다:

| level_1 | level_2        | level_3 | translation_key | ko | en | ... |
|---------|----------------|-------|-----------------|----|----|-----|
| common | label          | next | common.label.next | 다음 | Next | ... |
| common | label          | register | common.label.register | 등록 | Register | ... |
| game_card | title          || game_card.title | 게임 카드 | Game Card | ... |
| game_card | search_account | title | game_card.search_account.title | 계정 검색 | Search account | ... |

**열 구조:**
- **`level_1`, `level_2`, `level_3` 등**: 번역 키의 개별 깊이 레벨
- **`translation_key`**: 모든 레벨을 점으로 연결한 최종 키 (예: `common.label.next`)
- **`ko`, `en` 등**: 각 언어별 번역 값

**주요 특징:**
- 키는 깊이 레벨별로 계층적으로 구성됨
- `translation_key` 열에서 최종 결합된 키를 표시
- 언어 열에는 실제 번역 내용이 포함
- 단순한 키 구조의 경우 빈 레벨 열 허용

## 🛠️ 개발

```bash
# 의존성 설치
npm install

# 프로젝트 빌드
npm run build

# 로컬 실행
npm run dev

# 테스트 실행 (있는 경우)
npm test
```

## 📄 라이선스

MIT 라이선스 - 자세한 내용은 LICENSE 파일을 참조하세요.

## 🤝 기여하기

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 열기

## 📞 지원

- 🐛 [이슈 신고](https://github.com/your-username/i18n-sheets/issues)
- 💬 [토론](https://github.com/your-username/i18n-sheets/discussions)
- 📧 이메일: your-email@example.com

---

i18n 커뮤니티를 위해 ❤️로 만들어졌습니다
