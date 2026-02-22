import { useEffect, useState } from "react";

interface ProbabilityGaugeProps {
  value: number; // 0-1
  label: string;
  variant: 'danger' | 'success' | 'warning';
  size?: number;
}

const VARIANT_CLASSES = {
  danger: 'stroke-destructive',
  success: 'stroke-accent',
  warning: 'stroke-warning',
};

const VARIANT_TEXT = {
  danger: 'text-destructive',
  success: 'text-accent',
  warning: 'text-warning',
};

export function ProbabilityGauge({ value, label, variant, size = 140 }: ProbabilityGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - animatedValue * circumference;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            className="stroke-muted"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            className={VARIANT_CLASSES[variant]}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold font-mono ${VARIANT_TEXT[variant]}`}>
            {(animatedValue * 100).toFixed(1)}%
          </span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
}
