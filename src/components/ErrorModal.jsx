import React, { useEffect, useState } from "react";
import { AiOutlineQuestion } from "react-icons/ai";

function ErrorModal({ open, onClose }) {
  const [isTransitioning, setIsTransitioning] = useState();

  useEffect(() => {
    if (open) {
      setIsTransitioning(true);
    } else {
      setIsTransitioning(false);
    }
  }, [open]);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 ">
      <div className="w-full h-full absolute top-0 left-0 bg-black/70 backdrop-filter backdrop-blur-sm" />
      <div
        className={`max-w-[380px] bg-gray-300 rounded-sm m-auto'} ${
          isTransitioning
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform -translate-y-full"
        } transition-all duration-500 ease-in-out `}
      >
        <div className="max-w-[320px] m-auto flex-col items-center p-4 z-20">
          <div className="w-[80px] h-[80px] rounded-[50%] bg-red-500 flex justify-center items-center m-auto  ">
            <AiOutlineQuestion style={{ color: "white" }} size={50} />
          </div>
          <p className="text-red-500 text-2xl mt-4 font-semibold text-center">
            ERROR
          </p>
          <p className="text-center mt-4">{open}</p>
        </div>
        <p
          className="w-full h-[40px] text-center leading-10 text-white font-semibold bg-red-500 text-xl mt-4 cursor-pointer rounded-b-sm"
          onClick={() => onClose("")}
        >
          Continue
        </p>
      </div>
    </div>
  );
}

export default ErrorModal;
