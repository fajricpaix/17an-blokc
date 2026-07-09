import { ref, get, set, push, remove } from "firebase/database";
import { rtdb } from "./firebase";
import { Competition, Participant } from "./types";

function snapshotToList<T>(val: Record<string, Omit<T, "id">> | null): T[] {
  if (!val) return [];
  return Object.entries(val).map(
    ([id, data]) => ({ id, ...data }) as unknown as T
  );
}

export async function getCompetitions(): Promise<Competition[]> {
  const snap = await get(ref(rtdb, "competitions"));
  return snapshotToList<Competition>(snap.val());
}

export async function addCompetition(
  data: Omit<Competition, "id">
): Promise<Competition> {
  const node = push(ref(rtdb, "competitions"));
  await set(node, data);
  return { id: node.key as string, ...data };
}

export async function updateCompetition(
  id: string,
  data: Omit<Competition, "id">
): Promise<boolean> {
  const node = ref(rtdb, `competitions/${id}`);
  const snap = await get(node);
  if (!snap.exists()) return false;
  await set(node, data);
  return true;
}

export async function deleteCompetition(id: string): Promise<boolean> {
  const node = ref(rtdb, `competitions/${id}`);
  const snap = await get(node);
  if (!snap.exists()) return false;
  await remove(node);
  return true;
}

export async function getParticipants(): Promise<Participant[]> {
  const snap = await get(ref(rtdb, "participants"));
  return snapshotToList<Participant>(snap.val());
}

export async function addParticipant(
  data: Omit<Participant, "id" | "registeredAt">
): Promise<Participant> {
  const record = { ...data, registeredAt: new Date().toISOString() };
  const node = push(ref(rtdb, "participants"));
  await set(node, record);
  return { id: node.key as string, ...record };
}

export async function deleteParticipant(id: string): Promise<boolean> {
  const node = ref(rtdb, `participants/${id}`);
  const snap = await get(node);
  if (!snap.exists()) return false;
  await remove(node);
  return true;
}
