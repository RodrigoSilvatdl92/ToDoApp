import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useSelector } from "react-redux";
import { selectEvents } from "../store/authReducer";
import { useDispatch } from "react-redux";
import { loadEvents } from "../store/authReducer";
import { selectHolidays } from "../store/authReducer";
import ErrorModal from "./ErrorModal";
import EventClick from "./EventClick";
import DeleteEventConfirm from "./DeleteEventConfirm";

function Calendar() {
  const holidays = useSelector(selectHolidays);

  const Events = useSelector(selectEvents);
  const dispatch = useDispatch();

  console.log(Events);

  const [hasError, setError] = useState("");

  /* closing error modal when click continue  */

  const closeErrorModal = (props) => {
    setError(props);
  };

  /* loading firebase events */
  useEffect(() => {
    dispatch(loadEvents());
  }, [dispatch]);

  /* if the event view is week/day or month.. depending on that view the event form will be different */
  const [displayClickEvent, setDisplayClickEvent] = useState("");
  const [isDayOrWeek, setIsDayOrWeek] = useState("");

  const handlerEventClick = (info) => {
    const now = new Date();
    const eventStartTime = new Date(info.date).getTime();

    if (eventStartTime < now.setHours(0, 0, 0, 0)) {
      setError(`You cannot add an event to the past`);
      return;
    }

    if (info.view.type === "timeGridWeek" || info.view.type === "timeGridDay") {
      setIsDayOrWeek({ type: "dayOrWeek", info: info });
    } else if (info.view.type === "dayGridMonth") {
      setIsDayOrWeek({ type: "month", info: info });
    }
    setDisplayClickEvent(true);
  };

  /* close clickEvent */

  const closeOnClickEvent = (props) => {
    setDisplayClickEvent(props);
  };

  /* changing default hour of timeGridWeek and timeGridDay from 24.00 to 00.00  */
  const slotLabelContents = (arg) => {
    const { date } = arg;
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    return `${hour}:${minute}`;
  };

  /* function when pressing events to delete them  */

  let pressTimer;

  const [confirmDeleteEvent, setConfirmDeleteEvent] = useState("");
  const [EventToDelete, setEventToDelete] = useState("");

  const handlePressStart = (eventID) => {
    pressTimer = setTimeout(async () => {
      console.log(eventID);
      setEventToDelete(eventID);
      setConfirmDeleteEvent(true);
    }, 1000); // 1 second
  };

  const closeDeleteEventModal = (props) => {
    setConfirmDeleteEvent(props);
  };

  const handlePressEnd = () => {
    clearTimeout(pressTimer);
  };

  return (
    <div className="my-10 rounded-xl  shadow-lg shadow-black/5 dark:shadow-black/30 -z-10 ">
      {hasError && <ErrorModal open={hasError} onClose={closeErrorModal} />}
      {confirmDeleteEvent && (
        <DeleteEventConfirm
          open={confirmDeleteEvent}
          event={EventToDelete}
          onClose={closeDeleteEventModal}
        />
      )}
      {displayClickEvent && (
        <EventClick
          open={displayClickEvent}
          onClose={closeOnClickEvent}
          infoForForm={isDayOrWeek}
        />
      )}
      <FullCalendar
        slotEventOverlap={false}
        eventOverlap={false}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"timeGridDay"}
        dateClick={(datainfo) => {
          handlerEventClick(datainfo);
        }}
        dayMaxEventRows={3}
        views={{
          dayGridMonth: {
            dayMaxEventRows: 3,
            allDaySlot: false, // Disable the "all-day" section
            slotLabelContent: slotLabelContents,
          },
          timeGridDay: {
            allDaySlot: true,
            slotLabelContent: slotLabelContents,
          },
          timeGridWeek: {
            slotLabelContent: slotLabelContents,
          },
        }}
        headerToolbar={{
          start: "today,prev,next",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
        }}
        events={[...Events, ...holidays]}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        slotMinTime={"00:00:00"}
        slotMaxTime={"24:00:00"}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        eventContent={(eventInfo) => {
          const priority = eventInfo.event.extendedProps.priority;

          const time = eventInfo.timeText.replace(/^24:/, "00:");

          const backgroundColor =
            priority === "urgent"
              ? "red"
              : priority === "middle-urgent"
              ? "orange"
              : priority === "ok"
              ? "green"
              : "blue";
          const borderColor =
            priority === "urgent"
              ? "darkred"
              : priority === "middle-urgent"
              ? "darkorange"
              : priority === "ok"
              ? "darkgreen"
              : "darkblue";
          return [
            <div
              key={eventInfo.event.id}
              className="fc-event-content relative"
              style={{
                backgroundColor,
                borderColor,
                borderWidth: "2px",
                borderStyle: "solid",
                borderRadius: "5px",
                padding: "5px",
                color: "white",
                overflow: "hidden", // Prevent overflow of event content
                textOverflow: "ellipsis", // Truncate text with ellipsis
                whiteSpace: "nowrap", // Prevent wrapping of text
              }}
              title={eventInfo.event.title} // Set the full title as a tooltip
              onTouchStart={() => {
                if (eventInfo.event.extendedProps.priority === "holidays") {
                  return;
                }
                handlePressStart(eventInfo.event.id);
              }}
              onMouseDown={() => {
                if (eventInfo.event.extendedProps.priority === "holidays") {
                  return;
                }
                handlePressStart(eventInfo.event.id);
                console.log(eventInfo);
              }}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchEnd={handlePressEnd}
            >
              {/* event content */}
              {time} {eventInfo.event.title}
            </div>,
          ];
        }}
      />
    </div>
  );
}

export default Calendar;
