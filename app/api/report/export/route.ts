export async function POST(request: Request) {
  const form = await request.formData();
  const csv = (form.get("csv") as string) ?? "";
  const filename = (form.get("filename") as string) || "report.csv";

  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
    },
  });
}
