import { Button } from "@nextui-org/button";
import {
  IoPlaySkipBackOutline,
  IoPlaySkipForwardOutline,
} from "react-icons/io5";
import { CiPause1, CiPlay1 } from "react-icons/ci";
import { Slider } from "@nextui-org/slider";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { useAtom } from "jotai/index";
import { TbZoom } from "react-icons/tb";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";

import {
  audioElement, currentTime,
  loadedSong,
  playing,
  scroll,
  snapGrid,
  volume,
  zoom,
} from "@/jotai/handle";
import { Song } from "@/types/model";

export default function Controller() {
  const [vol, setVol] = useAtom(volume);
  const [song, setSong] = useAtom(loadedSong);
  const [isPlaying, setIsPlaying] = useAtom(playing);
  const [audio, setAudio] = useAtom(audioElement);
  const [nowZoom, setNowZoom] = useAtom(zoom);
  const [nowScroll, setNowScroll] = useAtom(scroll);
  const [nowSnapGrid, setNowSnapGrid] = useAtom(snapGrid);
  const [time, setTime] = useAtom(currentTime);

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

  return (
    <div
      className={
        "absolute bottom-4 right-4 h-72 flex justify-end items-end gap-4"
      }
    >
      <div>
        <Dropdown>
          <DropdownTrigger>
            <Button className="capitalize" variant="bordered">
              {nowSnapGrid}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Single selection example"
            selectedKeys={nowSnapGrid}
            selectionMode="single"
            variant="flat"
            onSelectionChange={setNowSnapGrid}
          >
            <DropdownItem key="3">3連符</DropdownItem>
            <DropdownItem key="4">4分音符</DropdownItem>
            <DropdownItem key="8">8分音符</DropdownItem>
            <DropdownItem key="16">16分音符</DropdownItem>
            <DropdownItem key="32">32分音符</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div
        className={
          "flex justify-center items-center w-80 h-16 p-6 gap-4 bg-zinc-900/50 rounded-xl backdrop-blur-xl"
        }
      >
        <TbZoom />
        <div className={"flex-grow"}>
          <Slider
            aria-label="Volume"
            defaultValue={nowZoom}
            maxValue={1000}
            minValue={30}
            size="sm"
            step={1}
            onChange={(value) => {
              let newZoom: number;

              if (Array.isArray(value)) {
                newZoom = value[0];
              } else {
                newZoom = value;
              }
              setNowZoom(newZoom);

            }}
          />
        </div>
      </div>
      <div
        className={
          "flex justify-center items-center w-40 h-16 gap-2 bg-zinc-900/50 rounded-xl backdrop-blur-xl"
        }
      >
        <Button
          isIconOnly
          aria-label="Like"
          variant={"light"}
          onClick={() => {
            if (audio) {
              audio.currentTime = 0;
            }
          }}
        >
          <IoPlaySkipBackOutline className={"text-lg"} />
        </Button>
        <Button
          isIconOnly
          aria-label="Like"
          variant={"light"}
          onClick={async () => {
            await togglePlay();
          }}
        >
          {isPlaying ? (
            <CiPause1 className={"text-lg"} />
          ) : (
            <CiPlay1 className={"text-lg"} />
          )}
        </Button>
        <Button
          isIconOnly
          aria-label="Like"
          variant={"light"}
          onClick={() => {
            if (audio) {
              audio.currentTime = audio.duration;
            }
          }}
        >
          <IoPlaySkipForwardOutline className={"text-lg"}/>
        </Button>
      </div>
      <div
        className={
          "w-8 h-72 flex flex-col items-center gap-4 p-8 bg-zinc-900/50 rounded-xl backdrop-blur-xl"
        }
      >
        <Slider
          aria-label="Volume"
          defaultValue={vol}
          maxValue={1}
          minValue={0}
          orientation="vertical"
          size="sm"
          step={0.01}
          onChange={(value) => {
            let newVol: number;

            if (Array.isArray(value)) {
              newVol = value[0];
            } else {
              newVol = value;
            }
            if (audio) audio.volume = newVol;
            setVol(newVol);
          }}
        />
        <HiOutlineSpeakerWave className={"text-xl"} />
      </div>
    </div>
  );
}
