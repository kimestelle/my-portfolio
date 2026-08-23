'use client';

import { motion, useReducedMotion } from 'framer-motion';

const STATUS_ITEMS = [
  'CS + Computer Graphics @ UPenn',
  'prev. Frontend Intern @ PayPal',
  'open to new opportunities!',
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
      className="border-t border-[color:var(--line-color)] pt-4 md:relative md:mb-1 md:border-t-0 md:pb-1 md:pl-7 md:pt-0 md:before:absolute md:before:bottom-1 md:before:left-0 md:before:top-1 md:before:w-px md:before:bg-[color:var(--line-color)]"
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

        <ul className="flex flex-col gap-1.5 text-[0.9rem] leading-snug text-[color:var(--text-secondary)] md:mt-3 md:gap-2.5 md:text-[0.95rem]">
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
