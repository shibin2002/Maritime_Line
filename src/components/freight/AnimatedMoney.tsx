"use client";

import { animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { formatUsd } from "@/lib/format";

export function AnimatedMoney({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    const controls = animate(from, value, {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(latest) {
        setDisplay(latest);
      },
    });
    prev.current = value;
    return () => controls.stop();
  }, [value]);

  return <span className={className}>{formatUsd(display)}</span>;
}
