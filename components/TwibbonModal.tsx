"use client";

import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { Sponsor } from "@/lib/types";

const TEMPLATE_SRC = "/twibon.webp";
const TEMPLATE_WIDTH = 1536;
const TEMPLATE_HEIGHT = 2752;

// Dikalibrasi terhadap public/twibon.webp (diukur lewat analisis pixel) —
// sesuaikan di sini kalau template diganti.
const PHOTO_FRAME = { x: 726, y: 785, width: 680, height: 923, radius: 32 };
const SPONSOR_BOX = { x: 90, y: 2085, width: 1355, height: 465 };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Gagal memuat gambar: ${src}`));
    img.src = src;
  });
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawTextOverlays(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";

  const titleX = 620;
  ctx.font = "bold 34px Arial, sans-serif";
  ctx.fillText("DIRGAHAYU", titleX, 175);
  ctx.fillText("REPUBLIK INDONESIA", titleX, 215);

  ctx.font = "bold 92px Arial, sans-serif";
  ctx.fillText("BLOK C", titleX, 260);
  ctx.fillText("PELICAN", titleX, 360);

  ctx.font = "bold 34px Arial, sans-serif";
  ctx.fillText("SERPONG LAGOON", titleX, 470);

  const leftX = 46;
  ctx.font = "bold 74px Arial, sans-serif";
  ["RAYAKAN", "KEMERDEKAAN", "17 AGUSTUS"].forEach((line, i) => {
    ctx.fillText(line, leftX, 850 + i * 92);
  });

  ctx.font = "bold 42px Arial, sans-serif";
  ["BERSAMA WARGA", "BLOK PELICAN,", "SERPONG LAGOON"].forEach((line, i) => {
    ctx.fillText(line, leftX, 1180 + i * 56);
  });
  ["SEMANGAT", "PERSATUAN,", "KREATIVITAS,", "DAN KEBERSAMAAN!"].forEach(
    (line, i) => {
      ctx.fillText(line, leftX, 1400 + i * 56);
    }
  );
  ctx.restore();

  ctx.save();
  const barH = 76;
  const barY = TEMPLATE_HEIGHT - barH - 8;
  roundedRectPath(ctx, 40, barY, TEMPLATE_WIDTH - 80, barH, 14);
  ctx.fillStyle = "#0f2a4a";
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 42px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(
    "#HUTRI81 #MERDEKA #BLOKCPELICAN #SERPONGLAGOON",
    TEMPLATE_WIDTH / 2,
    barY + 16
  );
  ctx.restore();
}

function chunkRows<T>(items: T[]): T[][] {
  if (items.length <= 5) return [items];
  const perRow = Math.ceil(items.length / 2);
  return [items.slice(0, perRow), items.slice(perRow)];
}

function drawContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  box: number
) {
  const scale = Math.min(box / img.width, box / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h);
}

function drawSponsors(
  ctx: CanvasRenderingContext2D,
  sponsors: Sponsor[],
  images: Record<string, HTMLImageElement>
) {
  const centerX = SPONSOR_BOX.x + SPONSOR_BOX.width / 2;

  ctx.save();
  ctx.fillStyle = "#9e0c24";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = "bold 58px Arial, sans-serif";
  const titleY = SPONSOR_BOX.y + 32;
  ctx.fillText("Sponsor 17an Pelican C", centerX, titleY);
  ctx.restore();

  const loaded = sponsors.filter((s) => images[s.id]);
  if (loaded.length === 0) return;

  const rows = chunkRows(loaded);
  const logoSize = rows.length === 1 ? 160 : 120;
  const itemHeight = logoSize;
  const rowGap = 24;
  const totalRowsHeight =
    rows.length * itemHeight + (rows.length - 1) * rowGap;

  const contentTop = titleY + 78;
  const contentBottom = SPONSOR_BOX.y + SPONSOR_BOX.height - 24;
  const availableHeight = Math.max(0, contentBottom - contentTop);
  const rowsTop =
    contentTop + Math.max(0, (availableHeight - totalRowsHeight) / 2);

  ctx.save();
  rows.forEach((rowSponsors, rowIdx) => {
    const rowY = rowsTop + rowIdx * (itemHeight + rowGap);
    const itemWidth = Math.min(
      240,
      (SPONSOR_BOX.width - 60) / rowSponsors.length
    );
    let itemX = centerX - (itemWidth * rowSponsors.length) / 2;

    rowSponsors.forEach((s) => {
      const cx = itemX + itemWidth / 2;
      const img = images[s.id];
      drawContain(ctx, img, cx, rowY + logoSize / 2, logoSize);
      itemX += itemWidth;
    });
  });
  ctx.restore();
}

export default function TwibbonModal({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const templateRef = useRef<HTMLImageElement | null>(null);
  const dragState = useRef<{
    startX: number;
    startY: number;
    startOffset: { x: number; y: number };
  } | null>(null);

  const [templateReady, setTemplateReady] = useState(false);
  const [fotoImg, setFotoImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [error, setError] = useState("");
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [sponsorImages, setSponsorImages] = useState<
    Record<string, HTMLImageElement>
  >({});

  useEffect(() => {
    loadImage(TEMPLATE_SRC)
      .then((img) => {
        templateRef.current = img;
        setTemplateReady(true);
      })
      .catch(() => setError("Gagal memuat template twibbon."));
  }, []);

  useEffect(() => {
    fetch("/api/sponsors")
      .then((r) => (r.ok ? r.json() : []))
      .then(async (list: Sponsor[]) => {
        setSponsors(list);
        const loaded = await Promise.all(
          list.map(async (s) => {
            try {
              return [s.id, await loadImage(s.logoUrl)] as const;
            } catch {
              return null;
            }
          })
        );
        const map: Record<string, HTMLImageElement> = {};
        for (const entry of loaded) {
          if (entry) map[entry[0]] = entry[1];
        }
        setSponsorImages(map);
      })
      .catch(() => {
        // biarkan tanpa sponsor kalau gagal dimuat
      });
  }, []);

  useEffect(() => {
    render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateReady, fotoImg, zoom, offset, sponsors, sponsorImages]);

  function render() {
    const canvas = canvasRef.current;
    const template = templateRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !template || !ctx) return;

    canvas.width = TEMPLATE_WIDTH;
    canvas.height = TEMPLATE_HEIGHT;
    ctx.clearRect(0, 0, TEMPLATE_WIDTH, TEMPLATE_HEIGHT);
    ctx.drawImage(template, 0, 0, TEMPLATE_WIDTH, TEMPLATE_HEIGHT);

    ctx.save();
    roundedRectPath(
      ctx,
      PHOTO_FRAME.x,
      PHOTO_FRAME.y,
      PHOTO_FRAME.width,
      PHOTO_FRAME.height,
      PHOTO_FRAME.radius
    );
    ctx.clip();

    if (fotoImg) {
      const coverScale = Math.max(
        PHOTO_FRAME.width / fotoImg.width,
        PHOTO_FRAME.height / fotoImg.height
      );
      const scale = coverScale * zoom;
      const drawW = fotoImg.width * scale;
      const drawH = fotoImg.height * scale;
      const cx = PHOTO_FRAME.x + PHOTO_FRAME.width / 2 + offset.x;
      const cy = PHOTO_FRAME.y + PHOTO_FRAME.height / 2 + offset.y;
      ctx.drawImage(fotoImg, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
    } else {
      ctx.fillStyle = "#e5e7eb";
      ctx.fillRect(
        PHOTO_FRAME.x,
        PHOTO_FRAME.y,
        PHOTO_FRAME.width,
        PHOTO_FRAME.height
      );
      ctx.fillStyle = "#9ca3af";
      ctx.font = "600 40px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        "📷 Foto kamu di sini",
        PHOTO_FRAME.x + PHOTO_FRAME.width / 2,
        PHOTO_FRAME.y + PHOTO_FRAME.height / 2
      );
    }
    ctx.restore();

    drawTextOverlays(ctx);
    drawSponsors(ctx, sponsors, sponsorImages);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    try {
      const img = await loadImage(URL.createObjectURL(file));
      setFotoImg(img);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    } catch {
      setError("Gagal memuat foto. Coba file lain.");
    }
  }

  function toCanvasScale() {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.clientWidth) return 1;
    return TEMPLATE_WIDTH / canvas.clientWidth;
  }

  // Foto tidak boleh digeser/zoom-out sampai ada bagian frame yang kosong —
  // batasi offset supaya foto selalu menutupi seluruh area yang disediakan.
  function clampOffset(
    raw: { x: number; y: number },
    z: number,
    img: HTMLImageElement
  ) {
    const coverScale = Math.max(
      PHOTO_FRAME.width / img.width,
      PHOTO_FRAME.height / img.height
    );
    const scale = coverScale * z;
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const maxX = Math.max(0, (drawW - PHOTO_FRAME.width) / 2);
    const maxY = Math.max(0, (drawH - PHOTO_FRAME.height) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, raw.x)),
      y: Math.min(maxY, Math.max(-maxY, raw.y)),
    };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!fotoImg) return;
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      startOffset: { ...offset },
    };
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!dragState.current || !fotoImg) return;
    const scale = toCanvasScale();
    const dx = (e.clientX - dragState.current.startX) * scale;
    const dy = (e.clientY - dragState.current.startY) * scale;
    setOffset(
      clampOffset(
        {
          x: dragState.current.startOffset.x + dx,
          y: dragState.current.startOffset.y + dy,
        },
        zoom,
        fotoImg
      )
    );
  }

  function handlePointerUp() {
    dragState.current = null;
  }

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "twibbon-17an-blok-c.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  }

  return (
    <Modal
      title="🖼️ Buat Twibbon 17an Blok C"
      onClose={onClose}
      size="lg"
      footer={
        <>
          <div className="flex flex-wrap gap-3">
            <label className="flex-1 cursor-pointer rounded-lg border border-red-200 bg-white px-4 py-2 text-center font-bold text-dark-primary transition-colors hover:bg-red-50">
              📷 {fotoImg ? "Ganti Foto" : "Pilih Foto"}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={handleDownload}
              disabled={!fotoImg}
              className="flex-1 rounded-lg bg-primary px-4 py-2 font-bold text-white transition-colors hover:bg-dark-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              ⬇️ Unduh
            </button>
          </div>
          {fotoImg && (
            <p className="mt-2 text-center text-xs text-gray-500">
              Geser foto untuk atur posisi, pakai slider untuk zoom.
            </p>
          )}
        </>
      }
    >
      <p className="mb-4 text-sm text-gray-600">
        Upload foto kamu, atur posisinya, lalu unduh hasilnya. Foto{" "}
        <strong>tidak diunggah ke server</strong> — semua diproses langsung di
        perangkat kamu.
      </p>

      <div className="mb-4 overflow-hidden rounded-xl border border-red-100 bg-secondary">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className={`h-auto w-full touch-none ${
            fotoImg ? "cursor-move" : ""
          }`}
        />
      </div>

      {fotoImg && (
        <div className="mb-4 flex items-center gap-3">
          <label className="text-sm font-semibold whitespace-nowrap text-gray-600">
            🔍 Zoom
          </label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => {
              const z = Number(e.target.value);
              setZoom(z);
              if (fotoImg) setOffset((prev) => clampOffset(prev, z, fotoImg));
            }}
            className="w-full accent-primary"
          />
        </div>
      )}

      {error && <p className="mb-3 text-sm font-medium text-primary">{error}</p>}
    </Modal>
  );
}
