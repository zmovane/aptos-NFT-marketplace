import Image from "next/image";
import React from "react";
import { Token } from "../types";

type CardProps = { data: Token };

export function TokenCard({ data: token }: CardProps) {
  return (
    <div className="card card-compact bg-base-100 shadow-xl">
      <Image
        className="bg-neutral-200"
        src={token.uri}
        height={500}
        width={500}
        objectFit="cover"
        alt="picture"
      />
      <div className="card-body">
        <h2 className="card-title">{token.name}</h2>
        <p>{token.description}</p>
      </div>
    </div>
  );
}
