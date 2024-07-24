"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useAtom } from "jotai/index";
import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";

import {
  audioElement,
  audioSource,
  currentTime,
  loadedSong,
  playing,
  volume,
} from "@/jotai/handle";
import { isNumericString, isSnakeCase } from "@/utils/string";
import { Song } from "@/types/model";
import AudioSelector from "@/components/editor/audio-selector";

export default function SongSettings() {
  const [song, setSong] = useAtom(loadedSong);
  const [audioSrc, setAudioSrc] = useAtom(audioSource);
  const [errorMessage, setErrorMessage] = useState("");
  const setPlaying = useSetAtom(playing);
  const setCurrentTime = useSetAtom(currentTime);
  const setVolume = useSetAtom(volume);
  const setAudioElement = useSetAtom(audioElement);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [composer, setComposer] = useState("");
  const [arranger, setArranger] = useState("");
  const [lyricist, setLyricist] = useState("");
  const [bpm, setBpm] = useState("");

  useEffect(() => {
    if (song && song.id === "" && !isOpen) {
      setAudioSrc(null);
      setPlaying(false);
      setCurrentTime(0);
      setVolume(0.5);
      setAudioElement(null);
      setErrorMessage("");
      setId("");
      setTitle("");
      setComposer("");
      setArranger("");
      setLyricist("");
      setBpm("");
      onOpen();
    }
  }, [song, isOpen]);

  return (
    <>
      <Modal
        closeButton={<></>}
        isDismissable={false}
        isKeyboardDismissDisabled={false}
        isOpen={isOpen}
        placement="top-center"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">曲設定</ModalHeader>
              <ModalBody>
                <p className={"text-red-500 text-sm"}>{errorMessage}</p>
                <Input
                  isRequired
                  label="ID"
                  placeholder="snake_case で ID を入力"
                  variant="bordered"
                  onChange={(e) => {
                    setId(e.target.value);
                  }}
                />
                <Input
                  isRequired
                  label="曲名"
                  placeholder="曲名 を入力"
                  variant="bordered"
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
                <Input
                  label="作曲者"
                  placeholder="作曲者 を入力"
                  variant="bordered"
                  onChange={(e) => {
                    setComposer(e.target.value);
                  }}
                />
                <Input
                  label="編曲者"
                  placeholder="編曲者 を入力"
                  variant="bordered"
                  onChange={(e) => {
                    setArranger(e.target.value);
                  }}
                />
                <Input
                  label="作詞者"
                  placeholder="作詞者 を入力"
                  variant="bordered"
                  onChange={(e) => {
                    setLyricist(e.target.value);
                  }}
                />
                <Input
                  isRequired
                  label="BPM"
                  placeholder="BPM を入力"
                  variant="bordered"
                  onChange={(e) => {
                    setBpm(e.target.value);
                  }}
                />
                <AudioSelector />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={() => {
                    if (id === "" || title === "" || bpm == "") {
                      setErrorMessage("必須項目を入力してください");
                    } else {
                      if (!isSnakeCase(id)) {
                        setErrorMessage("ID は snake_case で入力してください");

                        return;
                      }
                      if (!isNumericString(bpm)) {
                        setErrorMessage("BPM は数字で入力してください");

                        return;
                      }
                      const numberBPM = Number(bpm);

                      if (numberBPM <= 0) {
                        setErrorMessage(
                          "BPM は 0 より大きい値を入力してください",
                        );

                        return;
                      }
                      if (!audioSrc) {
                        setErrorMessage("音源を選択してください");

                        return;
                      }
                      let modifiedSong = new Song(
                        song?.id || "",
                        song?.name || "",
                        song?.composer || "",
                        song?.arranger || "",
                        song?.lyricist || "",
                        song?.bpm || 0,
                        song?.notes || [],
                        song?.end || 0,
                      );

                      modifiedSong.id = id;
                      modifiedSong.name = title;
                      modifiedSong.composer = composer;
                      modifiedSong.arranger = arranger;
                      modifiedSong.lyricist = lyricist;
                      modifiedSong.bpm = numberBPM;
                      if (song) modifiedSong.notes = song.notes;
                      setSong(modifiedSong);
                      onClose();
                    }
                  }}
                >
                  決定
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
