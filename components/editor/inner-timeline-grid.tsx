import { useEffect, useRef } from "react";
import { useAtomValue } from "jotai/index";

import { loadedSong, scroll, snapGrid, zoom } from "@/jotai/handle";

export default function InnerTimelineGrid({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const song = useAtomValue(loadedSong);
  const nowZoom = useAtomValue(zoom);
  const nowScroll = useAtomValue(scroll);
  const nowSnapGrid = useAtomValue(snapGrid);
  const getContext = (): CanvasRenderingContext2D | null => {
    const canvas: any = canvasRef.current;

    if (!canvas || !canvas.getContext) return null;

    return canvas.getContext("2d");
  };

  useEffect(() => {
    const context = getContext();
    const width = canvasRef.current?.width;

    if (!context || !width || !song || !nowSnapGrid) return;
    context.clearRect(0, 0, width, height);

    const bpm = song.bpm;
    const grid = Number([...nowSnapGrid][0]);
    let gridSplit = 4 / grid;

    if (grid == 3) {
      gridSplit = 1 / 3;
    }
    const secondsPerBeat = (60 / bpm) * gridSplit;
    const pixelsPerBeat = secondsPerBeat * nowZoom;

    for (let i = 0; i <= Math.floor(width / pixelsPerBeat) + 1; i++) {
      const x = i * pixelsPerBeat - (nowScroll % pixelsPerBeat);
      const rect = new Path2D();

      rect.rect(x, 0, 1, height);
      context.beginPath();
      context.fillStyle = "#333";
      context.fill(rect);
    }
  }, [nowZoom, nowScroll, song, nowSnapGrid]);

  return (
    <canvas ref={canvasRef} className={""} height={height} width={width} />
  );
}
