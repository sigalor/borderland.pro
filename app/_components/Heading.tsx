import React from "react";
import { clsx } from "clsx";

export default function Heading({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1 className={clsx("text-2xl mb-3 font-bold", className)} {...props}>
      {children}
    </h1>
  );
}
