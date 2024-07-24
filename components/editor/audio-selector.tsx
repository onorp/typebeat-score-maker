"use client";

import { ChangeEvent } from "react";
import { useSetAtom } from "jotai";

import { audioSource } from "@/jotai/handle";

const AudioSelector = () => {
  const setAudioSrc = useSetAtom(audioSource);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        setAudioSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={"flex"}>
      <p className={"text-red-600"}>*</p>
      <input
        accept="audio/*"
        className={
          "file:bg-zinc-800 file:px-5 file:py-3 file:rounded-xl hover:cursor-pointer file:cursor-pointer transition-all file:hover:bg-zinc-700 file:border-0 file:mr-4 text-sm file:text-md"
        }
        type="file"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default AudioSelector;
