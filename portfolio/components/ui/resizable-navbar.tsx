"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import React, { useRef } from "react";

interface NavbarProps {
    children: React.ReactNode;
    className?: string;
}

interface NavBodyProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface NavItemsProps {
    items: {
        name: string;
        link: string;
    }[];
    className?: string;
    onItemClick?: () => void;
}

// MAIN NAVBAR
export const Navbar = ({ children, className }: NavbarProps) => {
    const ref = useRef<HTMLDivElement>(null);

    return (
        <motion.div
            ref={ref}
            className={cn(
                "sticky inset-x-0 top-28 z-40 w-full", // lowered navbar
                className
            )}
        >
            {React.Children.map(children, (child) =>
                React.isValidElement(child)
                    ? React.cloneElement(
                        child as React.ReactElement<{ visible?: boolean }>,
                        { visible: true } // always visible
                    )
                    : child
            )}
        </motion.div>
    );
};

// NAV BODY
export const NavBody = ({ children, className }: NavBodyProps) => {
    return (
        <motion.div
            className={cn(
                "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-4 py-2 lg:flex dark:bg-transparent",
                className
            )}
        >
            {children}
        </motion.div>
    );
};

// NAV ITEMS
export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
    return (
        <div
            className={cn(
                "flex-1 hidden lg:flex flex-row items-center justify-center space-x-4 text-sm font-medium text-zinc-600 dark:text-neutral-50",
                className
            )}
        >
            {items.map((item, idx) => (
                <a
                    key={idx}
                    href={item.link}
                    onClick={onItemClick}
                    className="px-4 py-2 relative z-10 hover:text-zinc-800 dark:hover:text-neutral-300"
                >
                    {item.name}
                </a>
            ))}
        </div>
    );
};

// MOBILE NAV (simplified)
export const MobileNav = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div
        className={cn(
            "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-2 lg:hidden",
            className
        )}
    >
        {children}
    </div>
);

// MOBILE NAV TOGGLE
export const MobileNavToggle = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => {
    return <button onClick={onClick}>{isOpen ? "Close" : "Menu"}</button>;
};

// NAVBAR LOGO (empty, logo removed)
export const NavbarLogo = () => {
    return <a href="#" className="relative z-20 mr-4 flex items-center px-2 py-1">{/* logo removed */}</a>;
};

interface MobileNavMenuProps { children: React.ReactNode; className?: string; isOpen: boolean; onClose: () => void; }

interface MobileNavHeaderProps { children: React.ReactNode; className?: string; }

export const MobileNavMenu = ({ children, className, isOpen, onClose, }: MobileNavMenuProps) => { return (<AnimatePresence> {isOpen && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={cn("absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-white px-4 py-8 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] dark:bg-neutral-950", className,)} > {children} </motion.div>)} </AnimatePresence>); };

export const MobileNavHeader = ({ children, className, }: MobileNavHeaderProps) => { return (<div className={cn("flex w-full flex-row items-center justify-between", className,)} > {children} </div>); };

export const NavbarButton = ({
    href,
    as: Tag = "a",
    children,
    className,
    variant = "primary",
    ...props
}: {
    href?: string;
    as?: React.ElementType;
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
        | React.ComponentPropsWithoutRef<"a">
        | React.ComponentPropsWithoutRef<"button">
    )) => {
    const baseStyles =
        "px-4 py-2 rounded-md bg-white button bg-white text-black text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center";

    const variantStyles = {
        primary:
            "shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
        secondary: "bg-transparent shadow-none dark:text-white",
        dark: "bg-black text-white shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
        gradient:
            "bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]",
    };

    return (
        <Tag
            href={href || undefined}
            className={cn(baseStyles, variantStyles[variant], className)}
            {...props}
        >
            {children}
        </Tag>
    );
};
