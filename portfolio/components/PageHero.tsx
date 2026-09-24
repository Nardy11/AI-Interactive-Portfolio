"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import styles from "./PageHero.module.css";

/**
 * One hero template for every page.
 *
 * The shape is always the same — eyebrow, headline, lead, actions on the left;
 * a framed visual on the right. The frame is the site's signature: the corner
 * brackets and the mono readout are the vocabulary of the computer-vision mode
 * that this portfolio is built around, so every page is "detected" the same way.
 *
 * Pages supply only their own content.
 */

/** Built-in scenes. Each one is drawn in CSS, so no hero depends on a remote image. */
export type HeroScene = "portrait" | "skyline" | "terminal" | "ridge" | "constellation" | "globe";

export type HeroFact = { icon: LucideIcon; title: string; lines: ReactNode };
export type HeroStat = { value: string; label: string };
export type HeroMark = { icon: LucideIcon; label: ReactNode };

export type PageHeroProps = {
  /** Small mono label above the headline. */
  eyebrow: string;
  /** Headline. Wrap the accented words in <em> to pick up the gradient. */
  title: ReactNode;
  /** One or two sentences. Keep it short — the sections below carry the detail. */
  lead: ReactNode;
  /** Buttons. Use the exported HeroPrimary / HeroGhost so every page matches. */
  actions?: ReactNode;
  /** Numbers under the lead (landing page). */
  stats?: HeroStat[];
  /** Icon + label row under the lead (contact page). */
  marks?: HeroMark[];
  /** Cards stacked beside the visual (experience page). */
  facts?: HeroFact[];
  /** Pull quote, pinned inside the frame. */
  quote?: { text: ReactNode; author: string };
  /** Handwritten-style aside, pinned to the top of the frame. */
  note?: ReactNode;
  /** The scene drawn inside the frame. */
  scene: HeroScene;
  /** Optional cut-out photo laid over the scene. */
  portrait?: { src: string; alt: string; priority?: boolean };
  /** Mono readout printed on the frame, e.g. "about · 01". */
  readout: string;
};

/** Scene name -> class. Kept explicit so a scene can never collide with another class. */
const SCENES: Record<HeroScene, string> = {
  portrait: styles.portrait_scene,
  skyline: styles.skyline,
  terminal: styles.terminal,
  ridge: styles.ridge,
  constellation: styles.constellation,
  globe: styles.globe,
};

export function HeroPrimary({ children, href, external, download }: { children: ReactNode; href: string; external?: boolean; download?: boolean }) {
  return (
    <a className={styles.primary} href={href} {...(external || download ? { target: "_blank", rel: "noreferrer" } : {})}>
      {children}
    </a>
  );
}

export function HeroGhost({ children, href, external }: { children: ReactNode; href: string; external?: boolean }) {
  return (
    <a className={styles.ghost} href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
      {children}
    </a>
  );
}

export default function PageHero({
  eyebrow, title, lead, actions, stats, marks, facts, quote, note, scene, portrait, readout,
}: PageHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.lead}>{lead}</p>

          {actions && <div className={styles.actions}>{actions}</div>}

          {stats && (
            <dl className={styles.stats}>
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.value}</dt>
                  <dd>{stat.label}</dd>
                </div>
              ))}
            </dl>
          )}

          {marks && (
            <ul className={styles.marks}>
              {marks.map((mark, index) => {
                const Icon = mark.icon;
                return <li key={index}><Icon aria-hidden="true" />{mark.label}</li>;
              })}
            </ul>
          )}
        </div>

        <div className={styles.frame}>
          <div className={`${styles.scene} ${SCENES[scene]}`} aria-hidden="true" />

          {portrait && (
            <Image
              className={styles.portrait}
              src={portrait.src}
              alt={portrait.alt}
              width={520}
              height={520}
              priority={portrait.priority}
            />
          )}

          <span className={styles.readout} aria-hidden="true">{readout}</span>

          {note && <p className={styles.note}>{note}</p>}

          {quote && (
            <figure className={styles.quote}>
              <blockquote>{quote.text}</blockquote>
              <figcaption>{quote.author}</figcaption>
            </figure>
          )}
        </div>

        {facts && (
          <ul className={styles.facts}>
            {facts.map((fact) => {
              const Icon = fact.icon;
              return (
                <li key={fact.title}>
                  <Icon aria-hidden="true" />
                  <div>
                    <b>{fact.title}</b>
                    <span>{fact.lines}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
