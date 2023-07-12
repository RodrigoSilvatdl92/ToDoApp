import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import moment from "moment";

import { addEvent } from "../../store/authReducer";
import { useDispatch } from "react-redux";

/* este só precisa da hora de acabar .. o dia já está definido e a hora de começo tambem */

function DayAndWeek({ infoForForm, onClose }) {
  const dispatch = useDispatch();
  const info = infoForForm.info;

  /* transformar a data para o pretendido */

  const originalDateStr = info.dateStr.slice(0, 16);
  const originalDate = new Date(originalDateStr);

  const day = originalDate.getDate();
  const month = originalDate.getMonth() + 1; // Months are zero-based, so we add 1
  const year = originalDate.getFullYear();
  const hours = originalDate.getHours();
  const minutes = originalDate.getMinutes();

  const transformedDateStr = `${day.toString().padStart(2, "0")}/${month
    .toString()
    .padStart(2, "0")}/${year} ${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  const validationSchema = yup.object().shape({
    title: yup.string().required("Required"),
    end: yup
      .string()
      .required("Required")
      .test(
        "valid-end",
        "End date must be after the start date",
        function (value) {
          const start = moment(info.dateStr.slice(0, 16), "YYYY-MM-DDTHH:mm");
          const end = moment(value, "YYYY-MM-DDTHH:mm");

          return end.isAfter(start);
        }
      ),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      start: `${info.dateStr.slice(0, 16)}`,
      end: "",
      priority: "ok",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const { title } = values;
      const priority = values.priority;
      const start = `${info.dateStr.slice(0, 16)}`;
      const id = new Date(info.DateStr).getTime();
      const end = values.end;
      dispatch(addEvent({ title, start, end, priority, id }));
      console.log("dayandWeek enviado");
      onClose("");
    },
  });

  return (
    <div>
      <form className="flex flex-col p-2" onSubmit={formik.handleSubmit}>
        <label htmlFor="title" className="mb-2 font-bold">
          Title:
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={
            formik.errors.title && formik.touched.title
              ? "mb-2 focus:outline-none border-2 border-red-600"
              : "mb-2 focus:outline-none"
          }
        />
        {formik.errors.title && formik.touched.title && (
          <p className="text-xs text-red-600">
            {formik.errors.title.charAt(0).toUpperCase() +
              formik.errors.title.slice(1)}
          </p>
        )}
        <label htmlFor="start" className="mb-2 font-bold">
          Start:
        </label>
        <p className="mb-2">{transformedDateStr}</p>

        <label htmlFor="end" className="mb-2 font-bold">
          End:
        </label>
        <input
          type="datetime-local"
          id="end"
          name="end"
          defaultValue={originalDateStr}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={
            formik.errors.end && formik.touched.end
              ? "mb-2 focus:outline-none border-2 border-red-600 cursor-pointer "
              : "mb-2 focus:outline-none cursor-pointer"
          }
        />
        {formik.errors.end && formik.touched.end && (
          <p className="text-xs text-red-600">
            {formik.errors.end.charAt(0).toUpperCase() +
              formik.errors.end.slice(1)}
          </p>
        )}
        <label htmlFor="priority" className="mb-2 font-bold">
          Priority:
        </label>
        <select
          id="priority"
          name="priority"
          className="mb-2 cursor-pointer"
          value={formik.values.priority}
          onChange={formik.handleChange}
        >
          <option value="urgent">Urgent</option>
          <option value="middle-urgent">Middle Urgent</option>
          <option value="ok">Ok</option>
        </select>

        <button
          type="submit"
          className="bg-gray-600 mt-[8px] rounded text-xl text-white font-semibold"
        >
          Add Event
        </button>
      </form>
    </div>
  );
}

export default DayAndWeek;
