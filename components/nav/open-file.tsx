"use client";

import { IoFolderOpenOutline } from "react-icons/io5";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { useAtom } from "jotai";
import { useSetAtom } from "jotai/index";

import NavBarCustomItem from "@/components/navbar-custom-item";
import {
  audioElement,
  audioSource,
  currentTime,
  loadedSong,
  playing,
  volume,
} from "@/jotai/handle";
import { Song } from "@/types/model";

export default function NavOpenFile() {
  const setAudioSrc = useSetAtom(audioSource);
  const setPlaying = useSetAtom(playing);
  const setCurrentTime = useSetAtom(currentTime);
  const setVolume = useSetAtom(volume);
  const setAudioElement = useSetAtom(audioElement);
  const [song, setSong] = useAtom(loadedSong);
  const { isOpen, onOpenChange } = useDisclosure();

  function openFile() {
    const input = document.createElement("input");

    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.item(0);

      if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const json = e.target?.result as string;
          const data = JSON.parse(json);
          const song = data as Song;

          setSong(song);
          const audioInput = document.createElement("input");

          audioInput.type = "file";
          audioInput.accept = "audio/*";
          audioInput.onchange = (e) => {
            const audioFile = (e.target as HTMLInputElement).files?.item(0);

            if (audioFile) {
              const audio = new Audio(URL.createObjectURL(audioFile));

              setAudioSrc(URL.createObjectURL(audioFile));
              setAudioElement(audio);
              setPlaying(false);
              setCurrentTime(0);
              setVolume(0.5);
            }
          };
          audioInput.click();
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  return (
    <>
      <NavBarCustomItem
        icon={<IoFolderOpenOutline />}
        toolTip={"ファイルを開く"}
        onClick={() => {
          if (song) {
            onOpenChange();
          } else {
            openFile();
          }
        }}
      />
      <Modal closeButton={<></>} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                ファイルを開く
              </ModalHeader>
              <ModalBody>
                <p>変更を破棄してファイルを開きますか？</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  キャンセル
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    openFile();
                    onClose();
                  }}
                >
                  開く
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
