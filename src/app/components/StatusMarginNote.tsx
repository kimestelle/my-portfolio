'use client';

import { motion, useReducedMotion } from 'framer-motion';

const STATUS_ITEMS = [
  'Frontend SWE intern @ PayPal',
  'CS + Computer Graphics @ UPenn',
  'available august 2026 · full-time',
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.16,
      staggerChildren: 0.11,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 6,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.56,
      ease: [0.22, 0.7, 0.25, 1] as const,
    },
  },
};

export function StatusMarginNote() {
  const reducedMotion = useReducedMotion();

  return (
    <aside
      aria-label="Current status"
      className="border-t border-[color:var(--line-color)] pt-5 md:relative md:mb-1 md:border-t-0 md:pb-1 md:pl-7 md:pt-0 md:before:absolute md:before:bottom-1 md:before:left-0 md:before:top-1 md:before:w-px md:before:bg-[color:var(--line-color)]"
    >
      <motion.div
        variants={containerVariants}
        initial={reducedMotion ? false : 'hidden'}
        animate="visible"
      >
        {/* <motion.p
          variants={itemVariants}
          className="type-meta text-[color:var(--text-meta)]"
        >
          currently
        </motion.p> */}

        <ul className="mt-3 flex flex-col gap-2.5 text-[0.95rem] leading-snug text-[color:var(--text-secondary)]">
          {STATUS_ITEMS.map((item) => (
            <motion.li key={item} variants={itemVariants}>
              {item}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </aside>
  );
}
