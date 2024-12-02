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
      className="px-14 pt-20 pb-24 rounded-xl justify-center items-center bg-white flex flex-col gap-7 cursor-pointer relative"
      onClick={props.onClick}
    >
      <Image src={props.src} alt={props.src} width={150} height={150} />
      <span className="text-2xl font-bold absolute bottom-8">
        {props.title}
      </span>
    </div>
  );
};

export default CardComponent;
