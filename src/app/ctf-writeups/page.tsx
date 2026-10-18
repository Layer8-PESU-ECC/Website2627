import type { Metadata } from "next";
import CtfWriteupsClient from "./ctf-writeups-client";

export const metadata: Metadata = {
  title: "CTF Writeups · Layer8 — PES University, ECC",
  description:
    "Searchable Layer8 CTF writeups covering cryptography, encoding, and OSINT.",
};

export default function CtfWriteupsPage() {
  return <CtfWriteupsClient />;
}
