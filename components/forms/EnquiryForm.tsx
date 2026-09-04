'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '@/components/foundations/Button';
import { track } from '@/lib/analytics';
import {
  emptyEnquiry,
  fieldLabels,
  limits,
  validate,
  type Enquiry,
  type EnquiryField,
  type EnquiryResponse,
  type ValidationErrors,
} from '@/lib/enquiry';
import { contactMethods, enquirySubjects, site } from '@/lib/site';
import styles from './EnquiryForm.module.css';

type Status = 'idle' | 'submitting' | 'success' | 'unconfigured' | 'error';

/**
 * The enquiry form (brief §20).
 *
 * ACCESSIBILITY CONTRACT
 *  • Every control has a real `<label>`, not a placeholder standing in for one.
 *  • Errors are announced twice over: a summary at the top of the form that
 *    takes focus on a failed submit and links to each bad field, and a
 *    per-field message wired through `aria-describedby` + `aria-invalid`.
 *  • Validation runs on submit, then on change for fields already in error —
 *    so nothing shouts at somebody who is still typing their first answer, and
 *    a corrected field clears as soon as it is right.
 *  • The result is a live region, so a submit outcome reaches a screen reader
 *    without moving focus unexpectedly.
 *
 * NO-JAVASCRIPT FALLBACK
 * The form posts through fetch. If scripts do not run, the mailto link beside
 * the button is still a working way to make contact, and it is a real link in
 * the server HTML rather than something this component renders later.
 *
 * PRIVACY
 * Analytics events carry field *names* on validation failure and nothing else.
 * No value a visitor types is ever passed to `track`.
 */
export function EnquiryForm() {
  const formId = useId();
  const [values, setValues] = useState<Enquiry>(emptyEnquiry);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [submitted, setSubmitted] = useState(false);
  const startedAt = useRef<number>(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);
  const startReported = useRef(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Reset the fill-time baseline once the component is interactive, so a page
  // restored from bfcache does not look like a 12-hour-old form.
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const fieldId = (field: EnquiryField) => `${formId}-${field}`;
  const errorId = (field: EnquiryField) => `${formId}-${field}-error`;

  const setField = (field: EnquiryField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));

    if (!startReported.current) {
      startReported.current = true;
      track('contact_form_start', { placement: 'contact' });
    }

    // Re-validate only fields already showing an error, so corrections clear
    // immediately but untouched fields stay quiet.
    if (errors[field]) {
      const next = validate({ ...values, [field]: value });
      setErrors((current) => {
        const updated = { ...current };
        if (next[field]) updated[field] = next[field];
        else delete updated[field];
        return updated;
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    const found = validate(values);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      track('contact_form_error', { placement: 'contact', fields: Object.keys(found) });
      // Move to the summary so a keyboard or screen-reader user is told what
      // went wrong rather than left at the button.
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setStatus('submitting');
    track('contact_form_submit', { placement: 'contact' });

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...values,
          website: honeypotRef.current?.value ?? '',
          startedAt: startedAt.current,
        }),
      });

      const result = (await response.json().catch(() => ({}))) as EnquiryResponse;

      if (result.ok) {
        setStatus('success');
        setValues(emptyEnquiry);
        setErrors({});
        setSubmitted(false);
        track('contact_form_success', { placement: 'contact' });
        return;
      }

      if (result.errors) {
        setErrors(result.errors);
        setStatus('idle');
        track('contact_form_error', { placement: 'contact', fields: Object.keys(result.errors) });
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }

      setStatus(result.reason === 'unconfigured' ? 'unconfigured' : 'error');
      track('contact_form_error', { placement: 'contact' });
    } catch {
      setStatus('error');
      track('contact_form_error', { placement: 'contact' });
    }
  };

  /** A mailto carrying whatever has been typed, for the fallback paths. */
  const mailtoFallback = () => {
    const subject = values.subject ? `Enquiry: ${values.subject}` : 'Enquiry for Axlo Digital';
    const body = [
      values.name && `Name: ${values.name}`,
      values.company && `Company: ${values.company}`,
      values.email && `Email: ${values.email}`,
      values.phone && `Phone: ${values.phone}`,
      values.preferredContact && `Preferred contact: ${values.preferredContact}`,
      '',
      values.message,
    ]
      .filter(Boolean)
      .join('\n');

    return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const errorEntries = (Object.keys(errors) as EnquiryField[]).filter((field) => errors[field]);
  const showSummary = submitted && errorEntries.length > 0;

  if (status === 'success') {
    return (
      <div className={styles.result} role="status">
        <h3 className={styles.resultTitle}>Thanks — that reached us.</h3>
        <p className={styles.resultText}>
          We read every enquiry ourselves and normally reply within one working day. If it is
          urgent, write to{' '}
          <a className={styles.resultLink} href={`mailto:${site.email}`}>
            {site.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {showSummary ? (
        <div className={styles.summary} role="alert" tabIndex={-1} ref={summaryRef}>
          <h3 className={styles.summaryTitle}>
            {errorEntries.length === 1
              ? 'There is one problem with this form'
              : `There are ${errorEntries.length} problems with this form`}
          </h3>
          <ul className={styles.summaryList}>
            {errorEntries.map((field) => (
              <li key={field}>
                <a className={styles.summaryLink} href={`#${fieldId(field)}`}>
                  {fieldLabels[field]}: {errors[field]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className={styles.grid}>
        <Field
          field="name"
          label="Name"
          required
          value={values.name}
          error={errors.name}
          onChange={setField}
          id={fieldId('name')}
          errorId={errorId('name')}
          autoComplete="name"
          maxLength={limits.name}
        />

        <Field
          field="company"
          label="Company"
          required
          value={values.company}
          error={errors.company}
          onChange={setField}
          id={fieldId('company')}
          errorId={errorId('company')}
          autoComplete="organization"
          maxLength={limits.company}
        />

        <Field
          field="email"
          label="Email"
          type="email"
          required
          value={values.email}
          error={errors.email}
          onChange={setField}
          id={fieldId('email')}
          errorId={errorId('email')}
          autoComplete="email"
          inputMode="email"
          maxLength={limits.email}
        />

        <Field
          field="phone"
          label="Phone"
          type="tel"
          value={values.phone}
          error={errors.phone}
          onChange={setField}
          id={fieldId('phone')}
          errorId={errorId('phone')}
          autoComplete="tel"
          inputMode="tel"
          maxLength={limits.phone}
          hint="Optional"
        />

        <div className={`${styles.field} ${styles.fieldWide}`}>
          <label className={styles.label} htmlFor={fieldId('subject')}>
            What do you need help with?
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          </label>
          <select
            className={styles.select}
            id={fieldId('subject')}
            name="subject"
            value={values.subject}
            required
            aria-invalid={errors.subject ? true : undefined}
            aria-describedby={errors.subject ? errorId('subject') : undefined}
            onChange={(event) => setField('subject', event.target.value)}
          >
            <option value="">Choose one…</option>
            {enquirySubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          {errors.subject ? (
            <p className={styles.error} id={errorId('subject')}>
              {errors.subject}
            </p>
          ) : null}
        </div>

        <div className={`${styles.field} ${styles.fieldWide}`}>
          <label className={styles.label} htmlFor={fieldId('message')}>
            Message
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          </label>
          <textarea
            className={styles.textarea}
            id={fieldId('message')}
            name="message"
            rows={6}
            value={values.message}
            required
            maxLength={limits.message}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? errorId('message') : undefined}
            placeholder="What are you building, improving, or trying to connect?"
            onChange={(event) => setField('message', event.target.value)}
          />
          {errors.message ? (
            <p className={styles.error} id={errorId('message')}>
              {errors.message}
            </p>
          ) : null}
        </div>

        <fieldset className={`${styles.field} ${styles.fieldWide} ${styles.fieldset}`}>
          <legend className={styles.legend}>Preferred contact method</legend>
          <div className={styles.radioRow}>
            {contactMethods.map((method) => (
              <label className={styles.radioLabel} key={method}>
                <input
                  className={styles.radio}
                  type="radio"
                  name="preferredContact"
                  value={method}
                  checked={values.preferredContact === method}
                  onChange={(event) => setField('preferredContact', event.target.value)}
                />
                {method}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Honeypot. Hidden from sight, from assistive technology and from the tab
          order; only an automated filler reaches it. Not `display: none`, which
          some bots specifically skip. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input
          id={`${formId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          ref={honeypotRef}
        />
      </div>

      <div className={styles.actions}>
        <Button type="submit" size="lg" withArrow loading={status === 'submitting'} loadingLabel="Sending…">
          Send enquiry
        </Button>
        <p className={styles.direct}>
          or write to{' '}
          <a className={styles.directLink} href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </p>
      </div>

      {/* Delivery outcomes. A live region so the result is announced without
          stealing focus from wherever the visitor is. */}
      <div className={styles.status} role="status" aria-live="polite">
        {status === 'unconfigured' ? (
          <p className={styles.notice}>
            This form is not connected to a mailbox yet.{' '}
            <a className={styles.noticeLink} href={mailtoFallback()}>
              Send what you have written by email instead
            </a>{' '}
            — nothing you typed has been lost.
          </p>
        ) : null}

        {status === 'error' ? (
          <p className={styles.notice}>
            Something went wrong sending that. Please try again, or{' '}
            <a className={styles.noticeLink} href={mailtoFallback()}>
              send it by email
            </a>
            .
          </p>
        ) : null}
      </div>
    </form>
  );
}

/** One labelled text input with its error wiring. */
function Field({
  field,
  label,
  value,
  error,
  onChange,
  id,
  errorId,
  type = 'text',
  required = false,
  hint,
  ...input
}: {
  field: EnquiryField;
  label: string;
  value: string;
  error?: string;
  onChange: (field: EnquiryField, value: string) => void;
  id: string;
  errorId: string;
  type?: string;
  required?: boolean;
  hint?: string;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value' | 'id' | 'name' | 'type' | 'required'
>) {
  const hintId = hint ? `${id}-hint` : undefined;
  const describedBy = [error ? errorId : null, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        ) : null}
        {hint ? (
          <span className={styles.hint} id={hintId}>
            {hint}
          </span>
        ) : null}
      </label>
      <input
        className={styles.input}
        id={id}
        name={field}
        type={type}
        value={value}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        onChange={(event) => onChange(field, event.target.value)}
        {...input}
      />
      {error ? (
        <p className={styles.error} id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
