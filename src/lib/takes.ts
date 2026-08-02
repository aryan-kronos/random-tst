/**
 * takes.ts — the local tape vault.
 *
 * Every completed take is stored in IndexedDB, per this browser, on this
 * machine. Nothing syncs, nothing uploads. Keeps a rolling archive of the
 * 6 most recent takes per topic and 24 overall, so the vault stays honest
 * about disk space. In private browsing the vault may be read-only —
 * playback of the current take still works from memory.
 */

export interface StoredTake {
  id: string;
  topicId: string;
  topicTitle: string;
  seconds: number;
  mime: string;
  createdAt: number;
  blob: Blob;
}

const DB_NAME = 'verbalis-takes';
const STORE = 'takes';
const PER_TOPIC_CAP = 6;
const GLOBAL_CAP = 24;

function openDB(): Promise<IDBDatabase | null> {
  return new Promise(resolve => {
    let req: IDBOpenDBRequest;
    try {
      req = indexedDB.open(DB_NAME, 1);
    } catch {
      resolve(null);
      return;
    }
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' });
        store.createIndex('topicId', 'topicId', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
    req.onblocked = () => resolve(null);
  });
}

function tx<T>(db: IDBDatabase, mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T>): Promise<T | null> {
  return new Promise(resolve => {
    try {
      const t = db.transaction(STORE, mode);
      const rq = run(t.objectStore(STORE));
      rq.onsuccess = () => resolve(rq.result);
      rq.onerror = () => resolve(null);
      t.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

function allTakes(db: IDBDatabase): Promise<StoredTake[]> {
  return new Promise(resolve => {
    try {
      const t = db.transaction(STORE, 'readonly');
      const rq = t.objectStore(STORE).getAll() as IDBRequest<StoredTake[]>;
      rq.onsuccess = () => resolve(rq.result ?? []);
      rq.onerror = () => resolve([]);
    } catch {
      resolve([]);
    }
  });
}

async function prune(db: IDBDatabase) {
  const all = await allTakes(db);
  all.sort((a, b) => b.createdAt - a.createdAt);
  const doomed = new Set<string>();
  const perTopic = new Map<string, number>();
  all.forEach((t, i) => {
    const n = (perTopic.get(t.topicId) ?? 0) + 1;
    perTopic.set(t.topicId, n);
    if (i >= GLOBAL_CAP || n > PER_TOPIC_CAP) doomed.add(t.id);
  });
  if (doomed.size === 0) return;
  await Promise.all([...doomed].map(id => tx(db, 'readwrite', s => s.delete(id))));
}

/** Persist a finished take; silently no-ops where storage is unavailable. */
export async function saveTake(meta: Omit<StoredTake, never>): Promise<void> {
  const db = await openDB();
  if (!db) return;
  try {
    await tx(db, 'readwrite', s => s.put(meta));
    await prune(db);
  } finally {
    db.close();
  }
}

/** Newest-first takes for one topic. */
export async function listTakesForTopic(topicId: string): Promise<StoredTake[]> {
  const db = await openDB();
  if (!db) return [];
  try {
    const all = await allTakes(db);
    return all.filter(t => t.topicId === topicId).sort((a, b) => b.createdAt - a.createdAt);
  } finally {
    db.close();
  }
}

export async function deleteTake(id: string): Promise<void> {
  const db = await openDB();
  if (!db) return;
  try {
    await tx(db, 'readwrite', s => s.delete(id));
  } finally {
    db.close();
  }
}
