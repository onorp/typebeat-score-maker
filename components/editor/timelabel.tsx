"use client";

import { useRef } from "react";

import InnerTimelabel from "@/components/editor/inner-timelabel";

export default function Timelabel() {
  const divRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={divRef} className={"sticky left-0 w-full"}>
      <InnerTimelabel
        width={
          divRef.current ? divRef.current.getBoundingClientRect().width : 100
        }
      />
    </div>
  );
}
