import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { saveImage } from "@/lib/storage";
import { categorizeCaption } from "@/lib/categorize";

type FbImage = { source: string; width: number; height: number };
type FbPhoto = {
  id: string;
  name?: string;
  created_time: string;
  images?: FbImage[];
  album?: { name: string };
};

export type SyncResult =
  | { ok: true; imported: number; skipped: number; hasMore: boolean }
  | { ok: false; error: string };

// Facebook always creates these two albums for a Page's logo/cover history —
// never real activity photos, so they're excluded from the sync.
const EXCLUDED_ALBUMS = new Set(["Profile pictures", "Cover photos"]);

/**
 * Pulls the page's uploaded photos from the Facebook Graph API and imports
 * any that aren't in the gallery yet. Imported photos arrive HIDDEN so the
 * admin approves what goes public. Image bytes are downloaded and re-hosted
 * (FB CDN URLs expire), captions come along when present.
 *
 * Requires fb_page_id + fb_access_token in Cilësimet (a Page Access Token
 * with pages_read_engagement, from developers.facebook.com), or the
 * FACEBOOK_PAGE_ID / FACEBOOK_ACCESS_TOKEN env vars.
 */
export async function syncFacebookPhotos(): Promise<SyncResult> {
  const s = await getSettings();
  const pageId = s.fb_page_id || process.env.FACEBOOK_PAGE_ID;
  const token = s.fb_access_token || process.env.FACEBOOK_ACCESS_TOKEN;
  if (!pageId || !token) {
    return {
      ok: false,
      error:
        "Mungon Facebook Page ID ose Access Token. Plotësojini te Cilësimet, ose ngarkoni fotot manualisht më poshtë.",
    };
  }

  // Note: `type=uploaded` returns empty for some Pages on the "New Pages
  // Experience". Walking /photos chronologically also risks burning the
  // whole page budget on "Profile pictures"/"Cover photos" before reaching
  // real content, so instead find the actual content album(s) first and
  // pull photos from those directly.
  let url: string;
  try {
    const albumsRes = await fetch(
      `https://graph.facebook.com/v21.0/${encodeURIComponent(
        pageId
      )}/albums?fields=id,name&access_token=${encodeURIComponent(token)}`
    );
    const albumsData = await albumsRes.json();
    if (!albumsRes.ok || albumsData.error) {
      return {
        ok: false,
        error: `Facebook API: ${albumsData.error?.message ?? `HTTP ${albumsRes.status}`}`,
      };
    }
    const contentAlbum = (albumsData.data ?? []).find(
      (a: { id: string; name: string }) => !EXCLUDED_ALBUMS.has(a.name)
    );
    if (!contentAlbum) {
      return {
        ok: false,
        error: "Nuk u gjet asnjë album me foto aktivitetesh në faqen e Facebook-ut.",
      };
    }
    url = `https://graph.facebook.com/v21.0/${encodeURIComponent(
      contentAlbum.id
    )}/photos?fields=id,name,created_time,images,album&limit=50&access_token=${encodeURIComponent(
      token
    )}`;
  } catch (e) {
    return {
      ok: false,
      error: `Sinkronizimi dështoi: ${e instanceof Error ? e.message : "gabim i panjohur"}`,
    };
  }

  let imported = 0;
  let skipped = 0;
  let pages = 0;

  // Album slugs → ids, so captions can be auto-categorized on import.
  const localAlbums = await db.album.findMany({ select: { id: true, slug: true } });
  const albumIdBySlug = new Map(localAlbums.map((a) => [a.slug, a.id]));

  try {
    while (url && pages < 4) {
      pages++;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok || data.error) {
        return {
          ok: false,
          error: `Facebook API: ${data.error?.message ?? `HTTP ${res.status}`}`,
        };
      }

      for (const photo of (data.data ?? []) as FbPhoto[]) {
        if (photo.album?.name && EXCLUDED_ALBUMS.has(photo.album.name)) {
          continue;
        }
        const exists = await db.photo.findUnique({ where: { fbId: photo.id } });
        if (exists) {
          skipped++;
          continue;
        }
        const best = photo.images?.[0];
        if (!best) continue;

        const imgRes = await fetch(best.source);
        if (!imgRes.ok) continue;
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        const storedUrl = await saveImage(buffer, `fb-${photo.id}.jpg`);

        const caption = photo.name?.slice(0, 300) ?? null;
        const albumSlug = categorizeCaption(caption);
        await db.photo.create({
          data: {
            url: storedUrl,
            fbId: photo.id,
            caption,
            source: "FACEBOOK",
            width: best.width,
            height: best.height,
            // Photos go public right away; the admin can hide or delete
            // individual ones afterwards from Admin → Galeria.
            visible: true,
            albumId: albumSlug ? albumIdBySlug.get(albumSlug) ?? null : null,
          },
        });
        imported++;
      }

      url = data.paging?.next ?? "";
    }
    return { ok: true, imported, skipped, hasMore: Boolean(url) };
  } catch (e) {
    return {
      ok: false,
      error: `Sinkronizimi dështoi: ${e instanceof Error ? e.message : "gabim i panjohur"}`,
    };
  }
}
