import {
  Competition,
  KategoriAntarBlok,
  KeuanganEntry,
  KritikSaran,
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

// Rules RTDB harus di-deny untuk publik (".read"/".write": false) supaya
// orang lain tidak bisa akses langsung lewat DATABASE_URL. Server ini tetap
// bisa baca/tulis karena ikut kirim database secret lewat query "auth".
const DATABASE_SECRET = process.env.FIREBASE_DATABASE_SECRET;

async function dbFetch<T>(
  path: string,
  init?: RequestInit,
  query?: string
): Promise<T> {
  if (!DATABASE_SECRET) {
    throw new Error("FIREBASE_DATABASE_SECRET belum di-set");
  }
  const params = new URLSearchParams(query);
  params.set("auth", DATABASE_SECRET);
  const res = await fetch(`${DATABASE_URL}/${path}.json?${params}`, {
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
  data: Partial<Omit<Competition, "id">>
): Promise<boolean> {
  const existing = await dbFetch<Omit<Competition, "id"> | null>(
    `competitions/${id}`
  );
  if (!existing) return false;
  await dbFetch(`competitions/${id}`, {
    method: "PATCH",
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
    active?: boolean;
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

export async function updateSponsor(
  id: string,
  data: { active?: boolean }
): Promise<boolean> {
  const existing = await dbFetch<Omit<Sponsor, "id"> | null>(
    `sponsors/${id}`
  );
  if (!existing) return false;
  await dbFetch(`sponsors/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return true;
}

export async function deleteSponsor(id: string): Promise<Sponsor | null> {
  const existing = await dbFetch<Omit<Sponsor, "id"> | null>(
    `sponsors/${id}`
  );
  if (!existing) return null;
  await dbFetch(`sponsors/${id}`, { method: "DELETE" });
  return { id, ...existing };
}

// Daftar tahun yang punya data rundown, terurut dari terbaru. Pakai query
// "shallow=true" biar cuma narik key tahunnya saja, bukan seluruh isi data.
export async function getTahunRundownList(): Promise<string[]> {
  const val = await dbFetch<Record<string, boolean> | null>(
    "rundowns",
    undefined,
    "shallow=true"
  );
  return Object.keys(val ?? {}).sort((a, b) => b.localeCompare(a));
}

export async function getRundowns(tahun: string): Promise<Rundown[]> {
  const val = await dbFetch<Record<string, Omit<Rundown, "id">> | null>(
    `rundowns/${tahun}`
  );
  return snapshotToList<Rundown>(val).sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );
}

export async function addRundown(
  tahun: string,
  data: Omit<Rundown, "id">
): Promise<Rundown> {
  const { name } = await dbFetch<{ name: string }>(`rundowns/${tahun}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return { id: name, ...data };
}

export async function updateRundown(
  tahun: string,
  id: string,
  data: Omit<Rundown, "id">
): Promise<boolean> {
  const existing = await dbFetch<Omit<Rundown, "id"> | null>(
    `rundowns/${tahun}/${id}`
  );
  if (!existing) return false;
  await dbFetch(`rundowns/${tahun}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return true;
}

export async function deleteRundown(
  tahun: string,
  id: string
): Promise<boolean> {
  const existing = await dbFetch<Omit<Rundown, "id"> | null>(
    `rundowns/${tahun}/${id}`
  );
  if (!existing) return false;
  await dbFetch(`rundowns/${tahun}/${id}`, { method: "DELETE" });
  return true;
}

// Daftar tahun yang punya data keuangan, terurut dari terbaru. Pakai query
// "shallow=true" biar cuma narik key tahunnya saja, bukan seluruh isi data.
export async function getTahunKeuanganList(): Promise<string[]> {
  const val = await dbFetch<Record<string, boolean> | null>(
    "keuangan",
    undefined,
    "shallow=true"
  );
  return Object.keys(val ?? {}).sort((a, b) => b.localeCompare(a));
}

export async function getKeuangan(tahun: string): Promise<KeuanganEntry[]> {
  const val = await dbFetch<Record<string, Omit<KeuanganEntry, "id">> | null>(
    `keuangan/${tahun}`
  );
  return snapshotToList<KeuanganEntry>(val).sort((a, b) =>
    a.tanggal.localeCompare(b.tanggal)
  );
}

export async function addKeuangan(
  tahun: string,
  data: Omit<KeuanganEntry, "id" | "createdAt">
): Promise<KeuanganEntry> {
  const record = { ...data, createdAt: new Date().toISOString() };
  const { name } = await dbFetch<{ name: string }>(`keuangan/${tahun}`, {
    method: "POST",
    body: JSON.stringify(record),
  });
  return { id: name, ...record };
}

export async function updateKeuangan(
  tahun: string,
  id: string,
  data: Omit<KeuanganEntry, "id" | "createdAt">
): Promise<boolean> {
  const existing = await dbFetch<Omit<KeuanganEntry, "id"> | null>(
    `keuangan/${tahun}/${id}`
  );
  if (!existing) return false;
  await dbFetch(`keuangan/${tahun}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return true;
}

export async function deleteKeuangan(
  tahun: string,
  id: string
): Promise<boolean> {
  const existing = await dbFetch<Omit<KeuanganEntry, "id"> | null>(
    `keuangan/${tahun}/${id}`
  );
  if (!existing) return false;
  await dbFetch(`keuangan/${tahun}/${id}`, { method: "DELETE" });
  return true;
}

export async function getKritikSaran(): Promise<KritikSaran[]> {
  const val = await dbFetch<Record<string, Omit<KritikSaran, "id">> | null>(
    "kritikSaran"
  );
  return snapshotToList<KritikSaran>(val).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export async function addKritikSaran(
  data: Omit<KritikSaran, "id" | "createdAt">
): Promise<KritikSaran> {
  const record = { ...data, createdAt: new Date().toISOString() };
  const { name } = await dbFetch<{ name: string }>("kritikSaran", {
    method: "POST",
    body: JSON.stringify(record),
  });
  return { id: name, ...record };
}

export async function updateKritikSaran(
  id: string,
  data: { dibaca: boolean }
): Promise<boolean> {
  const existing = await dbFetch<Omit<KritikSaran, "id"> | null>(
    `kritikSaran/${id}`
  );
  if (!existing) return false;
  await dbFetch(`kritikSaran/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return true;
}

export async function deleteKritikSaran(id: string): Promise<boolean> {
  const existing = await dbFetch<Omit<KritikSaran, "id"> | null>(
    `kritikSaran/${id}`
  );
  if (!existing) return false;
  await dbFetch(`kritikSaran/${id}`, { method: "DELETE" });
  return true;
}
