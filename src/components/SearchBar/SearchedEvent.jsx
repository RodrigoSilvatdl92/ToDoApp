import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addEvent } from "../../store/authReducer";
import { selectEvents } from "../../store/authReducer";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/authReducer";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { AiFillEdit } from "react-icons/ai";
import { FaCheckSquare } from "react-icons/fa";

export default function SearchedEvent({ open, event, onClose }) {
  const [isTransitioning, setIsTransitioning] = useState();
  const [error, setError] = useState(""); // erros aos preencher o edit com as datas
  const [isDisabled, setIsDisabled] = useState(true); // desabilitar o botao Correct se nao tiver feito alterações
  const [selectedPriority, setSelectedPriority] = useState(event.priority);
  console.log(event);

  /* efeito */
  useEffect(() => {
    if (open) {
      setIsTransitioning(true);
    } else {
      setIsTransitioning(false);
    }
  }, [open]);

  useEffect(() => {
    setEditedEvent((prevEvent) => ({
      ...prevEvent,
      priority: selectedPriority,
    }));
  }, [selectedPriority]);

  /* Editar evento */

  const Events = useSelector(selectEvents);
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState({
    title: event.title,
    start: event.start,
    end: event.end,
    priority: event.priority,
  });

  console.log(editedEvent);
  /* quando começas a editar ( triggered a cada caracter) */

  const handleInputChange = (event) => {
    setError("");
    const { name, value } = event.target;
    setEditedEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
    setIsDisabled(false); // Enable the button
  };

  /* cancelar edit */

  const handleCancelClick = () => {
    setEditedEvent({
      title: event.title,
      start: event.start,
      end: event.end,
      priority: event.priority,
    });
    setIsEditing(false);
    setIsDisabled(true);
  };

  /* gravar edit */
  const handleSaveClick = async () => {
    const now = new Date();

    if (new Date(editedEvent.start).getTime() < now) {
      setError("You can't add events to the past");
      return;
    }

    if (
      new Date(editedEvent.start).getTime() >
      new Date(editedEvent.end).getTime()
    ) {
      setError("End date must be after the start date");
      return;
    }
    const deleteOldEvent = async () => {
      const dbToDoList = doc(db, "users", `${currentUser}`);
      const filteredEvents = Events.filter((items) => items.id !== event.id);
      console.log(filteredEvents);
      await updateDoc(dbToDoList, { toDoList: filteredEvents });
      console.log("apagou o evento old ? ");
    };

    await deleteOldEvent();
    console.log(editedEvent);
    dispatch(addEvent(editedEvent));
    setIsEditing(false);
    setEditedEvent({ ...editedEvent });
  };

  /* priority */

  const handlePriorityClick = (priority) => {
    setSelectedPriority(priority);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 ">
      <div className="w-full h-full absolute top-0 left-0 bg-black/70 backdrop-filter backdrop-blur-sm " />
      <div
        className={`min-w-[250px] bg-white z-10 p-2 rounded ${
          isTransitioning
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform -translate-y-full"
        } transition-all duration-500 ease-in-out`}
      >
        {isEditing ? (
          <>
            <p className="my-2">
              <span className="font-bold">Title:</span>{" "}
              <input
                type="text"
                name="title"
                value={editedEvent.title}
                onChange={handleInputChange}
              />
            </p>
            <p className="my-2">
              <span className="font-bold">Start Date:</span>{" "}
              <input
                type="datetime-local"
                name="start"
                value={editedEvent.start}
                onChange={handleInputChange}
              />
            </p>
            <p className="my-2">
              <span className="font-bold">End Date:</span>{" "}
              <input
                type="datetime-local"
                name="end"
                value={editedEvent.end}
                onChange={handleInputChange}
              />
            </p>
            <div className="my-2">
              <span className="font-bold">Priority:</span>{" "}
              <button
                className={`bg-red-700 rounded-[50%] w-[25px] h-[25px] ${
                  selectedPriority === "urgent" ? "ring-2 ring-black" : ""
                }`}
                title="Urgent"
                onClick={() => {
                  handlePriorityClick("urgent");
                  setIsDisabled(false);
                }}
              ></button>
              <button
                className={`bg-yellow-700 rounded-[50%] w-[25px] h-[25px] ml-2 ${
                  selectedPriority === "middle-urgent"
                    ? "ring-2 ring-black"
                    : ""
                }`}
                title="Middle-Urgent"
                onClick={() => {
                  handlePriorityClick("middle-urgent");
                  setIsDisabled(false);
                }}
              ></button>
              <button
                className={`bg-green-700 rounded-[50%] w-[25px] h-[25px] ml-2 ${
                  selectedPriority === "ok" ? "ring-2 ring-black" : ""
                }`}
                title="Ok"
                onClick={() => {
                  handlePriorityClick("ok");
                  setIsDisabled(false);
                }}
              ></button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex items-center">
              <button
                onClick={handleSaveClick}
                disabled={isDisabled}
                className={isDisabled ? "disabled-button" : ""}
              >
                <FaCheckSquare
                  size={27}
                  title="Save"
                  className={
                    isDisabled
                      ? " disabled-button"
                      : "text-gray-600 bg-white rounded"
                  }
                />
              </button>
              <button
                onClick={handleCancelClick}
                className="ml-2 bg-gray-600 p-1 text-xs h-[27px] rounded text text-white"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="my-2">
              <span className="font-bold">Title:</span> {editedEvent.title}
            </p>
            <p className="my-2">
              <span className="font-bold">Start Date:</span>{" "}
              {editedEvent.start.replace("T", " ")}
            </p>
            <p className="my-2">
              <span className="font-bold">End Date:</span>{" "}
              {editedEvent.end.replace("T", " ")}
            </p>
            <p className="my-2">
              <span className="font-bold">Priority:</span>{" "}
              {editedEvent.priority}
            </p>
            <div className="flex">
              <button
                onClick={() => onClose("")}
                className="bg-gray-600 p-1 rounded  md:text-l text-sm text-white"
              >
                OK
              </button>
              <button onClick={() => setIsEditing(true)}>
                <AiFillEdit
                  size={27}
                  title="Edit"
                  className="ml-2 text-white bg-gray-600 rounded"
                />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
