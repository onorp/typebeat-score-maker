import { useRef } from "react";

import InnerTimelineGrid from "@/components/editor/inner-timeline-grid";

export default function TimelineGrid() {
  const divRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={divRef}
      className={"sticky right-0 w-full h-full"}
    >
      <InnerTimelineGrid
        height={
          divRef.current ? divRef.current.getBoundingClientRect().height : 100
        }
        width={
          divRef.current ? divRef.current.getBoundingClientRect().width : 100
        }
      />
    </div>
  );
}