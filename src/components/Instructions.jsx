import React, { useState, useEffect } from "react";

function Instructions({ onClose, open }) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (open) {
      setIsTransitioning(true);
    } else {
      setIsTransitioning(false);
    }
  }, [open]);

  return (
    <div className="w-full h-full fixed left-0 top-0 flex justify-center items-center z-30">
      <div
        className="w-full h-full absolute bg-black bg-opacity-70 backdrop-filter backdrop-blur-sm "
        onClick={onClose}
      />
      <div
        className={`max-w-[380px] bg-gray-300 rounded-sm p-8 m-auto relative'} ${
          isTransitioning
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform -translate-y-full"
        } transition-all duration-500 ease-in-out`}
      >
        <h2 className="font-bold text-xl">Welcome to Our ToDo App</h2>
        <p className="mt-4">
          <span className="font-bold ">Add Event: </span>
          To add an event just click on the day or time depending on the
          calendar overview and choose a title, event date and event priority.
        </p>
        <p className="mt-4">
          <span className="font-bold">Remove Event: </span>
          To remove an event press on the event for one second.
        </p>
        <div className="flex justify-between mt-4 ">
          <span className="font-bold">Priority levels: </span>
          <div
            className="bg-red-500 rounded-[50%] w-[25px] h-[25px]"
            title="Urgent"
          ></div>
          <div
            className="bg-orange-500 rounded-[50%] w-[25px] h-[25px]"
            title="Middle-Urgent"
          ></div>
          <div
            className="bg-green-700 rounded-[50%] w-[25px] h-[25px]"
            title="Ok"
          ></div>
          <div
            className="bg-blue-700 rounded-[50%] w-[25px] h-[25px]"
            title="Holidays"
          ></div>
        </div>
      </div>
    </div>
  );
}

export default Instructions;
