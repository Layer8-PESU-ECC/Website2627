"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Footer, Header } from "../_components/site-chrome";
import { InteractiveTerminal } from "../_components/interactive-terminal";
import { CATEGORIES, difficultyStyle, WRITEUPS } from "./writeups";

const TERMINAL_SCRIPT = WRITEUPS.length
  ? `$ ls ctf-writeups/
${WRITEUPS.map((writeup) => writeup.slug).join("  ")}
$ cat ctf-writeups/${WRITEUPS[0].slug}.md
${WRITEUPS[0].excerpt}`
  : `$ ls ctf-writeups/
(directory empty)`;

const WRITEUP_FS = {
  dir: "ctf-writeups",
  entries: WRITEUPS.map((writeup) => writeup.slug),
  files: Object.fromEntries(
    WRITEUPS.flatMap((writeup) => [
      [writeup.slug, writeup.excerpt],
      [`${writeup.slug}.md`, writeup.excerpt],
      [`ctf-writeups/${writeup.slug}.md`, writeup.excerpt],
    ]),
  ),
} as const;

export default function CtfWriteupsClient() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return WRITEUPS.filter((writeup) => {
      const categoryMatch = filter === "all" || writeup.category === filter;
      const searchable = [
        writeup.title,
        writeup.author,
        writeup.difficulty,
        writeup.category,
        writeup.excerpt,
        writeup.event || "",
        ...writeup.tags,
      ]
        .join(" ")
        .toLowerCase();
      return categoryMatch && (needle === "" || searchable.includes(needle));
    });
  }, [filter, query]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const element = event.target as HTMLElement;
      const isTyping = /^(input|textarea|select)$/i.test(element.tagName);
      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        searchRef.current?.focus();
      } else if (event.key === "Escape" && element === searchRef.current) {
        setQuery("");
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const countLabel =
    `${shown.length} ${shown.length === 1 ? "writeup" : "writeups"}` +
    (filter === "all" ? "" : ` in ${filter}`) +
    (query.trim() ? ` matching “${query.trim()}”` : "");

  return (
    <>
      <Header current="CTF Writeups" />
      <main className="flex-1">
        <section className="wrap pt-12 pb-16 md:pt-16 md:pb-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <p className="kicker mb-5">{"// challenge archive"}</p>
              <h1 className="font-display font-bold leading-[0.95] text-[clamp(3rem,11vw,6.5rem)]">CTF Writeups</h1>
              <p className="mt-6 max-w-xl text-sm text-fg-dim md:text-base">
                Clear Layer8 challenge walkthroughs: the clue that matters, the reasoning that unlocks it, and the security lesson to keep.
              </p>
              <a className="btn btn-solid mt-8 inline-flex" href="#library">&gt; browse_writeups</a>
            </div>
            <InteractiveTerminal script={TERMINAL_SCRIPT} barLabel="layer8@pesu — ~/ctf-writeups" fs={WRITEUP_FS} />
          </div>
        </section>

        <div className="wrap"><div className="rule" /></div>

        <section id="library" className="wrap py-16 md:py-20">
          <span className="tag">field notes</span>
          <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">Find a challenge</h2>
          <p className="mt-2 max-w-2xl text-sm text-fg-dim">Search by author, topic, difficulty, or tag. Press / to focus search.</p>

          <div className="panel mt-8 grid gap-4 p-4 md:p-5">
            <label className="flex items-center gap-2.5 border border-border bg-bg-3 px-3 py-2.5 focus-within:border-accent" htmlFor="writeup-search">
              <span className="text-sm text-accent" aria-hidden>$</span>
              <input id="writeup-search" ref={searchRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="search writeups — press / to focus" autoComplete="off" spellCheck={false} className="min-w-0 flex-1 border-0 bg-transparent text-sm text-fg outline-none placeholder:text-fg-faint" />
            </label>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {CATEGORIES.map((category) => {
                const active = filter === category;
                return <button key={category} type="button" aria-pressed={active} onClick={() => setFilter(category)} className={`border px-2.5 py-1 text-[0.72rem] tracking-[0.1em] lowercase transition-colors ${active ? "border-accent-2 bg-accent-2 font-bold text-bg" : "border-border text-fg-dim hover:text-fg"}`}>{category}</button>;
              })}
            </div>
          </div>

          <p className="mt-4 text-[0.72rem] uppercase tracking-[0.14em] text-fg-faint" aria-live="polite">{countLabel}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((writeup) => <article key={writeup.slug} className="card flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  <span className="tag self-start">{writeup.category}</span>
                  {writeup.event && <span className="tag border-accent text-accent">{writeup.event}</span>}
                </div>
                <span className={`tag border shrink-0 ${difficultyStyle[writeup.difficulty]}`}>{writeup.difficulty}</span>
              </div>
              <h3 className="font-display text-lg font-bold"><Link href={`/ctf-writeups/${writeup.slug}`} className="hover:text-accent">{writeup.title}</Link></h3>
              <p className="text-[0.72rem] text-fg-faint">{writeup.author} · {writeup.readTime} read</p>
              <p className="text-sm text-fg-dim">{writeup.excerpt}</p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-2">{writeup.tags.slice(0, 3).map((tag) => <span key={tag} className="tag">{tag}</span>)}</div>
              <Link href={`/ctf-writeups/${writeup.slug}`} className="border-t border-border pt-3.5 text-xs text-accent">&gt; read_writeup</Link>
            </article>)}
          </div>
          {shown.length === 0 && <p className="mt-6 border border-dashed border-border p-5 text-sm text-fg-dim">No matching writeups. Clear the search or choose another category.</p>}
        </section>
      </main>
      <Footer current="CTF Writeups" />
    </>
  );
}
