import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Stores an image and returns its public URL.
 * - Locally: writes to public/uploads (served statically by Next).
 * - On Vercel (read-only filesystem): uses Vercel Blob when
 *   BLOB_READ_WRITE_TOKEN is configured.
 */
export async function saveImage(
  buffer: Buffer,
  filename: string,
  contentType = "image/jpeg"
): Promise<string> {
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_");

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (blobToken) {
    const res = await fetch(
      `https://blob.vercel-storage.com/uploads/${encodeURIComponent(safe)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${blobToken}`,
          "x-api-version": "7",
          "x-content-type": contentType,
          "x-add-random-suffix": "1",
        },
        body: new Uint8Array(buffer),
      }
    );
    if (!res.ok) throw new Error(`Blob upload failed: ${res.status}`);
    const data = (await res.json()) as { url: string };
    return data.url;
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const unique = `${Date.now()}-${safe}`;
  await writeFile(path.join(dir, unique), buffer);
  return `/uploads/${unique}`;
}
