"use client";

import { Button } from "@nextui-org/button";
import { NavbarItem } from "@nextui-org/navbar";
import { ReactElement } from "react";
import { Tooltip } from "@nextui-org/tooltip";

export default function NavBarCustomItem({
  icon,
  toolTip,
  onClick,
}: {
  icon: ReactElement;
  toolTip: string;
  onClick?: () => void;
}) {
  return (
    <NavbarItem key={`nav-${toolTip}`}>
      <Tooltip content={toolTip}>
        <Button
          isIconOnly
          aria-label="Like"
          variant={"light"}
          onClick={onClick}
        >
          {icon}
        </Button>
      </Tooltip>
    </NavbarItem>
  );
}
