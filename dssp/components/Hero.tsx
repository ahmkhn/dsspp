"use client";
import { motion } from "framer-motion";
import { HeroHighlight } from "./ui/hero-highlight";
import { Highlight } from "./ui/hero-highlight";

export function HeroHighlightDemo() {
  return (
    <HeroHighlight className="flex justify-center -mt-26">
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-1xl px-4 text-center md:text-4xl lg:text-5xl font-bold text-gray-300 max-w-5xl !leading-tight text-base mx-auto "
      >
        Decolonization of Social Sciences in{" "}

        <Highlight className="text-green-500">
          Pakistan
        </Highlight>
        <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4 !text-1xl" />

        An application that fosters a global community where users can{' '}
        <Highlight className="text-green-500">
          share their research and collaborate&nbsp;
        </Highlight>
        promoting a sense of unity and mutual support
      </motion.h1>
    </HeroHighlight>
  );
}
