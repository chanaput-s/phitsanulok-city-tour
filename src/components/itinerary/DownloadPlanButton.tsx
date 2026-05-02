"use client";

import { Download } from "lucide-react";

export function DownloadPlanButton({ planPngs }: { planPngs: string[] }) {
  const handleDownload = () => {
    planPngs.forEach((file, i) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = `/Plan_png/${file}`;
        a.download = file;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, i * 400);
    });
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm shadow-md mb-5"
    >
      <Download className="w-4 h-4" />
      Download Plan
    </button>
  );
}
