"use client";
import { motion } from "framer-motion";
import { HeroHighlight } from "./ui/hero-highlight";
import { Highlight } from "./ui/hero-highlight";

export function HeroHighlightDemo() {
  return (
    <HeroHighlight className="flex justify-center -mt-26 px-4 md:px-8">
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
        className="text-center font-black !leading-tight text-sm sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl overflow-hidden whitespace-pre-wrap"
      >
        Decolonization of Social Sciences in{" "}
        <Highlight className="text-green-500">Pakistan</Highlight>
        <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4 !text-1xl" />
        A platform for a global community to share{" "}
        <Highlight className="text-green-500">research&nbsp;</Highlight>
        and&nbsp;
        <Highlight className="text-green-500">collaborate&nbsp;</Highlight>
        fostering&nbsp;
        <Highlight className="text-green-500">unity&nbsp;</Highlight>
        and&nbsp;
        <Highlight className="text-green-500">mutual support.&nbsp;</Highlight>
      </motion.h1>
    </HeroHighlight>
  );
}
