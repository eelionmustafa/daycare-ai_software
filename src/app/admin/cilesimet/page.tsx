import { getSettings } from "@/lib/settings";
import { saveSettings } from "@/app/actions/admin";
import { Field, SubmitButton } from "@/components/ui";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ sukses?: string }>;
}) {
  const [{ sukses }, s] = await Promise.all([searchParams, getSettings()]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Cilësimet e faqes</h1>
        <p className="mt-1 text-ink-soft">
          Këto të dhëna shfaqen kudo në faqen publike — përditësojini me të dhënat e vërteta
          të qendrës.
        </p>
      </div>

      {sukses && (
        <p className="rounded-xl bg-sage/15 px-4 py-3 text-sm font-semibold text-sage-deep">
          Cilësimet u ruajtën.
        </p>
      )}

      <form action={saveSettings} className="space-y-8 rounded-3xl bg-white p-8 shadow-soft">
        <fieldset className="space-y-4">
          <legend className="font-display text-lg font-semibold">Të dhënat bazë</legend>
          <Field label="Emri i qendrës" name="site_name" defaultValue={s.site_name} />
          <Field label="Slogani" name="tagline" defaultValue={s.tagline} />
          <Field label="Moshat që pranohen" name="ages" defaultValue={s.ages} />
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-display text-lg font-semibold">Kontakti</legend>
          <Field label="Adresa" name="address" defaultValue={s.address} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Telefoni" name="phone" defaultValue={s.phone} />
            <Field label="Email" name="email" defaultValue={s.email} />
          </div>
          <Field label="Orari" name="hours" defaultValue={s.hours} />
          <Field
            label="Kërkimi për hartën (Google Maps)"
            name="maps_query"
            defaultValue={s.maps_query}
            hint="P.sh. adresa e saktë e qendrës — përdoret për hartën në faqen e kontaktit."
          />
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-display text-lg font-semibold">Ballina</legend>
          <Field label="Titulli kryesor (hero)" name="hero_headline" defaultValue={s.hero_headline} />
          <Field label="Nëntitulli" name="hero_subline" type="textarea" defaultValue={s.hero_subline} />
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-display text-lg font-semibold">Rrjetet sociale</legend>
          <Field label="Facebook URL" name="facebook_url" defaultValue={s.facebook_url} />
          <Field label="Instagram URL" name="instagram_url" defaultValue={s.instagram_url} />
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-display text-lg font-semibold">
            Sinkronizimi me Facebook
          </legend>
          <p className="text-sm leading-relaxed text-ink-soft">
            Për sinkronizim automatik të fotove nevojitet një <em>Page Access Token</em> nga{" "}
            <a
              href="https://developers.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-sky hover:underline"
            >
              developers.facebook.com
            </a>{" "}
            për faqen tuaj. Pa token, fotot mund të ngarkohen manualisht te Galeria.
          </p>
          <Field label="Facebook Page ID" name="fb_page_id" defaultValue={s.fb_page_id} />
          <Field
            label="Facebook Access Token"
            name="fb_access_token"
            type="password"
            defaultValue={s.fb_access_token}
            hint="Ruhet i sigurt në bazën e të dhënave dhe s'shfaqet askund publikisht."
          />
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="font-display text-lg font-semibold">
            Të dhënat bankare (për faturat)
          </legend>
          <Field label="Banka" name="bank_name" defaultValue={s.bank_name} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Numri i llogarisë / IBAN" name="bank_account" defaultValue={s.bank_account} />
            <Field label="Mbajtësi i llogarisë" name="bank_holder" defaultValue={s.bank_holder} />
          </div>
        </fieldset>

        <SubmitButton>Ruaj cilësimet</SubmitButton>
      </form>
    </div>
  );
}
