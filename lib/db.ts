import {
  Competition,
  KategoriAntarBlok,
  Participant,
  Perwakilan,
  Rundown,
  Sponsor,
} from "./types";

// Semua akses data berjalan di server (Server Component / Route Handler),
// jadi pakai REST API Realtime Database via fetch, bukan SDK client
// (SDK client membuka koneksi websocket di Node yang memicu warning
// deprecation url.parse dan tidak cocok untuk dipakai server-side).
const DATABASE_URL = "https://sl-blokc-default-rtdb.firebaseio.com";

async function dbFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${DATABASE_URL}/${path}.json`, {
    ...init,
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Firebase REST error ${res.status} on ${path}`);
  }
  return res.json();
}

function snapshotToList<T>(val: Record<string, Omit<T, "id">> | null): T[] {
  if (!val) return [];
  return Object.entries(val).map(
    ([id, data]) => ({ id, ...data }) as unknown as T
  );
}

export async function getCompetitions(): Promise<Competition[]> {
  const val = await dbFetch<Record<string, Omit<Competition, "id">> | null>(
    "competitions"
  );
  return snapshotToList<Competition>(val);
}

export async function addCompetition(
  data: Omit<Competition, "id">
): Promise<Competition> {
  const { name } = await dbFetch<{ name: string }>("competitions", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return { id: name, ...data };
}

export async function updateCompetition(
  id: string,
  data: Omit<Competition, "id">
): Promise<boolean> {
  const existing = await dbFetch<Omit<Competition, "id"> | null>(
    `competitions/${id}`
  );
  if (!existing) return false;
  await dbFetch(`competitions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return true;
}

export async function deleteCompetition(id: string): Promise<boolean> {
  const existing = await dbFetch<Omit<Competition, "id"> | null>(
    `competitions/${id}`
  );
  if (!existing) return false;
  await dbFetch(`competitions/${id}`, { method: "DELETE" });
  return true;
}

export async function getParticipants(): Promise<Participant[]> {
  const val = await dbFetch<Record<string, Omit<Participant, "id">> | null>(
    "participants"
  );
  return snapshotToList<Participant>(val);
}

export async function addParticipant(
  data: Omit<Participant, "id" | "registeredAt">
): Promise<Participant> {
  const record = { ...data, registeredAt: new Date().toISOString() };
  const { name } = await dbFetch<{ name: string }>("participants", {
    method: "POST",
    body: JSON.stringify(record),
  });
  return { id: name, ...record };
}

export async function deleteParticipant(id: string): Promise<boolean> {
  const existing = await dbFetch<Omit<Participant, "id"> | null>(
    `participants/${id}`
  );
  if (!existing) return false;
  await dbFetch(`participants/${id}`, { method: "DELETE" });
  return true;
}

export async function getKategoriAntarBlok(): Promise<KategoriAntarBlok[]> {
  const val = await dbFetch<Record<
    string,
    Omit<KategoriAntarBlok, "id">
  > | null>("kategoriAntarBlok");
  return snapshotToList<KategoriAntarBlok>(val);
}

export async function addKategoriAntarBlok(
  data: Omit<KategoriAntarBlok, "id">
): Promise<KategoriAntarBlok> {
  const { name } = await dbFetch<{ name: string }>("kategoriAntarBlok", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return { id: name, ...data };
}

export async function updateKategoriAntarBlok(
  id: string,
  data: {
    name?: string;
    icon?: string;
    tanggalMulai?: string | null;
    tanggalSelesai?: string | null;
    locked?: boolean;
  }
): Promise<boolean> {
  const existing = await dbFetch<Omit<KategoriAntarBlok, "id"> | null>(
    `kategoriAntarBlok/${id}`
  );
  if (!existing) return false;
  await dbFetch(`kategoriAntarBlok/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return true;
}

export async function deleteKategoriAntarBlok(id: string): Promise<boolean> {
  const existing = await dbFetch<Omit<KategoriAntarBlok, "id"> | null>(
    `kategoriAntarBlok/${id}`
  );
  if (!existing) return false;
  await dbFetch(`kategoriAntarBlok/${id}`, { method: "DELETE" });
  return true;
}

export async function getPerwakilan(): Promise<Perwakilan[]> {
  const val = await dbFetch<Record<string, Omit<Perwakilan, "id">> | null>(
    "perwakilan"
  );
  // Data lama (sebelum satu peserta bisa ikut > 1 cabor) masih pakai field
  // "category" tunggal, bukan "categories" array. Normalisasi di sini.
  return snapshotToList<Perwakilan>(val).map((p) => {
    const legacy = p as Perwakilan & { category?: string };
    if (!Array.isArray(legacy.categories)) {
      return { ...legacy, categories: legacy.category ? [legacy.category] : [] };
    }
    return legacy;
  });
}

export async function addPerwakilan(
  data: Omit<Perwakilan, "id" | "registeredAt">
): Promise<Perwakilan> {
  const record = { ...data, registeredAt: new Date().toISOString() };
  const { name } = await dbFetch<{ name: string }>("perwakilan", {
    method: "POST",
    body: JSON.stringify(record),
  });
  return { id: name, ...record };
}

export async function updatePerwakilan(
  id: string,
  data: { categories: string[]; kelas: string | null }
): Promise<boolean> {
  const existing = await dbFetch<Omit<Perwakilan, "id"> | null>(
    `perwakilan/${id}`
  );
  if (!existing) return false;
  await dbFetch(`perwakilan/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return true;
}

export async function deletePerwakilan(id: string): Promise<boolean> {
  const existing = await dbFetch<Omit<Perwakilan, "id"> | null>(
    `perwakilan/${id}`
  );
  if (!existing) return false;
  await dbFetch(`perwakilan/${id}`, { method: "DELETE" });
  return true;
}

export async function getSponsors(): Promise<Sponsor[]> {
  const val = await dbFetch<Record<string, Omit<Sponsor, "id">> | null>(
    "sponsors"
  );
  return snapshotToList<Sponsor>(val).sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt)
  );
}

export async function addSponsor(
  data: Omit<Sponsor, "id">
): Promise<Sponsor> {
  const { name } = await dbFetch<{ name: string }>("sponsors", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return { id: name, ...data };
}

export async function deleteSponsor(id: string): Promise<Sponsor | null> {
  const existing = await dbFetch<Omit<Sponsor, "id"> | null>(
    `sponsors/${id}`
  );
  if (!existing) return null;
  await dbFetch(`sponsors/${id}`, { method: "DELETE" });
  return { id, ...existing };
}

export async function getRundowns(): Promise<Rundown[]> {
  const val = await dbFetch<Record<string, Omit<Rundown, "id">> | null>(
    "rundowns"
  );
  return snapshotToList<Rundown>(val).sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );
}

export async function addRundown(
  data: Omit<Rundown, "id">
): Promise<Rundown> {
  const { name } = await dbFetch<{ name: string }>("rundowns", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return { id: name, ...data };
}

export async function deleteRundown(id: string): Promise<boolean> {
  const existing = await dbFetch<Omit<Rundown, "id"> | null>(
    `rundowns/${id}`
  );
  if (!existing) return false;
  await dbFetch(`rundowns/${id}`, { method: "DELETE" });
  return true;
}
