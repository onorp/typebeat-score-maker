import { useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";

import {
  audioElement,
  loadedSong,
  playing,
  selectingNote,
} from "@/jotai/handle";
import { Note, Song } from "@/types/model";

export default function KeyboardInput() {
  const [song, setSong] = useAtom(loadedSong);
  const [audio] = useAtom(audioElement);
  const setIsPlaying = useSetAtom(playing);
  const [selectedNote] = useAtom(selectingNote);

  const togglePlay = async () => {
    if (!audio) return;
    if (audio.paused) {
      await audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleKeyDown = async (e: KeyboardEvent) => {
    const key = e.key;

    if (selectedNote == null) {
      switch (key) {
        case " ":
          e.preventDefault();
          await togglePlay();
          break;
      }
    } else {
      if (!song) return;
      const newNote = new Note(selectedNote.timing, key.toUpperCase());
      const newSong = new Song(
        song.id,
        song.name,
        song.composer,
        song.arranger,
        song.lyricist,
        song.difficulty,
        song.level,
        song.bpm,
        song.notes.map((note) =>
          note.timing === selectedNote.timing ? newNote : note,
        ),
        song.end,
      );

      setSong(newSong);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [audio, selectedNote]);

  return <div />;
}
