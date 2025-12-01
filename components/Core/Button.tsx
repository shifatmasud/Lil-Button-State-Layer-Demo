import React, { useState, useRef } from 'react';
import type { CSSProperties, MouseEvent, TouchEvent, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { StateLayer } from './StateLayer.tsx';

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    theme: any; 
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, theme }) => {
    const [isActive, setIsActive] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [size, setSize] = useState({ width: 0, height: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);

    // --- Interaction Logic (The Brains) ---
    // We track where the user interacts to tell the StateLayer where to grow from.
    const updateMousePosition = (clientX: number, clientY: number) => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMousePosition({ x: clientX - rect.left, y: clientY - rect.top });
            setSize({ width: rect.width, height: rect.height });
        }
    };

    const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
        updateMousePosition(e.clientX, e.clientY);
    };

    const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
        updateMousePosition(e.clientX, e.clientY);
        setIsActive(true);
    };

    const handleMouseLeave = () => {
        setIsActive(false);
    };

    const handleTouchStart = (e: TouchEvent<HTMLButtonElement>) => {
        if (e.touches[0]) {
            updateMousePosition(e.touches[0].clientX, e.touches[0].clientY);
        }
        setIsActive(true);
    };

    const handleTouchEnd = () => {
        setIsActive(false);
    };

    // --- Styles ---
    const buttonStyle: CSSProperties = {
        position: 'relative',
        padding: `${theme.space.xs} ${theme.space.s}`,
        backgroundColor: theme.colors['Color/Primary/Surface/1'],
        color: theme.colors['Color/Primary/Content/1'],
        border: 'none',
        borderRadius: '9999px',
        cursor: 'pointer',
        overflow: 'hidden', // Essential: Clips the StateLayer inside the button shape
        outline: 'none',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        ...theme.typography.label.l,
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    };

    const textStyle: CSSProperties = {
        position: 'relative',
        zIndex: 2, // Keeps text above the StateLayer
        pointerEvents: 'none',
    };

    return (
        <motion.button
            ref={buttonRef}
            style={buttonStyle}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
            <span style={textStyle}>{children}</span>
            
            {/* 
              The isolated StateLayer component. 
              It handles the visual ripple effect based on the state we pass it.
            */}
            <StateLayer 
                theme={theme}
                isActive={isActive}
                x={mousePosition.x}
                y={mousePosition.y}
                width={size.width}
                height={size.height}
            />
        </motion.button>
    );
};