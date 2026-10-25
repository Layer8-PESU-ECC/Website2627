import type { Metadata } from "next";
import RecruitmentsClient from "./recruitments-client";

export const metadata: Metadata = {
  title: "Recruitments · Layer8 — PES University, ECC",
  description:
    "Layer8 design domain recruitment is open. Apply with your PESU Academy login.",
};

// Recruitment is reopened for the design domain only (see OPEN_DOMAINS in
// @/lib/validation and DOMAINS in ./recruitments-client.tsx). The closed
// page (./recruitments-closed-client.tsx) is kept — swap the import to
// close recruitments again.
export default function RecruitmentsPage() {
  return <RecruitmentsClient />;
}
