import type { SVGProps } from 'react';

export function LexAiLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 24"
      fill="none"
      aria-label="LexAI Logo"
      {...props}
    >
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="Space Grotesk, sans-serif"
        fontSize="18"
        fontWeight="bold"
        fill="hsl(var(--primary))"
      >
        LexAI
      </text>
    </svg>
  );
}
