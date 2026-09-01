"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

interface BackdropProps {
    isOpen: boolean;
    onClick?: () => void;
    className?: string;
    duration?: number;
}

function Backdrop({ isOpen, onClick, className = "", duration = 300 }: BackdropProps) {
    const [mounted, setMounted] = useState(false);

    const [render, setRender] = useState(isOpen);
    const [animate, setAnimate] = useState(isOpen);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setRender(true);
            const timer = setTimeout(() => setAnimate(true), 10);
            return () => clearTimeout(timer);
        } else {
            setAnimate(false);
            const timer = setTimeout(() => setRender(false), duration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, duration]);

    useEffect(() => {
        if (!mounted) return;

        if (isOpen) {
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            document.body.style.overflow = "hidden";
        } else {
            const timer = setTimeout(() => {
                document.body.style.paddingRight = "0px";
                document.body.style.overflow = "unset";
            }, duration);
            return () => clearTimeout(timer);
        }

        return () => {
            document.body.style.paddingRight = "0px";
            document.body.style.overflow = "unset";
        };
    }, [isOpen, mounted, duration]);

    if (!mounted || !render) return null;

    return createPortal(
        <div
            className={twMerge(
                ["fixed", "inset-0", "z-40"],
                ["bg-slate-900/30", "backdrop-blur-sm"],
                ["transition-opacity", "ease-in-out"],
                [animate ? "opacity-100" : "opacity-0"],
                [className],
            )}
            style={{ transitionDuration: `${duration}ms` }}
            onClick={onClick}
            aria-hidden="true"
        />,
        document.body,
    );
}

export default Backdrop;
