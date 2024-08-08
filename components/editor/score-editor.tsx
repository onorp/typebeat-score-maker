"use client";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { TbTriangleInvertedFilled } from "react-icons/tb";

import SongSettings from "@/components/editor/song-settings";
import {
  audioElement,
  audioSource,
  currentTime,
  loadedSong,
  playing,
  scroll,
  selectingNote,
  snapGrid,
  zoom,
} from "@/jotai/handle";
import Controller from "@/components/editor/controller";
import EditorInfo from "@/components/editor/editor-info";
import Timelabel from "@/components/editor/timelabel";
import { Note, Song } from "@/types/model";
import TimelineGrid from "@/components/editor/timeline-grid";
import KeyboardInput from "@/components/editor/keyboard-input";

export default function ScoreEditor() {
  const [song, setSong] = useAtom(loadedSong);
  const [audioSrc, setAudioSrc] = useAtom(audioSource);
  const [audio, setAudio] = useAtom(audioElement);
  const [isPlaying, setIsPlaying] = useAtom(playing);
  const [time, setTime] = useAtom(currentTime);
  const [nowScroll, setNowScroll] = useAtom(scroll);
  const [nowZoom, setNowZoom] = useAtom(zoom);
  const [nowSnapGrid, setNowSnapGrid] = useAtom(snapGrid);
  const [selectedNote, setSelectedNote] = useAtom(selectingNote);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const updateCurrentTime = () => {
      requestAnimationFrame(updateCurrentTime);
      setTime(audio?.currentTime || 0);
    };

    if (audio) {
      audio.addEventListener("timeupdate", updateCurrentTime);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", updateCurrentTime);
      }
    };
  }, [audio]);

  return (
    <>
      <KeyboardInput />
      <SongSettings />
      {song ? (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events
        <div
          className={"w-screen h-full flex select-none"}
          onClick={() => {
            setSelectedNote(null);
          }}
        >
          {audioSrc ? (
            <>
              <audio
                ref={setAudio}
                className={"hidden"}
                src={audioSrc}
                onEnded={() => setIsPlaying(false)}
                onLoadedMetadata={(e) => {
                  const newSong = new Song(
                    song.id,
                    song.name,
                    song.composer,
                    song.arranger,
                    song.lyricist,
                    song.difficulty,
                    song.level,
                    song.bpm,
                    song.notes,
                    e.currentTarget.duration,
                  );

                  setSong(newSong);
                }}
              >
                <track kind="captions" />
              </audio>
              <EditorInfo endTime={song.end} time={time} />
              <Controller />
            </>
          ) : (
            <></>
          )}
          <div
            className={
              "w-max relative mr-24 mb-24 mt-6 ml-4 rounded-xl flex-grow flex flex-col gap-4 overflow-hidden"
            }
          >
            <div
              className={
                "w-full flex-grow bg-white rounded-xl flex items-center justify-center"
              }
            >
              <h2 className={"text-black"}>Preview</h2>
            </div>
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events */}
            <div
              className={
                "relative flex flex-col h-48 rounded-xl bg-zinc-900/70 backdrop-blur-xl overflow-x-scroll w-full"
              }
              onClick={(e) => {
                const x =
                  e.clientX - e.currentTarget.getBoundingClientRect().left;
                const y =
                  e.clientY - e.currentTarget.getBoundingClientRect().top;
                let time = (x + nowScroll) / nowZoom;

                if (y <= 42) return;

                const newSong = new Song(
                  song.id,
                  song.name,
                  song.composer,
                  song.arranger,
                  song.lyricist,
                  song.difficulty,
                  song.level,
                  song.bpm,
                  song.notes,
                  song.end,
                );

                const snapSize = Number([...nowSnapGrid][0]);
                let snapInterval = 1 / (snapSize / 2);

                if (snapSize == 3) {
                  snapInterval = 1 / 3 / 2;
                }

                time = Math.round(time / snapInterval) * snapInterval;

                const noteExists = newSong.notes.some(
                  (note) => note.timing === time,
                );

                if (!noteExists) {
                  newSong.notes.push(new Note(time, "A"));
                  newSong.notes.sort((a, b) => a.timing - b.timing);
                  setSong(newSong);
                }
              }}
              onMouseDown={(e) => {
                if (!audio) return;
                const y =
                  e.clientY - e.currentTarget.getBoundingClientRect().top;

                if (y > 42) return;
                setIsDragging(true);
                const x =
                  e.clientX - e.currentTarget.getBoundingClientRect().left;

                audio.currentTime = (x + nowScroll) / nowZoom;
              }}
              onMouseLeave={() => {
                setIsDragging(false);
              }}
              onMouseMove={(e) => {
                if (!isDragging || !audio) return;
                const x =
                  e.clientX - e.currentTarget.getBoundingClientRect().left;

                audio.currentTime = (x + nowScroll) / nowZoom;
              }}
              onMouseUp={() => {
                setIsDragging(false);
              }}
              onScroll={(e) => {
                setNowScroll(e.currentTarget.scrollLeft);
              }}
            >
              <div
                style={{
                  background: "#18181bb3",
                  width: song.end * nowZoom + "px",
                  minWidth: "100%",
                  height: "42px",
                }}
              />
              <div className={"sticky left-0 w-full"}>
                <Timelabel />
              </div>
              <div
                className={"sticky left-0 w-full flex-grow cursor-crosshair"}
              >
                <TimelineGrid />
              </div>
              <div className={"absolute top-[42px]"}>
                {song.notes.map((note, index) => (
                  // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events
                  <div
                    key={index}
                    className={`absolute ${selectedNote === note ? "bg-blue-400" : "bg-blue-500"} flex items-center justify-center text-sm font-bold cursor-pointer`}
                    style={{
                      left: `${note.timing * nowZoom}px`,
                      top: "0",
                      width: "26px",
                      height: "42px",
                      filter: "drop-shadow(0 0 0.5rem white)",
                      clipPath: "polygon(100% 50%, 0 0, 0 100%)",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNote(note);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setSelectedNote(null);
                      const newSong = new Song(
                        song.id,
                        song.name,
                        song.composer,
                        song.arranger,
                        song.lyricist,
                        song.difficulty,
                        song.level,
                        song.bpm,
                        song.notes.filter((n) => n !== note),
                        song.end,
                      );

                      setSong(newSong);
                    }}
                  >
                    <p className={"mr-2"}>{note.key}</p>
                  </div>
                ))}
              </div>
              <div
                className={
                  "h-[calc(100%-42px)] w-0.5 absolute bg-blue-500 bottom-0"
                }
                style={{
                  left: time * nowZoom + "px",
                }}
              >
                <TbTriangleInvertedFilled
                  className={"relative right-[.44rem] -top-3 text-blue-500"}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={"w-full flex flex-col items-center justify-center gap-4"}
        >
          <div className={"flex flex-col items-center"}>
            <h2 className={"text-2xl font-bold"}>TypeBeat Score Maker</h2>
            <p>
              ファイルを新規作成するかファイルを開いて編集を開始しましょう。
            </p>
          </div>
        </div>
      )}
    </>
  );
}
