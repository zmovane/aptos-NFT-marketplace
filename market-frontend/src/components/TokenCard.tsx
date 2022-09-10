import Image from "next/image";
import React from "react";
import { Token } from "../types";
import { TooltipSection } from "./TooltipSection";

type CardProps = { data: Token };

export function TokenCard({ data: token }: CardProps) {
  return (
    <div className="card card-compact bg-base-50 shadow-xl">
      <Image
        className="bg-neutral-200"
        src={token.uri}
        height={500}
        width={500}
        objectFit="contain"
        alt="picture"
      />
      <div className="card-body bg-base-100">
        <h2 className="card-title">{token.name}</h2>
        <TooltipSection text={token.description} />
      </div>
    </div>
  );
}
