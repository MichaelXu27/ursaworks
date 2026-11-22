import React, { useContext } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import ScrollContainerContext from '../configs/ScrollContainerContext';
import stars from '../assets/logoItems/bear-walk-in-place.svg';
import '../styles/heroStyle.css';

export default function Hero() {
    const containerRef = useContext(ScrollContainerContext);
    const reducedMotion = useReducedMotion();

    // The app scrolls inside .container, not the window; scrub the hero's
    // exit over the first ~70vh of that container's scroll.
    const { scrollY } = useScroll({ container: containerRef });
    const exitRange = typeof window !== 'undefined' ? window.innerHeight * 0.7 : 500;
    const opacity = useTransform(scrollY, [0, exitRange], [1, 0]);
    const scale = useTransform(scrollY, [0, exitRange], [1, 0.96]);
    const y = useTransform(scrollY, [0, exitRange], [0, -40]);
    const hintOpacity = useTransform(scrollY, [0, exitRange * 0.15], [1, 0]);

    const riseIn = {
        hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 100, damping: 20 },
        },
    };

    return (
        <motion.div
            className="hero"
            style={reducedMotion ? { opacity, pointerEvents: 'none' } : { opacity, scale, y, pointerEvents: 'none' }}
        >
            <motion.div
                className="heroContent"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            >
                <motion.img src={stars} className="stars" alt="Stars" variants={riseIn} />
                <motion.h1 className="title" variants={riseIn}>
                    URSAWORKS
                </motion.h1>
                <motion.h2 className="subtitle" variants={riseIn}>
                    AT WASHINGTON UNIVERSITY IN ST. LOUIS
                </motion.h2>
            </motion.div>
            <motion.div className="scrollHint" style={{ opacity: hintOpacity }} aria-hidden="true">
                <motion.span
                    className="scrollHintChevron"
                    animate={reducedMotion ? undefined : { y: [0, 8, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M4 9l8 7 8-7"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </motion.span>
            </motion.div>
        </motion.div>
    );
}
