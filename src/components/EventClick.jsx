import React, { useState, useEffect } from "react";
import DayAndWeek from "./EventClick/DayAndWeek";
import Month from "./EventClick/Month";

function EventClick({ open, onClose, infoForForm }) {
  const [isTransitioning, setIsTransitioning] = useState();

  useEffect(() => {
    if (open) {
      setIsTransitioning(true);
    } else {
      setIsTransitioning(false);
    }
  }, [open]);

  let content;

  if (infoForForm.type === "dayOrWeek") {
    content = <DayAndWeek infoForForm={infoForForm} onClose={onClose} />;
  } else if (infoForForm.type === "month") {
    content = <Month infoForForm={infoForForm} onClose={onClose} />;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-10 ">
      <div
        className="w-full h-full absolute top-0 left-0 bg-black/70 backdrop-filter backdrop-blur-sm "
        onClick={() => onClose("")}
      />
      <div
        className={`w-[320px] bg-gray-300 rounded-sm m-auto z-10'} ${
          isTransitioning
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform -translate-y-full"
        } transition-all duration-500 ease-in-out`}
      >
        <h2 className="p-2 font-bold text-xl">Add Event</h2>
        {content}
      </div>
    </div>
  );
}

export default EventClick;
