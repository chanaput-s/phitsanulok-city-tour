"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function HeroSection() {
  const ref = useRef(null);
  const { scrollY } = useScroll();

  // LAYER 1: Sky morphing powered by scroll!
  const skyRadius1 = useTransform(scrollY, [0, 1000], ["30%", "60%"]);
  const skyRadius2 = useTransform(scrollY, [0, 1000], ["60%", "30%"]);
  const skyRotate = useTransform(scrollY, [0, 1000], [0, 180]);
  const skyRotateReverse = useTransform(scrollY, [0, 1000], [0, -180]);

  const skyY = useTransform(scrollY, [0, 1000], ["0%", "40%"]);

  // LAYER 2: City parallax
  // The background image moves slightly slower than the scroll
  const cityY = useTransform(scrollY, [0, 1000], ["0%", "20%"]);

  // LAYER 3: Clouds move horizontally on scroll
  const cloud1X = useTransform(scrollY, [0, 1000], [0, 200]);
  const cloud2X = useTransform(scrollY, [0, 1000], [0, -300]);

  return (
    <div ref={ref} className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-sky-50 dark:bg-neutral-950">

      {/* LAYER 1: Scroll-driven Morphing Sky Background */}
      <motion.div style={{ y: skyY }} className="absolute inset-0 w-full h-full opacity-80 dark:opacity-50">
        <motion.div
          style={{
            borderRadius: skyRadius1,
            rotate: skyRotate
          }}
          className="absolute -top-[10%] -left-[10%] w-[80vw] h-[80vw] bg-blue-300 dark:bg-indigo-600 mix-blend-multiply dark:mix-blend-screen blur-[80px]"
        />
        <motion.div
          style={{
            borderRadius: skyRadius2,
            rotate: skyRotateReverse
          }}
          className="absolute top-[10%] -right-[10%] w-[70vw] h-[70vw] bg-amber-200 dark:bg-purple-600 mix-blend-multiply dark:mix-blend-screen blur-[80px]"
        />
      </motion.div>

      {/* LAYER 2: Phitsanulok/City Image with Mask to reveal sky */}
      <motion.div
        className="absolute inset-x-0 bottom-0 w-full h-[120%] bg-cover bg-bottom opacity-100 dark:opacity-90"
        style={{
          backgroundImage: "url('https://www.matichon.co.th/wp-content/uploads/2025/09/news69492_57VMacmklr1756800810.jpg')",
          y: cityY,
          /* CSS Mask fades out the top of the image so the morphing sky shines through */
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 40%, black 100%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 40%, black 100%)"
        }}
      />

      {/* LAYER 2.5: Cinematic Light Rays Filter */}
      <motion.div
        className="absolute inset-x-0 -top-[20%] w-full h-[140%] z-[1] pointer-events-none mix-blend-overlay opacity-70 dark:opacity-30"
        style={{
          background: `
            radial-gradient(circle at 50% 20%, rgba(245, 198, 67, 0.88) 0%, transparent 40%),
            conic-gradient(from 180deg at 50% -10%, transparent 35%, rgba(228, 111, 111, 0.3) 40%, transparent 45%, rgba(255,255,255,0.6) 50%, transparent 55%, rgba(255,255,255,0.2) 60%, transparent 65%)
          `,
          y: cityY
        }}
      />

      {/* LAYER 2.6: Static Lens Flares (Camera Artifacts) */}
      <motion.div
        className="absolute inset-0 z-[2] pointer-events-none overflow-hidden mix-blend-screen opacity-90"
        style={{ y: skyY }}
      >
        <div className="absolute top-[20%] left-[55%] w-[30vw] h-[30vw] bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,transparent_60%)] rounded-full blur-xl" />
        <div className="absolute top-[35%] left-[45%] w-[8vw] h-[8vw] border-[2px] border-amber-200/40 bg-amber-100/10 rounded-full blur-[1px]" />
        <div className="absolute top-[45%] left-[40%] w-[12vw] h-[12vw] border border-blue-300/30 bg-blue-200/10 rounded-full blur-[1px]" />
        <div className="absolute top-[55%] left-[35%] w-[4vw] h-[4vw] bg-pink-300/30 rounded-full blur-[2px]" />
        <div className="absolute top-[65%] left-[30%] w-[6vw] h-[6vw] border border-emerald-300/20 bg-emerald-200/10 rounded-full blur-[1px]" />
      </motion.div>

      {/* Overlay gradient to make text readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/80 dark:via-black/50 dark:to-neutral-950"></div>

      {/* LAYER 3: Animated Clouds using framer-motion (Parallax + Continuous) */}
      <motion.div
        style={{ x: cloud1X }}
        className="absolute top-[15%] left-[10%] w-[300px] h-[100px] bg-white/60 dark:bg-white/10 blur-[60px] rounded-full"
      />
      <motion.div
        animate={{ x: [0, -50, 0] }}
        transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
        style={{ x: cloud2X }}
        className="absolute top-[30%] right-[10%] w-[400px] h-[150px] bg-white/50 dark:bg-white/10 blur-[70px] rounded-full"
      />
      <motion.div
        // Continuous horizontal floating
        animate={{ x: [0, 80, 0] }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
        className="absolute top-[60%] left-[25%] w-[250px] h-[80px] bg-white/40 dark:bg-white/5 blur-[50px] rounded-full"
      />
    </div>
  );
}
