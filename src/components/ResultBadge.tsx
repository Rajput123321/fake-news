import { Shield, ShieldAlert, ShieldQuestion } from "lucide-react";

interface ResultBadgeProps {
  prediction: 'real' | 'fake' | 'uncertain';
  confidence: number;
}

const CONFIG = {
  real: {
    icon: Shield,
    label: 'Likely Real',
    className: 'gradient-success',
    desc: 'This content shows indicators of credible reporting.',
  },
  fake: {
    icon: ShieldAlert,
    label: 'Likely Fake',
    className: 'gradient-danger',
    desc: 'This content shows patterns commonly found in misinformation.',
  },
  uncertain: {
    icon: ShieldQuestion,
    label: 'Uncertain',
    className: 'gradient-warning',
    desc: 'Not enough signal to classify with confidence.',
  },
};

export function ResultBadge({ prediction, confidence }: ResultBadgeProps) {
  const { icon: Icon, label, className, desc } = CONFIG[prediction];

  return (
    <div className={`${className} rounded-xl p-6 text-center`}>
      <Icon className="mx-auto mb-3 h-12 w-12 text-primary-foreground" />
      <h3 className="text-2xl font-bold text-primary-foreground">{label}</h3>
      <p className="mt-1 text-sm text-primary-foreground/80">
        Confidence: {(confidence * 100).toFixed(1)}%
      </p>
      <p className="mt-2 text-sm text-primary-foreground/70">{desc}</p>
    </div>
  );
}
