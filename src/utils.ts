type AnyObj = Record<string | number | symbol, unknown>;

export function setNestedValue<T extends AnyObj>(obj: T, path: string[], value: unknown): T {
  let cursor: AnyObj = obj;

  path.forEach((key, idx) => {
    const isLast = idx === path.length - 1;

    if (isLast) {
      // 마지막 키 → 값 대입
      cursor[key] = value;
    } else {
      // 중간 단계 → 객체가 없으면 새로 생성
      if (cursor[key] == null || typeof cursor[key] !== 'object') {
        cursor[key] = {};
      }
      cursor = cursor[key] as AnyObj;
    }
  });

  return obj;
}

export function mergeDeep<T extends AnyObj>(...sources: T[]): T {
  const isObject = (val: unknown): val is AnyObj => val !== null && typeof val === 'object' && !Array.isArray(val);

  const result: AnyObj = {};

  for (const src of sources) {
    if (!isObject(src)) continue;

    for (const [key, value] of Object.entries(src)) {
      if (isObject(value) && isObject(result[key])) {
        // 중첩 객체 → 재귀 머지
        result[key] = mergeDeep(result[key], value);
      } else {
        // 배열, 원시값 등 → 후위(source) 값으로 덮어쓰기
        result[key] = value;
      }
    }
  }

  return result as T;
}

/** ex) {label:{button:'hi'}} -> [['label.button','hi']] */
export function flatten(obj: AnyObj, prefix = ''): [string, string][] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const newKey = prefix ? `${prefix}.${k}` : k;
    return typeof v === 'object' && v !== null ? flatten(v as AnyObj, newKey) : [[newKey, String(v)]];
  });
}

export const numberToLetter = (n: number): string => (n >= 1 && n <= 26 ? String.fromCharCode(64 + n) : '');

export function getTodayYMD() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0'); // 월은 0-based라 +1
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

/** Recursively sort object keys alphabetically */
export function sortObjectKeys<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  const sorted: AnyObj = {};
  const keys = Object.keys(obj as AnyObj).sort();

  for (const key of keys) {
    sorted[key] = sortObjectKeys((obj as AnyObj)[key]);
  }

  return sorted as T;
}
