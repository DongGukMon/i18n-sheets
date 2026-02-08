export type FlatEntries = Record<string, string>;

export interface ConflictEntry {
  key: string;
  localValue: string | undefined;
  remoteValue: string | undefined;
  anchorValue: string | undefined;
}

export interface MergeResult {
  merged: FlatEntries;
  conflicts: ConflictEntry[];
}

/**
 * 3-way merge for flat key-value translation entries.
 *
 * Compares each key across local, anchor (base), and remote to decide
 * whether to keep, delete, or flag a conflict.
 */
export function threeWayMerge(
  local: FlatEntries,
  anchor: FlatEntries,
  remote: FlatEntries,
): MergeResult {
  const merged: FlatEntries = {};
  const conflicts: ConflictEntry[] = [];

  const allKeys = new Set([
    ...Object.keys(local),
    ...Object.keys(anchor),
    ...Object.keys(remote),
  ]);

  for (const key of allKeys) {
    const inL = key in local;
    const inA = key in anchor;
    const inR = key in remote;

    const L = local[key];
    const A = anchor[key];
    const R = remote[key];

    if (inL && inA && inR) {
      // Cases 1-5: key exists in all three
      if (L === A && A === R) {
        // Case 1: no change
        merged[key] = L;
      } else if (L !== A && A === R) {
        // Case 2: local only changed
        merged[key] = L;
      } else if (L === A && A !== R) {
        // Case 3: remote only changed
        merged[key] = R;
      } else if (L === R) {
        // Case 4: both changed to same value
        merged[key] = L;
      } else {
        // Case 5: both changed differently → conflict, default to R
        merged[key] = R;
        conflicts.push({ key, localValue: L, remoteValue: R, anchorValue: A });
      }
    } else if (!inA) {
      // Cases 6-9: key not in anchor (new key)
      if (inL && inR) {
        if (L === R) {
          // Case 6: both added same value
          merged[key] = L;
        } else {
          // Case 7: both added differently → conflict, default to R
          merged[key] = R;
          conflicts.push({ key, localValue: L, remoteValue: R, anchorValue: undefined });
        }
      } else if (inL) {
        // Case 8: local only added
        merged[key] = L;
      } else {
        // Case 9: remote only added
        merged[key] = R;
      }
    } else {
      // Cases 10-12: key in anchor but missing from L and/or R
      if (!inL && inR) {
        if (A === R) {
          // Case 10a: local deleted, remote unchanged → delete
          // (omit from merged)
        } else {
          // Case 10b: local deleted, remote changed → conflict, keep R
          merged[key] = R;
          conflicts.push({ key, localValue: undefined, remoteValue: R, anchorValue: A });
        }
      } else if (inL && !inR) {
        if (L === A) {
          // Case 11a: remote deleted, local unchanged → delete
          // (omit from merged)
        } else {
          // Case 11b: remote deleted but local changed → conflict, keep L
          merged[key] = L;
          conflicts.push({ key, localValue: L, remoteValue: undefined, anchorValue: A });
        }
      } else {
        // Case 12: both deleted → delete
        // (omit from merged)
      }
    }
  }

  conflicts.sort((a, b) => a.key.localeCompare(b.key));

  return { merged, conflicts };
}
