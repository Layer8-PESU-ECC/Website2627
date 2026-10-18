"use client";

import { ScrambleText } from "../_components/scramble-text";
import { Header, Footer } from "../_components/site-chrome";

export default function RecruitmentsClosedClient() {
  return (
    <>
      <Header current="Recruitments" />

      <main className="flex-1 grid place-items-center">
        <section className="wrap py-10 md:py-14 text-center">
          <p className="kicker mb-6">{"// ~/recruitments"}</p>

          <h1 className="font-mono font-bold uppercase tracking-[0.18em] text-accent glow leading-none break-words text-[clamp(2rem,9vw,5rem)]">
            <ScrambleText text="RECRUITMENT OVER" decryptStepMs={60} />
          </h1>

          <p className="mt-8 text-sm md:text-base text-fg-dim max-w-md mx-auto">
            Recruitment for this round is over. Thanks to everyone who
            applied — follow Layer8 for the next round.
          </p>
        </section>
      </main>

      <Footer current="Recruitments" />
    </>
  );
}
