import React, { useEffect, useState } from "react";
import { TiDeleteOutline } from "react-icons/ti";
import { doc, updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/authReducer";
import { db } from "../firebase";
import { selectEvents } from "../store/authReducer";
import { useDispatch } from "react-redux";
import { setEvents } from "../store/authReducer";

function DeleteEventConfirm({ open, event, onClose }) {
  console.log(event);
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const Events = useSelector(selectEvents);

  const [isTransitioning, setIsTransitioning] = useState("");

  useEffect(() => {
    if (open) {
      setIsTransitioning(true);
    } else {
      setIsTransitioning(false);
    }
  }, [open]);

  const deleteEvents = async () => {
    const dbToDoList = doc(db, "users", `${currentUser}`);

    const filteredEvents = Events.filter((item) => item.id !== +event);

    await updateDoc(dbToDoList, { toDoList: filteredEvents });
    dispatch(setEvents(filteredEvents));
    onClose(false);
  };

  return (
    <div className="fixed top-0 left-0 h-full w-full flex justify-center items-center z-20">
      <div className="w-full h-full absolute top-0 left-0 bg-black/70 backdrop-filter backdrop-blur-sm" />
      <div
        className={`max-w-[380px] bg-gray-300 rounded-sm m-auto'} ${
          isTransitioning
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform -translate-y-full"
        } transition-all duration-500 ease-in-out flex-col items-center`}
      >
        <TiDeleteOutline size={70} className="text-red-500 mx-auto my-2" />
        <h3 className="text-center text-xl font-bold my-2">Are you sure?</h3>
        <p className="text-center">
          Do you really want to delete this event? This process cannot be undone
        </p>
        <div className="text-center my-4">
          <button
            className="bg-red-500 p-2 mr-2 text-white text-md"
            onClick={deleteEvents}
          >
            Delete
          </button>
          <button
            className="bg-gray-500 p-2 ml-2 text-white text-md"
            onClick={() => onClose(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteEventConfirm;
