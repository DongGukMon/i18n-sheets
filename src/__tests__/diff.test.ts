import { describe, it, expect } from 'vitest';
import { threeWayMerge, type FlatEntries } from '../diff';

describe('threeWayMerge', () => {
  // Helper to create entries
  const entries = (obj: Record<string, string>): FlatEntries => obj;

  describe('all three exist (cases 1-5)', () => {
    it('case 1: no change - all values identical', () => {
      const local = entries({ 'a.b': 'hello' });
      const anchor = entries({ 'a.b': 'hello' });
      const remote = entries({ 'a.b': 'hello' });

      const result = threeWayMerge(local, anchor, remote);

      expect(result.merged).toEqual({ 'a.b': 'hello' });
      expect(result.conflicts).toEqual([]);
    });

    it('case 2: local only changed', () => {
      const local = entries({ 'a.b': 'updated' });
      const anchor = entries({ 'a.b': 'original' });
      const remote = entries({ 'a.b': 'original' });

      const result = threeWayMerge(local, anchor, remote);

      expect(result.merged).toEqual({ 'a.b': 'updated' });
      expect(result.conflicts).toEqual([]);
    });

    it('case 3: remote only changed', () => {
      const local = entries({ 'a.b': 'original' });
      const anchor = entries({ 'a.b': 'original' });
      const remote = entries({ 'a.b': 'updated' });

      const result = threeWayMerge(local, anchor, remote);

      expect(result.merged).toEqual({ 'a.b': 'updated' });
      expect(result.conflicts).toEqual([]);
    });

    it('case 4: both changed to same value', () => {
      const local = entries({ 'a.b': 'same-new' });
      const anchor = entries({ 'a.b': 'original' });
      const remote = entries({ 'a.b': 'same-new' });

      const result = threeWayMerge(local, anchor, remote);

      expect(result.merged).toEqual({ 'a.b': 'same-new' });
      expect(result.conflicts).toEqual([]);
    });

    it('case 5: both changed differently - conflict, defaults to remote', () => {
      const local = entries({ 'a.b': 'local-change' });
      const anchor = entries({ 'a.b': 'original' });
      const remote = entries({ 'a.b': 'remote-change' });

      const result = threeWayMerge(local, anchor, remote);

      expect(result.merged).toEqual({ 'a.b': 'remote-change' });
      expect(result.conflicts).toEqual([
        {
          key: 'a.b',
          localValue: 'local-change',
          remoteValue: 'remote-change',
          anchorValue: 'original',
        },
      ]);
    });
  });

  describe('new key - not in anchor (cases 6-9)', () => {
    it('case 6: both added same value', () => {
      const local = entries({ 'new.key': 'value' });
      const anchor = entries({});
      const remote = entries({ 'new.key': 'value' });

      const result = threeWayMerge(local, anchor, remote);

      expect(result.merged).toEqual({ 'new.key': 'value' });
      expect(result.conflicts).toEqual([]);
    });

    it('case 7: both added different values - conflict, defaults to remote', () => {
      const local = entries({ 'new.key': 'local-val' });
      const anchor = entries({});
      const remote = entries({ 'new.key': 'remote-val' });

      const result = threeWayMerge(local, anchor, remote);

      expect(result.merged).toEqual({ 'new.key': 'remote-val' });
      expect(result.conflicts).toEqual([
        {
          key: 'new.key',
          localValue: 'local-val',
          remoteValue: 'remote-val',
          anchorValue: undefined,
        },
      ]);
    });

    it('case 8: local only added', () => {
      const local = entries({ 'new.key': 'local-only' });
      const anchor = entries({});
      const remote = entries({});

      const result = threeWayMerge(local, anchor, remote);

      expect(result.merged).toEqual({ 'new.key': 'local-only' });
      expect(result.conflicts).toEqual([]);
    });

    it('case 9: remote only added', () => {
      const local = entries({});
      const anchor = entries({});
      const remote = entries({ 'new.key': 'remote-only' });

      const result = threeWayMerge(local, anchor, remote);

      expect(result.merged).toEqual({ 'new.key': 'remote-only' });
      expect(result.conflicts).toEqual([]);
    });
  });

  describe('key deleted (cases 10-12)', () => {
    it('case 10a: local deleted, remote unchanged - delete', () => {
      const local = entries({});
      const anchor = entries({ 'old.key': 'value' });
      const remote = entries({ 'old.key': 'value' });

      const result = threeWayMerge(local, anchor, remote);

      expect(result.merged).toEqual({});
      expect(result.conflicts).toEqual([]);
    });

    it('case 10b: local deleted, remote changed - conflict, keeps remote', () => {
      const local = entries({});
      const anchor = entries({ 'old.key': 'original' });
      const remote = entries({ 'old.key': 'updated' });

      const result = threeWayMerge(local, anchor, remote);

      expect(result.merged).toEqual({ 'old.key': 'updated' });
      expect(result.conflicts).toEqual([
        {
          key: 'old.key',
          localValue: undefined,
          remoteValue: 'updated',
          anchorValue: 'original',
        },
      ]);
    });

    it('case 11a: remote deleted, local unchanged - delete', () => {
      const local = entries({ 'old.key': 'value' });
      const anchor = entries({ 'old.key': 'value' });
      const remote = entries({});

      const result = threeWayMerge(local, anchor, remote);

      expect(result.merged).toEqual({});
      expect(result.conflicts).toEqual([]);
    });

    it('case 11b: remote deleted, local changed - conflict, keeps local', () => {
      const local = entries({ 'old.key': 'local-update' });
      const anchor = entries({ 'old.key': 'original' });
      const remote = entries({});

      const result = threeWayMerge(local, anchor, remote);

      expect(result.merged).toEqual({ 'old.key': 'local-update' });
      expect(result.conflicts).toEqual([
        {
          key: 'old.key',
          localValue: 'local-update',
          remoteValue: undefined,
          anchorValue: 'original',
        },
      ]);
    });

    it('case 12: both deleted - delete', () => {
      const local = entries({});
      const anchor = entries({ 'old.key': 'value' });
      const remote = entries({});

      const result = threeWayMerge(local, anchor, remote);

      expect(result.merged).toEqual({});
      expect(result.conflicts).toEqual([]);
    });
  });

  describe('multi-key scenarios', () => {
    it('handles multiple keys with mixed operations', () => {
      const local = entries({
        'unchanged': 'same',
        'local.edit': 'new-local',
        'local.add': 'added-by-local',
        'conflict.key': 'local-version',
      });
      const anchor = entries({
        'unchanged': 'same',
        'local.edit': 'original',
        'remote.edit': 'original',
        'deleted.key': 'gone',
        'conflict.key': 'original',
      });
      const remote = entries({
        'unchanged': 'same',
        'remote.edit': 'new-remote',
        'remote.add': 'added-by-remote',
        'conflict.key': 'remote-version',
      });

      const result = threeWayMerge(local, anchor, remote);

      expect(result.merged).toEqual({
        'unchanged': 'same',
        'local.edit': 'new-local',       // case 11b: remote deleted, local changed → conflict, keeps L
        'remote.edit': 'new-remote',     // case 10b: local deleted, remote changed → conflict, keeps R
        'local.add': 'added-by-local',   // case 8: local added
        'remote.add': 'added-by-remote', // case 9: remote added
        'conflict.key': 'remote-version', // case 5: conflict, defaults to R
        // deleted.key: case 12 (both deleted - local didn't have it, remote didn't have it)
      });

      expect(result.conflicts).toHaveLength(3);
      expect(result.conflicts.map(c => c.key)).toEqual(['conflict.key', 'local.edit', 'remote.edit']);
    });

    it('handles empty string values correctly', () => {
      const local = entries({ 'key': '' });
      const anchor = entries({ 'key': 'was-something' });
      const remote = entries({ 'key': 'was-something' });

      const result = threeWayMerge(local, anchor, remote);

      // Local changed value to empty string - should keep local's empty string
      expect(result.merged).toEqual({ 'key': '' });
      expect(result.conflicts).toEqual([]);
    });

    it('sorts conflicts by key', () => {
      const local = entries({ 'z.key': 'l', 'a.key': 'l', 'm.key': 'l' });
      const anchor = entries({ 'z.key': 'o', 'a.key': 'o', 'm.key': 'o' });
      const remote = entries({ 'z.key': 'r', 'a.key': 'r', 'm.key': 'r' });

      const result = threeWayMerge(local, anchor, remote);

      expect(result.conflicts.map((c) => c.key)).toEqual(['a.key', 'm.key', 'z.key']);
    });
  });

  describe('edge cases', () => {
    it('all sources empty', () => {
      const result = threeWayMerge({}, {}, {});
      expect(result.merged).toEqual({});
      expect(result.conflicts).toEqual([]);
    });

    it('first sync - no anchor, no local', () => {
      const local = entries({});
      const anchor = entries({});
      const remote = entries({
        'common.label.next': 'Next',
        'common.label.prev': 'Previous',
      });

      const result = threeWayMerge(local, anchor, remote);

      expect(result.merged).toEqual({
        'common.label.next': 'Next',
        'common.label.prev': 'Previous',
      });
      expect(result.conflicts).toEqual([]);
    });

    it('no anchor (migration scenario) - local and remote identical', () => {
      const data = entries({
        'common.label.next': 'Next',
        'auth.login.title': 'Login',
      });

      const result = threeWayMerge(data, {}, data);

      expect(result.merged).toEqual(data);
      expect(result.conflicts).toEqual([]);
    });
  });
});
