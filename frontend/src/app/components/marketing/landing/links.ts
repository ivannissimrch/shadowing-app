/** External destinations and contact details used across the landing page. */

export const CONTACT_EMAIL = "analisse84.ar@gmail.com";
export const YOUTUBE_URL = "https://www.youtube.com/@FluencyAccentCoach";
export const FACEBOOK_PAGE_URL = "https://www.facebook.com/Analisse84/";
export const FACEBOOK_GROUP_URL =
  "https://www.facebook.com/share/g/18wdNiusvm/";
export const NAVIKX_URL = "https://navikx.com";

/**
 * Builds a mailto for Lyn, optionally pre-filling the subject with the course
 * or package the visitor clicked from, so she knows what the enquiry is about.
 */
export function mailto(subject?: string) {
  return subject
    ? `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`
    : `mailto:${CONTACT_EMAIL}`;
}
