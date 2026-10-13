/**
 * Public contact address for the Socials email result.
 * Not in Sanity, site copy, or JSON-LD. Published as the contact on the
 * merch store terms of service, which is the shop this site already links to:
 * https://drewdellamerch.com/policies/terms-of-service
 */
export const CONTACT_EMAIL = "drewdella22@gmail.com";

export function contactMailto() {
  const params = new URLSearchParams({ subject: "Hey Drew" });
  return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
}
