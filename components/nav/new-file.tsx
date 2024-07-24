"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { IoDocumentOutline } from "react-icons/io5";
import { Button } from "@nextui-org/button";
import { useAtom } from "jotai/index";

import NavBarCustomItem from "@/components/navbar-custom-item";
import { loadedSong } from "@/jotai/handle";
import { Song } from "@/types/model";

export default function NavNewFile() {
  const [song, setSong] = useAtom(loadedSong);
  const { isOpen, onOpenChange } = useDisclosure();

  function createFile() {
    setSong(new Song());
  }

  return (
    <>
      <NavBarCustomItem
        icon={<IoDocumentOutline />}
        toolTip={"新規作成"}
        onClick={() => {
          if (song) {
            onOpenChange();
          } else {
            createFile();
          }
        }}
      />
      <Modal closeButton={<></>} isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                新規作成
              </ModalHeader>
              <ModalBody>
                <p>変更を破棄して新規作成しますか？</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  キャンセル
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    createFile();
                    onClose();
                  }}
                >
                  新規作成
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
