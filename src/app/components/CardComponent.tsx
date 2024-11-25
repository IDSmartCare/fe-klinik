import Image from "next/image";
import React from "react";

interface CardComponentProps {
  src: string;
  title: string;
  onClick?: () => void;
}

const CardComponent = (props: CardComponentProps) => {
  return (
    <div
      className="px-14 pt-20 pb-10 rounded-xl justify-center items-center bg-white flex flex-col gap-7 cursor-pointer"
      onClick={props.onClick}
    >
      <Image src={props.src} alt={props.src} width={150} height={150} />
      <span className="text-2xl font-bold">{props.title}</span>
    </div>
  );
};

export default CardComponent;
