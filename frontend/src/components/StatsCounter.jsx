import { useState, useEffect } from 'react';

export default function StatsCounter({ value, label, icon }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setDisplayValue(0);
      return;
    }

    const duration = 1000;
    const steps = 30;
    const stepTime = duration / steps;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), value);
      setDisplayValue(current);
      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="text-center bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-center mb-3">
        {icon}
      </div>
      <div className="text-4xl font-bold text-primary mb-2">
        {displayValue}
      </div>
      <div className="text-gray-600 font-medium">
        {label}
      </div>
    </div>
  );
}
