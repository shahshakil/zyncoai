// Square's tokenize() returns { status, token?, errors? } where errors[].type
// is a machine enum (e.g. "INVALID_CARD_NUMBER") and errors[].message is
// Square's own already-somewhat-human text. Square's message is decent but
// terse/generic ("Invalid card number.") — this maps the common types to
// warmer, more specific copy, falling back to Square's own message (never a
// bare type/status code) for anything not in the table.
const FRIENDLY_MESSAGES: Record<string, string> = {
  INVALID_CARD_NUMBER: "That card number doesn't look right — double-check the digits.",
  INVALID_EXPIRATION: "That expiry date doesn't look right — check the month and year.",
  INVALID_EXPIRATION_DATE: "That expiry date doesn't look right — check the month and year.",
  UNSUPPORTED_CARD_BRAND: "We can't accept that card brand — try a Visa, Mastercard or Amex.",
  INVALID_CVV: "That security code (CVV) doesn't look right.",
  INVALID_POSTAL_CODE: "That postal code doesn't look right.",
  CARD_DECLINED: "Your card was declined — try a different card or contact your bank.",
  CARD_EXPIRED: "That card has expired — try a different card.",
};

export function friendlySquareError(err: { type?: string; message?: string } | undefined | null): string {
  if (!err) return "Something went wrong with that card — please try again.";
  if (err.type && FRIENDLY_MESSAGES[err.type]) return FRIENDLY_MESSAGES[err.type];
  return err.message || "Something went wrong with that card — please try again.";
}
