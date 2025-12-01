import React from 'react';
import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';

/**
 * ----------------------------------------------------------------------
 * 🔮 THE STATE LAYER (Interactive Soul of the UI)
 * ----------------------------------------------------------------------
 *
 * 🟢 WHAT IS IT? (TLDR)
 * It's a shape-shifting invisible ghost that sits on top of interactive elements.
 * When you touch it, it wakes up, turns into a circle, and grows.
 *
 * 🟡 WHY DO WE NEED IT? (ELI5)
 * Imagine throwing a pebble into a still pond. You see ripples, right?
 * That ripple tells you exactly where the pebble hit.
 * This layer is that ripple. It tells your brain: "Yes, I felt your touch right HERE."
 * Without it, screens feel like dead glass. With it, they feel alive.
 *
 * 🔵 HOW DOES IT WORK? (Plain English)
 * 1. It sits absolutely positioned inside the parent (Button).
 * 2. It tracks your mouse/finger coordinates (x, y) passed down from the parent.
 * 3. When the parent says "I'm active" (hover/press), this layer expands from that exact point.
 * 4. It fills the button with a subtle tint, respecting the parent's boundaries.
 *
 * 🔴 ENGINEERING SECRETS (Under the Hood)
 * 1. The Hypotenuse Hack: To ensure the circle covers the *entire* rectangular button
 *    even from the furthest corner, we don't just use width=100%. We calculate the
 *    diameter using the Pythagorean theorem (Math.hypot(width, height) * 2).
 *    If we didn't, the corners would remain untouched during the animation.
 * 2. Pointer Events None: We set `pointerEvents: 'none'` so this layer never steals
 *    clicks from the actual button underneath. It is purely decorative.
 * 3. GPU Acceleration: We use Framer Motion to animate properties like `width` and `height`.
 *    Ideally, strictly `scale` and `opacity` are better for performance, but animating
 *    layout properties on small elements is acceptable for this specific "grow from point" effect.
 * ----------------------------------------------------------------------
 */

interface StateLayerProps {
    theme: any;
    isActive: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
}

export const StateLayer: React.FC<StateLayerProps> = ({ theme, isActive, x, y, width, height }) => {
    // Secret #1: Calculate the diameter needed to cover the button from any point
    // We multiply by 2 to ensure the radius reaches the furthest corner relative to the cursor
    const maxDiameter = Math.hypot(width, height) * 2;

    const layerStyle: CSSProperties = {
        position: 'absolute',
        top: y,
        left: x,
        backgroundColor: theme.colors['Color/Primary/Content/1'],
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none', // Secret #2: Pass clicks through to the button
        zIndex: 1,
        opacity: 0.1, // Visual rule: 10% opacity for state layer
    };

    return (
        <motion.div
            style={layerStyle}
            initial={false}
            animate={{
                width: isActive ? maxDiameter : 0,
                height: isActive ? maxDiameter : 0,
            }}
            transition={{
                type: 'spring',
                stiffness: 100,
                damping: 20,
                mass: 1,
            }}
        />
    );
};