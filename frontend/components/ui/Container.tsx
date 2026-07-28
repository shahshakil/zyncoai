import type * as React from "react";
import { SITE_MAX_W, SITE_PX } from "./layout";

export default function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full ${SITE_MAX_W} ${SITE_PX} ${className}`}>
      {children}
    </div>
  );
}
