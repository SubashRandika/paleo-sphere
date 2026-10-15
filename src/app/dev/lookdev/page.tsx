import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getAllSpecies } from "@/domain/species/repository";
import { toViewerConfig } from "@/domain/species/viewer-config";
import { LookdevStage } from "./LookdevStage";

export const metadata: Metadata = { title: "Lookdev", robots: { index: false, follow: false } };

/**
 * Development-only look-development page: renders one species full-screen with render settings
 * taken from the URL (see src/features/viewer/lookdev-params.ts). Used by scripts/lookdev.mjs to
 * produce the comparisons in docs/lookdev/. Returns 404 in production builds.
 */
export default function LookdevPage() {
  if (process.env.NODE_ENV === "production") notFound();
  const configs = Object.fromEntries(getAllSpecies().map((s) => [s.slug, toViewerConfig(s)]));
  return (
    <Suspense>
      <LookdevStage configs={configs} />
    </Suspense>
  );
}
