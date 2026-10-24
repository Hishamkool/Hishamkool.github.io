import { send } from "@emailjs/browser";
import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert, CircleCheck, LoaderCircle, Send } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";

// EmailJS ids come from VITE_EMAILJS_* env vars (.env.local in development,
// repository variables in the GitHub Pages workflow). They are public by
// design: EmailJS restricts sending by allowed origin, not by secret.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const FALLBACK_EMAIL = "linkedin.hisham@gmail.com";

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "w-full rounded-2xl border border-[var(--color-border-glass)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition focus:border-[var(--color-accent-blue)] focus:ring-4 focus:ring-[var(--color-accent-blue)]/15";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // Hidden field only bots fill in; such submissions are dropped silently.
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    if (website) {
      setStatus("sent");
      return;
    }

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      // Without EmailJS keys, hand the message to the visitor's mail app.
      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("sending");
    try {
      await send(
        SERVICE_ID,
        TEMPLATE_ID,
        { name, email, message },
        { publicKey: PUBLIC_KEY },
      );
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="sr-only">Your name</span>
          <input
            required
            name="name"
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block">
          <span className="sr-only">Your email</span>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={fieldClass}
          />
        </label>
      </div>
      <label className="block">
        <span className="sr-only">Message</span>
        <textarea
          required
          name="message"
          rows={5}
          maxLength={2000}
          placeholder="Tell me about your project, role or idea…"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={`${fieldClass} resize-none`}
        />
      </label>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
        className="hidden"
      />

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-blue)] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(47,111,237,0.35)] transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70"
        >
          {status === "sending" ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {status === "sending" ? "Sending…" : "Send Message"}
        </button>

        <AnimatePresence mode="wait">
          {status === "sent" && (
            <motion.p
              key="sent"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              role="status"
              className="inline-flex items-center gap-2 text-sm text-emerald-500"
            >
              <CircleCheck className="h-4 w-4" />
              Thanks! I&rsquo;ll get back to you soon.
            </motion.p>
          )}
          {status === "error" && (
            <motion.p
              key="error"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              role="alert"
              className="flex items-start gap-2 text-sm text-rose-500"
            >
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Couldn&rsquo;t send. Please email{" "}
                <a href={`mailto:${FALLBACK_EMAIL}`} className="underline">
                  {FALLBACK_EMAIL}
                </a>
              </span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
