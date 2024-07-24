"use client";

import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
} from "@nextui-org/navbar";
import { IoSaveOutline } from "react-icons/io5";
import { useAtomValue } from "jotai";

import NavBarCustomItem from "@/components/navbar-custom-item";
import NavNewFile from "@/components/nav/new-file";
import NavOpenFile from "@/components/nav/open-file";
import { loadedSong } from "@/jotai/handle";

export const Navbar = () => {
  const song = useAtomValue(loadedSong);

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <div className={"relative"}>
            <p className={"font-bold text-lg"}>TypeBeat Score Maker</p>
            <p className={"absolute text-sm text-zinc-400"}>
              {song ? `${song.name}` : ""}
            </p>
          </div>
        </NavbarBrand>
        <NavbarContent justify={"end"}>
          <ul className="flex gap-2 justify-start ml-2">
            <NavNewFile />
            <NavOpenFile />
            <NavBarCustomItem
              icon={<IoSaveOutline />}
              toolTip={"保存"}
              onClick={() => {
                if (song) {
                  const blob = song.toBlob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");

                  a.href = url;
                  a.download = "data.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }
              }}
            />
          </ul>
        </NavbarContent>
      </NavbarContent>
    </NextUINavbar>
  );
};
