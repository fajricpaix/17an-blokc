"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import KritikSaranFab from "./KritikSaranFab";
import KritikSaranModal from "./KritikSaranModal";

export default function KritikSaranLauncher() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [notif, setNotif] = useState("");
  const visible = NAV_ITEMS.some((item) => item.href === pathname);

  if (!visible) return null;

  return (
    <>
      <KritikSaranFab onClick={() => setShow(true)} />
      {show && (
        <KritikSaranModal
          onClose={() => setShow(false)}
          onSuccess={() => {
            setNotif("🙏 Terima kasih, Kritik & Saran Anda sudah terkirim.");
            setTimeout(() => setNotif(""), 4000);
          }}
        />
      )}
      {notif && (
        <div className="fixed top-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 animate-slide-down rounded-2xl border border-green-200 bg-white/95 px-5 py-3.5 text-center font-semibold text-green-800 shadow-2xl shadow-green-900/10 backdrop-blur print:hidden">
          {notif}
        </div>
      )}
    </>
  );
}
