import React from "react";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
}

export default function GradientText({
  children,
  className = "",
  colors = ["#a855f7", "#3b82f6", "#ec4899", "#a855f7"], // Roxo, Azul, Rosa, Roxo
  animationSpeed = 8,
  showBorder = false,
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    backgroundSize: "300% 100%",
    animation: `gradient ${animationSpeed}s ease infinite`,
  };

  return (
    <div className={`relative flex max-w-fit flex-row items-center justify-center rounded-[1.25rem] font-medium text-white ${className}`}>
        <style>
            {`
            @keyframes gradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            `}
        </style>
      {showBorder && (
        <div
          className="absolute inset-0 z-0 rounded-[1.25rem] opacity-70"
          style={{
            ...gradientStyle,
            filter: "blur(8px)",
            inset: "-2px",
          }}
        />
      )}
      <div
        className="z-10 bg-transparent"
        style={{
          ...gradientStyle,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {children}
      </div>
    </div>
  );
}