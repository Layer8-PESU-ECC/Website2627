import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header } from "../../_components/site-chrome";
import { renderMarkdown } from "@/lib/markdown";
import { difficultyStyle, WRITEUPS } from "../writeups";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return WRITEUPS.map((writeup) => ({ slug: writeup.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const writeup = WRITEUPS.find((item) => item.slug === slug);
  if (!writeup) return {};
  return {
    title: `${writeup.title} · Layer8 CTF Writeups`,
    description: writeup.excerpt,
  };
}

export default async function CtfWriteupPage({ params }: Params) {
  const { slug } = await params;
  const writeup = WRITEUPS.find((item) => item.slug === slug);
  if (!writeup) notFound();

  const markdown = await readFile(
    path.join(process.cwd(), "src/content/ctf-writeups", `${slug}.md`),
    "utf8",
  );

  return (
    <>
      <Header current="CTF Writeups" />
      <main className="flex-1">
        <article className="wrap max-w-[52rem] pt-12 pb-20 md:pt-16">
          <Link href="/ctf-writeups" className="text-xs text-accent">&lt; back_to_ctf_writeups</Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="tag">{writeup.category}</span>
            <span className={`tag border ${difficultyStyle[writeup.difficulty]}`}>{writeup.difficulty}</span>
          </div>
          <h1 className="mt-3 font-display font-bold leading-[1.1] text-[clamp(1.9rem,5vw,2.8rem)]">{writeup.title}</h1>
          <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-fg-faint">
            <span>{writeup.author}</span><span aria-hidden>·</span><span>{writeup.readTime} read</span>
          </div>
          <div className="rule my-8" />
          <div className="article-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }} />
          <div className="mt-12 flex flex-wrap gap-2">{writeup.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}</div>
          <a
            className="btn btn-solid mt-8 inline-flex"
            href={`/ctf-writeups/${writeup.slug}-materials.zip`}
            download
          >
            &gt; download_challenge_materials
          </a>
        </article>
      </main>
      <Footer current="CTF Writeups" />
    </>
  );
}
