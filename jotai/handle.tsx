import { atom } from "jotai";

import { Note, Song } from "@/types/model";

export const loadedSong = atom<Song | null>(null);
export const audioSource = atom<string | null>("  ");

export const playing = atom<boolean>(false);
export const currentTime = atom<number>(0);
export const volume = atom<number>(0.5);
export const audioElement = atom<HTMLAudioElement | null>(null);
export const selectingNote = atom<Note | null>(null);

export const scroll = atom<number>(0);
export const zoom = atom<number>(100);
export const snapGrid = atom(new Set(["4"]));
