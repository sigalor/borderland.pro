import React from "react";

export default function Heading({ children }: { children: React.ReactNode }) {
  return <h1 className="text-2xl font-bold mb-3">{children}</h1>;
}
