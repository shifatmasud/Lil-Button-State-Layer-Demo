import React, { useState, useRef } from 'react';
import type { CSSProperties, MouseEvent, TouchEvent, ReactNode } from 'react';
import { motion } from 'framer-motion';

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

    const updateMousePosition = (clientX: number, clientY: number) => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMousePosition({ x: clientX - rect.left, y: clientY - rect.top });
            setSize({ width: rect.width, height: rect.height });
        }
    };

    // --- Event Handlers ---
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

    // Styles
    const buttonStyle: CSSProperties = {
        position: 'relative',
        padding: `${theme.space.xs} ${theme.space.s}`,
        backgroundColor: theme.colors['Color/Primary/Surface/1'],
        color: theme.colors['Color/Primary/Content/1'],
        border: 'none',
        borderRadius: '9999px',
        cursor: 'pointer',
        overflow: 'hidden',
        outline: 'none',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        ...theme.typography.label.l,
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    };

    const textStyle: CSSProperties = {
        position: 'relative',
        zIndex: 2,
        pointerEvents: 'none',
    };
    
    // Calculate the diameter needed to cover the button from any point
    const maxDiameter = Math.hypot(size.width, size.height) * 2;
    
    const stateLayerStyle: CSSProperties = {
        position: 'absolute',
        top: mousePosition.y,
        left: mousePosition.x,
        backgroundColor: theme.colors['Color/Primary/Content/1'],
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.1,
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
            <motion.div
                style={stateLayerStyle}
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
        </motion.button>
    );
};
