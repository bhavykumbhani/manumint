import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon";
  size?: "sm" | "md" | "lg" | "xl";
  withLink?: boolean;
}

const sizeConfig = {
  sm: { icon: "w-7 h-7", text: "text-base", subtext: "text-[8px]", iconSvg: 28 },
  md: { icon: "w-9 h-9", text: "text-lg", subtext: "text-[9px]", iconSvg: 36 },
  lg: { icon: "w-11 h-11", text: "text-2xl", subtext: "text-[10px]", iconSvg: 44 },
  xl: { icon: "w-14 h-14", text: "text-3xl", subtext: "text-xs", iconSvg: 56 },
};

export function ManuMakerIcon({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div
      className={`relative rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-1.5 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:shadow-emerald-600/30 transition-shadow shrink-0 ${className}`}
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="mm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E6FFFA" />
          </linearGradient>
          <linearGradient id="mm-accent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* QR Code Style Corner Brackets */}
        <path
          d="M6 13V8C6 6.89543 6.89543 6 8 6H13"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />
        <path
          d="M27 6H32C33.1046 6 34 6.89543 34 8V13"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />
        <path
          d="M34 27V32C34 33.1046 33.1046 34 32 34H27"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />
        <path
          d="M13 34H8C6.89543 34 6 33.1046 6 32V27"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />

        {/* Dynamic Stylized 'M' Monogram fused with Restaurant Cloche Arch */}
        {/* Left Column */}
        <path
          d="M12 28V14C12 13.4477 12.4477 13 13 13H14C14.5523 13 15 13.4477 15 14V28"
          stroke="url(#mm-grad)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* Center M-Peaks & Arch */}
        <path
          d="M14 15L20 22L26 15"
          stroke="url(#mm-grad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Column */}
        <path
          d="M25 14C25 13.4477 25.4477 13 26 13H27C27.5523 13 28 13.4477 28 14V28"
          stroke="url(#mm-grad)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* Cloche Accent Spark / Golden Chef Dome Pip */}
        <circle cx="20" cy="11" r="2.2" fill="url(#mm-accent)" />
      </svg>
    </div>
  );
}

export function Logo({
  className = "",
  variant = "full",
  size = "md",
  withLink = true,
}: LogoProps) {
  const cfg = sizeConfig[size] || sizeConfig.md;

  const content = (
    <div className={`group flex items-center gap-2.5 select-none ${className}`}>
      <ManuMakerIcon className={cfg.icon} />
      {variant === "full" && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center tracking-tight leading-tight">
            <span className={`${cfg.text} font-black text-zinc-950 dark:text-white`}>Manu</span>
            <span className={`${cfg.text} font-black text-emerald-600 dark:text-emerald-400 ml-0.5`}>
              Maker
            </span>
          </div>
          <span
            className={`${cfg.subtext} font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400/90 -mt-0.5`}
          >
            One QR • Zero Apps
          </span>
        </div>
      )}
    </div>
  );

  if (withLink) {
    return (
      <Link href="/" className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
