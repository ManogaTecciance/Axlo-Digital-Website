import { contactMethods, enquirySubjects } from './site';

/**
 * Enquiry validation — shared by the browser and the server.
 *
 * The same module runs in both places, which is the point: the rules cannot
 * drift, and the server never trusts that the browser applied them. `validate`
 * is pure and has no DOM or Node dependency, so importing it from a client
 * component costs nothing and the route handler can call it verbatim.
 *
 * Field names match the form control names exactly, so an error map keys
 * straight onto the inputs.
 */

export type EnquiryField =
  | 'name'
  | 'company'
  | 'email'
  | 'phone'
  | 'subject'
  | 'message'
  | 'preferredContact';

export type Enquiry = Record<EnquiryField, string>;

export type ValidationErrors = Partial<Record<EnquiryField, string>>;

export const emptyEnquiry: Enquiry = {
  name: '',
  company: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  preferredContact: '',
};

/** Upper bounds. Generous for humans, hostile to anyone pasting a payload. */
export const limits = {
  name: 120,
  company: 160,
  email: 254, // RFC 5321 maximum length of an address
  phone: 40,
  message: 4000,
} as const;

/**
 * Deliberately permissive address check.
 *
 * A stricter regex rejects valid addresses (plus-addressing, new TLDs, quoted
 * local parts) far more often than it catches a typo, and the only way to
 * genuinely verify an address is to send to it. This checks the shape and
 * leaves the rest to delivery.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validate(input: Partial<Enquiry>): ValidationErrors {
  const errors: ValidationErrors = {};
  const value = (field: EnquiryField) => (input[field] ?? '').trim();

  const name = value('name');
  if (!name) errors.name = 'Enter your name.';
  else if (name.length > limits.name) errors.name = `Keep this under ${limits.name} characters.`;

  const company = value('company');
  if (!company) errors.company = 'Enter your company.';
  else if (company.length > limits.company)
    errors.company = `Keep this under ${limits.company} characters.`;

  const email = value('email');
  if (!email) errors.email = 'Enter your email address.';
  else if (email.length > limits.email || !EMAIL.test(email))
    errors.email = 'Enter a valid email address, for example name@company.com.';

  // Optional, but validated when present.
  const phone = value('phone');
  if (phone && phone.length > limits.phone)
    errors.phone = `Keep this under ${limits.phone} characters.`;

  const subject = value('subject');
  if (!subject) errors.subject = 'Choose what you need help with.';
  else if (!(enquirySubjects as readonly string[]).includes(subject))
    errors.subject = 'Choose one of the listed options.';

  const message = value('message');
  if (!message) errors.message = 'Tell us a little about what you need.';
  else if (message.length < 10) errors.message = 'Please add a bit more detail.';
  else if (message.length > limits.message)
    errors.message = `Keep this under ${limits.message} characters.`;

  const preferredContact = value('preferredContact');
  if (preferredContact && !(contactMethods as readonly string[]).includes(preferredContact))
    errors.preferredContact = 'Choose one of the listed options.';

  return errors;
}

/** Human-readable label per field, used in the error summary. */
export const fieldLabels: Record<EnquiryField, string> = {
  name: 'Name',
  company: 'Company',
  email: 'Email',
  phone: 'Phone',
  subject: 'What do you need help with?',
  message: 'Message',
  preferredContact: 'Preferred contact method',
};

/** The shape the API returns, in both directions. */
export type EnquiryResponse =
  | { ok: true }
  | { ok: false; errors?: ValidationErrors; reason?: 'unconfigured' | 'rejected' | 'error' };
