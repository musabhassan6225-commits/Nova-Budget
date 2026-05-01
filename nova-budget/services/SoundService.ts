"use client";

import { Howl } from "howler";

const sounds = {
  crunch: new Howl({ src: ["/sounds/crunch.mp3"], volume: 0.4, preload: true }),
  shimmer: new Howl({ src: ["/sounds/shimmer.mp3"], volume: 0.5, preload: true }),
  "neutral-pop": new Howl({ src: ["/sounds/neutral-pop.mp3"], volume: 0.3, preload: true }),
  click: new Howl({ src: ["/sounds/click.mp3"], volume: 0.25, preload: true }),
};

type SoundKey = keyof typeof sounds;

export const SoundService = {
  play(key: SoundKey) {
    sounds[key]?.play();
  },
  /** Transaction added */
  crunch() {
    this.play("crunch");
  },
  /** Savings goal met */
  shimmer() {
    this.play("shimmer");
  },
  /** Navigation / UI interaction */
  pop() { this.play("neutral-pop"); },
  /** Budget slider / limit adjustment */
  click() { this.play("click"); },
};
