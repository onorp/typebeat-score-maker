"use client";

import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";

import { loadedSong, scroll, zoom } from "@/jotai/handle";

export default function InnerTimelabel({ width }: { width: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nowZoom = useAtomValue(zoom);
  const nowScroll = useAtomValue(scroll);
  const song = useAtomValue(loadedSong);

  const getContext = (): CanvasRenderingContext2D | null => {
    const canvas: any = canvasRef.current;

    if (!canvas || !canvas.getContext) return null;

    return canvas.getContext("2d");
  };

  useEffect(() => {
    const context = getContext();
    const width = canvasRef.current?.width;

    if (!context || !width || !song) return;
    context.clearRect(0, 0, width, 40);

    const bpm = song.bpm;
    const secondsPerBeat = 60 / bpm;
    const pixelsPerBeat = secondsPerBeat * nowZoom;

    for (let i = 0; i <= Math.floor(width / pixelsPerBeat) + 1; i++) {
      const x = i * pixelsPerBeat - (nowScroll % pixelsPerBeat);
      const rect = new Path2D();

      rect.rect(x, 30, 1, 60);
      context.beginPath();
      context.fillStyle = "white";
      context.fill(rect);
      const serialNo = i + Math.floor(nowScroll / pixelsPerBeat);

      if (serialNo % 4 === 0) {
        context.fillText(String(serialNo / 4), x - 2, 26);
      }
    }
  }, [nowZoom, nowScroll, song]);

  return (
    <canvas
      ref={canvasRef}
      className={"absolute bottom-0 h-10 w-full"}
      height={40}
      width={width}
    />
  );
}
