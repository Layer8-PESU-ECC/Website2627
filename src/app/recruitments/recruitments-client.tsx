"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { useAuth } from "../_components/auth-context";
import { Header, Footer } from "../_components/site-chrome";
import Terminal from "./recruitment-terminal";
import { deriveYear } from "@/lib/date";

type DomainId = "marketing" | "media" | "design" | "tech" | "events";

interface DomainQuestion {
  id: string;
  label: string;
  type: "text" | "textarea" | "scale";
  required?: boolean;
}

const DOMAINS: {
  id: DomainId;
  label: string;
  blurb: string;
  glyph: string;
  layout: string;
}[] = [
  { id: "design", label: "design", blurb: "visual identity, UI/UX", glyph: "◇", layout: "col-span-2 sm:col-span-6 domain-tile-lg" },
];

function FormHead({ n, title, note }: { n: string; title: string; note?: string }) {
  return (
    <div className="form-head">
      <span className="form-head-n">{n}</span>
      <h3>{title}</h3>
      {note && <span className="form-head-note">{note}</span>}
    </div>
  );
}

function Field({
  label,
  required,
  short,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  short?: boolean;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={`field ${short ? "" : "field-q"}`}>
      <label>
        {label}
        {required && (
          <span className="req" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {hint}
    </div>
  );
}

function DomainSection({ id, children }: { id: DomainId; children: ReactNode }) {
  const i = DOMAINS.findIndex((d) => d.id === id);
  const d = DOMAINS[i];
  return (
    <section className="domain-section" aria-labelledby={`domain-${id}`}>
      <span className="domain-section-glyph" aria-hidden="true">
        {d.glyph}
      </span>
      <header className="domain-section-head">
        <span className="domain-section-idx">
          domain {String(i + 1).padStart(2, "0")}
        </span>
        <h3 id={`domain-${id}`} className="domain-section-title">
          {d.label}
        </h3>
        <p className="domain-section-blurb">{d.blurb}</p>
      </header>
      {children}
    </section>
  );
}

const DOMAIN_QUESTIONS: Record<"marketing" | "media" | "design", DomainQuestion[]> = {
  marketing: [
    {
      id: "marketingWhyDomain",
      label: "Why do you want to join the marketing domain?",
      type: "textarea",
      required: true,
    },
    {
      id: "marketingExperience",
      label: "Any prior marketing, copywriting, or social media experience?",
      type: "textarea",
      required: true,
    },
    {
      id: "marketingConfidence",
      label: "Rate your comfort with copywriting & content strategy (1-10)",
      type: "scale",
      required: true,
    },
  ],
  media: [
    {
      id: "mediaWhyDomain",
      label: "Why do you want to join the media domain?",
      type: "textarea",
      required: true,
    },
    {
      id: "mediaTools",
      label: "Which tools do you use? (Photoshop, Premiere, CapCut, etc.)",
      type: "text",
      required: true,
    },
    {
      id: "mediaPortfolio",
      label: "Link to any photography / video work (optional)",
      type: "text",
    },
  ],
  design: [
    {
      id: "designWhyDomain",
      label: "Why do you want to join the design domain?",
      type: "textarea",
      required: true,
    },
    {
      id: "designTools",
      label: "Which tools do you use? (Figma, Illustrator, etc.)",
      type: "text",
      required: true,
    },
    {
      id: "designConfidence",
      label: "Rate your confidence in UI / visual design (1-10)",
      type: "scale",
      required: true,
    },
  ],
};

function ScalePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="scale-grid">
      {Array.from({ length: 10 }, (_, i) => String(i + 1)).map((n) => (
        <button
          key={n}
          type="button"
          className={`scale-btn ${value === n ? "scale-btn-active" : ""}`}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

export default function RecruitmentsClient() {
  const { user, profile, isLoading, hasApplied, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    setLoggingOut(false);
  }
  const formRef = useRef<HTMLDivElement>(null);

  // Only the design domain is open, so it is fixed rather than selectable.
  const domains: DomainId[] = ["design"];
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [experience, setExperience] = useState("");
  const [whyJoin, setWhyJoin] = useState("");

  const [marketingWhyDomain, setMarketingWhyDomain] = useState("");
  const [marketingExperience, setMarketingExperience] = useState("");
  const [marketingConfidence, setMarketingConfidence] = useState("");

  const [mediaWhyDomain, setMediaWhyDomain] = useState("");
  const [mediaTools, setMediaTools] = useState("");
  const [mediaPortfolio, setMediaPortfolio] = useState("");

  const [designWhyDomain, setDesignWhyDomain] = useState("");
  const [designTools, setDesignTools] = useState("");
  const [designConfidence, setDesignConfidence] = useState("");

  const [techCyberExperience, setTechCyberExperience] = useState("");
  const [techLanguage, setTechLanguage] = useState("");
  const [techWhyDomain, setTechWhyDomain] = useState("");
  const [techPriorExperience, setTechPriorExperience] = useState("");
  const [techCtfParticipated, setTechCtfParticipated] = useState("");
  const [techCtfOther, setTechCtfOther] = useState("");
  const [techCtfConfidence, setTechCtfConfidence] = useState("");
  const [techGithub, setTechGithub] = useState("");
  const [techLinkedin, setTechLinkedin] = useState("");
  const [techProject, setTechProject] = useState("");

  const [eventsWhyJoin, setEventsWhyJoin] = useState("");
  const [eventsPriorExperience, setEventsPriorExperience] = useState("");
  const [eventsPlanSteps, setEventsPlanSteps] = useState("");
  const [eventsOrientationIdeas, setEventsOrientationIdeas] = useState("");
  const [eventsExcites, setEventsExcites] = useState("");

  const [feedback, setFeedback] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Year is derived from the verified session's semester, exactly like
  // the backend does — it's display-only here. Users can no longer
  // submit their own year; the backend re-derives and overrides it from
  // the JWT session regardless of what's sent, so this value is never
  // read as a source of truth, only shown to the user for confirmation.
  const year = useMemo(
    () => deriveYear(profile?.semester ?? user?.semester),
    [profile, user]
  );

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Maps each marketing/media/design question id to its own dedicated
  // [value, setter] pair — mirrors how tech/events fields already work,
  // instead of everything piling into one generic answers object.
  const fieldState: Record<string, [string, (v: string) => void]> = {
    marketingWhyDomain: [marketingWhyDomain, setMarketingWhyDomain],
    marketingExperience: [marketingExperience, setMarketingExperience],
    marketingConfidence: [marketingConfidence, setMarketingConfidence],
    mediaWhyDomain: [mediaWhyDomain, setMediaWhyDomain],
    mediaTools: [mediaTools, setMediaTools],
    mediaPortfolio: [mediaPortfolio, setMediaPortfolio],
    designWhyDomain: [designWhyDomain, setDesignWhyDomain],
    designTools: [designTools, setDesignTools],
    designConfidence: [designConfidence, setDesignConfidence],
  };

  // Required-field check done by hand instead of relying on the browser's
  // native HTML5 validation — that just silently blocks submit and jumps
  // the page to the offending field with no visible message, which reads
  // as "the button did nothing." This makes what's missing explicit.
  function findMissingFields(): string[] {
    const missing: string[] = [];
    if (!year) missing.push("year (see the note above the form)");
    if (!email.trim()) missing.push("email");
    if (!phone.trim()) missing.push("phone");

    if (domains.includes("marketing")) {
      if (!marketingWhyDomain.trim()) missing.push("why join marketing");
      if (!marketingExperience.trim()) missing.push("marketing experience");
      if (!marketingConfidence) missing.push("marketing confidence rating");
    }
    if (domains.includes("media")) {
      if (!mediaWhyDomain.trim()) missing.push("why join media");
      if (!mediaTools.trim()) missing.push("media tools");
    }
    if (domains.includes("design")) {
      if (!designWhyDomain.trim()) missing.push("why join design");
      if (!designTools.trim()) missing.push("design tools");
      if (!designConfidence) missing.push("design confidence rating");
    }
    if (domains.includes("tech")) {
      if (!techCyberExperience) missing.push("prior cybersecurity experience");
      if (!techLanguage.trim()) missing.push("preferred coding language(s)");
      if (!techWhyDomain.trim()) missing.push("why join tech");
      if (!techPriorExperience.trim()) missing.push("tech prior experience");
      if (!techCtfParticipated) missing.push("CTF participation");
      if (techCtfParticipated === "other" && !techCtfOther.trim()) {
        missing.push("CTF participation details");
      }
      if (!techCtfConfidence) missing.push("CTF confidence rating");
      if (!techProject.trim()) missing.push("tech project description");
    }
    if (domains.includes("events")) {
      if (!eventsWhyJoin.trim()) missing.push("why join events");
      if (!eventsPriorExperience.trim()) missing.push("events prior experience");
      if (!eventsPlanSteps.trim()) missing.push("event planning steps");
      if (!eventsOrientationIdeas.trim()) missing.push("orientation ideas");
      if (!eventsExcites.trim()) missing.push("what excites you about events");
    }

    return missing;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !profile) return;

    const missing = findMissingFields();
    if (missing.length > 0) {
      setStatus("error");
      setErrorMessage(`Missing required fields: ${missing.join(", ")}.`);
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);

    const body = {
      fullName: profile.name,
      srn: profile.srn,
      branch: profile.branch,
      year,
      email: email.trim(),
      phone: phone.trim(),
      domains,
      portfolioUrl: portfolioUrl || undefined,
      experience: experience || undefined,
      whyJoin: whyJoin || undefined,
      techCyberExperience: techCyberExperience || undefined,
      techLanguage: techLanguage || undefined,
      techWhyDomain: techWhyDomain || undefined,
      techPriorExperience: techPriorExperience || undefined,
      techCtfParticipated: techCtfParticipated || undefined,
      techCtfOther: techCtfOther || undefined,
      techCtfConfidence: techCtfConfidence || undefined,
      techGithub: techGithub || undefined,
      techLinkedin: techLinkedin || undefined,
      techProject: techProject || undefined,
      eventsWhyJoin: eventsWhyJoin || undefined,
      eventsPriorExperience: eventsPriorExperience || undefined,
      eventsPlanSteps: eventsPlanSteps || undefined,
      eventsOrientationIdeas: eventsOrientationIdeas || undefined,
      eventsExcites: eventsExcites || undefined,
      marketingWhyDomain: marketingWhyDomain || undefined,
      marketingExperience: marketingExperience || undefined,
      marketingConfidence: marketingConfidence || undefined,
      mediaWhyDomain: mediaWhyDomain || undefined,
      mediaTools: mediaTools || undefined,
      mediaPortfolio: mediaPortfolio || undefined,
      designWhyDomain: designWhyDomain || undefined,
      designTools: designTools || undefined,
      designConfidence: designConfidence || undefined,
      feedback,
      website,
    };

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        const fieldErrors = data?.issues?.fieldErrors as
          | Record<string, string[]>
          | undefined;
        if (fieldErrors) {
          const detail = Object.entries(fieldErrors)
            .filter(([, msgs]) => msgs && msgs.length > 0)
            .map(([field, msgs]) => `${field}: ${msgs[0]}`)
            .join("; ");
          setErrorMessage(detail || data.error || "Validation failed");
        } else {
          setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        }
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Could not reach the server. Please try again.");
    }
  }

  const applied = Boolean(user) && (status === "success" || hasApplied);

  return (
    <>
      <Header current="Recruitments" />

      <main className="flex-1">
      {!user && (
        <>
          <section className="max-w-6xl mx-auto px-4 sm:px-8 pt-20 pb-16 grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="kicker">pesu club recruitment</span>
              <h1 className="text-4xl sm:text-5xl font-display mt-3 mb-5 leading-tight">
                join the club.
                <br />
                build something real.
              </h1>
              <p className="text-fg-dim mb-8 max-w-md">
                One application, design domain open, no fluff. Log in with your PESU
                Academy credentials and we auto-fill the boring parts so you can
                get straight to telling us why you&apos;d be a good fit.
              </p>
              <button className="btn btn-solid" onClick={scrollToForm}>
                apply_now
              </button>
            </div>

            <Terminal onApply={scrollToForm} />
          </section>

          <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-16">
            <div className="card">
              <span className="kicker">why join</span>
              <h2 className="text-2xl font-display mt-2 mb-4">what you get</h2>
              <ul className="space-y-3 text-fg-dim">
                <li>→ hands-on ownership over real projects from week one</li>
                <li>→ a domain that matches what you actually want to get better at</li>
                <li>→ a small, fast-moving team instead of a committee</li>
                <li>→ a straight line from &quot;I applied&quot; to &quot;I shipped this&quot;</li>
              </ul>
            </div>
          </section>
        </>
      )}

      <section
        ref={formRef}
        className={`max-w-3xl mx-auto px-4 sm:px-8 pb-24 ${
          user ? "pt-20" : ""
        }`}
      >
        <span className="kicker">application</span>
        <h2 className="text-2xl font-display mt-2 mb-6">
          {applied ? "status" : "apply_now"}
        </h2>

        {isLoading && <p className="text-fg-dim">loading session...</p>}

        {!isLoading && applied && (
          <div className="card flex flex-col items-center gap-5 text-center py-14 px-6">
            <div className="w-12 h-12 rounded-full border border-accent/40 bg-accent/10 flex items-center justify-center text-accent text-xl leading-none">
              ✓
            </div>
            <div>
              <h3 className="text-xl font-display mb-2">
                application received
              </h3>
              <p className="text-fg-dim max-w-sm mx-auto">
                {"> we've got your application on file"}
                {user?.name ? `, ${user.name.split(" ")[0]}` : ""}. We&apos;ll
                reach out over email if you&apos;re shortlisted.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {user?.role === "admin" && (
                <Link href="/admin" className="btn btn-solid text-xs">
                  &gt; admin_panel
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="btn text-xs"
              >
                {loggingOut ? "signing_out..." : "> sign_out"}
              </button>
            </div>
          </div>
        )}

        {!isLoading && !applied && !user && (
          <div className="card">
            <p className="mb-4">
              Please log in first to apply. We use your PESU Academy login to
              verify your identity and auto-fill your details.
            </p>
                    <div className="mb-4 rounded border border-fg-dim/30 bg-fg-dim/5 p-3 text-sm">
          <p className="mb-2 font-medium">
            Note: To allow us to auto-fill your form, please complete this
            quick step in line with PESU Academy&apos;s IT policy:
          </p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Open pesuacademy.com</li>
            <li>Log in with your credentials</li>
            <li>
              Check the consent checkbox and click &quot;Agree &amp;
              Continue&quot;
            </li>
          </ol>
          <p className="mt-2">
            Please do this when you log in to fill the form.
          </p>
        </div>
            <Link href="/recruitments/login" className="btn btn-solid">
              go_to_login
            </Link>
          </div>
        )}

        {!isLoading && !applied && user && (
          <form className="space-y-14" onSubmit={handleSubmit} noValidate>
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
              aria-hidden="true"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-accent tracking-wide">
                ✓ verified via pesu auth
              </span>
              <div className="flex items-center gap-2 shrink-0">
                {user.role === "admin" && (
                  <Link href="/admin" className="btn btn-solid text-xs">
                    &gt; admin_panel
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="btn text-xs"
                >
                  {loggingOut ? "signing_out..." : "> sign_out"}
                </button>
              </div>
            </div>

            <section>
              <FormHead n="01" title="who you are" />
              <dl className="id-strip">
                <div className="id-strip-wide">
                  <dt>name</dt>
                  <dd>{profile?.name ?? user.name}</dd>
                </div>
                <div>
                  <dt>srn</dt>
                  <dd>{profile?.srn ?? user.srn}</dd>
                </div>
                <div>
                  <dt>year</dt>
                  <dd>{year || "—"}</dd>
                </div>
                <div className="id-strip-wide">
                  <dt>branch</dt>
                  <dd>{profile?.branch ?? user.branch}</dd>
                </div>
              </dl>
              {year ? (
                <p className="field-hint mt-2">
                  pulled from your PESU profile — year is derived from your
                  semester and can&apos;t be edited
                </p>
              ) : (
                <p className="field-error mt-2">
                  {"> "}PESU Academy didn&apos;t return your semester, so we
                  can&apos;t determine your year. Log into{" "}
                  <a
                    href="https://www.pesuacademy.com"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    pesuacademy.com
                  </a>{" "}
                  directly, accept the consent prompt if one appears, then
                  sign out and back in here.
                </p>
              )}
              <div className="grid sm:grid-cols-2 gap-x-4 mt-6">
                <Field label="email" required short>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </Field>
                <Field label="phone" required short>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit phone number"
                  />
                </Field>
              </div>
            </section>

            <section>
              <FormHead n="02" title="about you" />
              <Field label="why do you want to join the club?">
                <textarea
                  className="ta-lg"
                  value={whyJoin}
                  onChange={(e) => setWhyJoin(e.target.value)}
                />
              </Field>
              <Field label="relevant experience">
                <textarea
                  className="ta-sm"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </Field>
              <Field
                label="portfolio / links (optional)"
                hint={
                  <p className="text-fg-faint text-xs mt-1">
                    using a google drive/docs link? click{" "}
                    <span className="text-fg-dim">
                      share → general access → anyone with the link
                    </span>{" "}
                    before pasting it here, or we won&apos;t be able to open it.
                  </p>
                }
              >
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://..."
                />
              </Field>
            </section>

            {(["marketing", "media", "design"] as const)
              .filter((d) => domains.includes(d))
              .map((d) => (
                <DomainSection key={d} id={d}>
                  {DOMAIN_QUESTIONS[d].map((q) => {
                    const [value, setValue] = fieldState[q.id];
                    return (
                      <Field key={q.id} label={q.label} required={q.required}>
                        {q.type === "textarea" && (
                          <textarea
                            required={q.required}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                          />
                        )}
                        {q.type === "text" && (
                          <input
                            type="text"
                            required={q.required}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                          />
                        )}
                        {q.type === "scale" && (
                          <ScalePicker value={value} onChange={setValue} />
                        )}
                      </Field>
                    );
                  })}
                </DomainSection>
              ))}

            {domains.includes("tech") && (
              <DomainSection id="tech">
                <div className="grid sm:grid-cols-2 gap-x-4">
                  <Field label="prior cybersecurity experience?" required>
                    <select
                      required
                      value={techCyberExperience}
                      onChange={(e) => setTechCyberExperience(e.target.value)}
                    >
                      <option value="">select...</option>
                      <option value="yes">yes</option>
                      <option value="no">no</option>
                    </select>
                  </Field>
                  <Field label="preferred coding language(s)" required>
                    <input
                      type="text"
                      required
                      value={techLanguage}
                      onChange={(e) => setTechLanguage(e.target.value)}
                    />
                  </Field>
                </div>

                <Field label="why do you want to join the tech domain?" required>
                  <textarea
                    className="ta-sm"
                    required
                    value={techWhyDomain}
                    onChange={(e) => setTechWhyDomain(e.target.value)}
                  />
                </Field>

                <Field label="prior experience relevant to tech" required>
                  <textarea
                    className="ta-sm"
                    required
                    value={techPriorExperience}
                    onChange={(e) => setTechPriorExperience(e.target.value)}
                  />
                </Field>

                <Field label="have you participated in a CTF before?" required>
                  <select
                    required
                    value={techCtfParticipated}
                    onChange={(e) => setTechCtfParticipated(e.target.value)}
                  >
                    <option value="">select...</option>
                    <option value="yes">yes</option>
                    <option value="no">no</option>
                    <option value="other">other</option>
                  </select>
                </Field>

                {techCtfParticipated === "other" && (
                  <Field label="tell us more" required>
                    <textarea
                      className="ta-sm"
                      required
                      value={techCtfOther}
                      onChange={(e) => setTechCtfOther(e.target.value)}
                    />
                  </Field>
                )}

                <Field label="how confident are you solving CTF challenges? (1-10)" required>
                  <ScalePicker value={techCtfConfidence} onChange={setTechCtfConfidence} />
                </Field>

                <Field label="describe a project you're proud of" required>
                  <textarea
                    className="ta-lg"
                    required
                    value={techProject}
                    onChange={(e) => setTechProject(e.target.value)}
                  />
                </Field>

                <div className="grid sm:grid-cols-2 gap-x-4">
                  <Field label="GitHub profile">
                    <input
                      type="text"
                      value={techGithub}
                      onChange={(e) => setTechGithub(e.target.value)}
                      placeholder="https://github.com/..."
                    />
                  </Field>
                  <Field label="LinkedIn profile">
                    <input
                      type="text"
                      value={techLinkedin}
                      onChange={(e) => setTechLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </Field>
                </div>
              </DomainSection>
            )}

            {domains.includes("events") && (
              <DomainSection id="events">
                <Field label="why do you want to join events?" required>
                  <textarea
                    className="ta-sm"
                    required
                    value={eventsWhyJoin}
                    onChange={(e) => setEventsWhyJoin(e.target.value)}
                  />
                </Field>

                <Field label="prior event-planning experience" required>
                  <textarea
                    className="ta-sm"
                    required
                    value={eventsPriorExperience}
                    onChange={(e) => setEventsPriorExperience(e.target.value)}
                  />
                </Field>

                <Field label="walk us through the steps you'd take to plan an event" required>
                  <textarea
                    className="ta-lg"
                    required
                    value={eventsPlanSteps}
                    onChange={(e) => setEventsPlanSteps(e.target.value)}
                  />
                </Field>

                <Field label="got any ideas for our next orientation?" required>
                  <textarea
                    required
                    value={eventsOrientationIdeas}
                    onChange={(e) => setEventsOrientationIdeas(e.target.value)}
                  />
                </Field>

                <Field label="what excites you most about running events?" required>
                  <textarea
                    className="ta-sm"
                    required
                    value={eventsExcites}
                    onChange={(e) => setEventsExcites(e.target.value)}
                  />
                </Field>
              </DomainSection>
            )}

            <section>
              <FormHead n="03" title="wrap up" />
              <Field label="feedback & queries">
                <textarea
                  className="ta-sm"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="anything you'd like us to know, or questions for us"
                />
              </Field>

              {errorMessage && (
                <p className="field-error mb-4">{"> error: " + errorMessage}</p>
              )}

              <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="field-hint">
                  {`applying to: ${domains.join(" + ")}`}
                </p>
                <button
                  type="submit"
                  className="btn btn-solid justify-center sm:px-10"
                  disabled={status === "submitting"}
                >
                  {status === "submitting" ? "submitting..." : "submit_application"}
                </button>
              </div>
            </section>
          </form>
        )}
      </section>
      </main>

      <Footer current="Recruitments" />
    </>
  );
}