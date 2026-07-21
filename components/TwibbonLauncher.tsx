"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav";
import TwibbonFab from "./TwibbonFab";
import TwibbonModal from "./TwibbonModal";

export default function TwibbonLauncher() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const visible = NAV_ITEMS.some((item) => item.href === pathname);

  if (!visible) return null;

  return (
    <>
      <TwibbonFab onClick={() => setShow(true)} />
      {show && <TwibbonModal onClose={() => setShow(false)} />}
    </>
  );
}
