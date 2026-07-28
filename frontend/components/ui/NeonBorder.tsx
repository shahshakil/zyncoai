import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function NeonBorder({ children, className = "" }: Props) {
  return (
    <div className={`neo-frame ${className}`}>
      <div className="neo-inner">{children}</div>
    </div>
  );
}
