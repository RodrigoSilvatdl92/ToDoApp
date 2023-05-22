import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
import moment from "moment";

import { addEvent } from "../../store/authReducer";
import { useDispatch } from "react-redux";
// Custom validation function for date and time
function Month({ infoForForm, onClose }) {
  const dispatch = useDispatch();
  const info = infoForForm.info;

  console.log(info);

  const endDate = `${info.dateStr}T00:00`;

  const validationSchema = yup.object().shape({
    title: yup.string().required("Required"),
    start: yup
      .string()
      .required("Required")
      .test(
        "valid-start",
        "The starting date cannot be earlier than the current date",
        function (value) {
          const now = moment();
          const startDate = moment(
            `${info.dateStr}T${value}`,
            "YYYY-MM-DDTHH:mm"
          );

          if (startDate.isBefore(now)) {
            return false;
          }

          return true;
        }
      ),
    end: yup
      .string()
      .required("Required")
      .test(
        "valid-start-end",
        "End date must be after the start date",
        function (value) {
          const start = moment(
            `${info.dateStr}T${this.parent.start}`,
            "YYYY-MM-DDTHH:mm"
          );
          const end = moment(value, "YYYY-MM-DDTHH:mm");

          return end.isAfter(start);
        }
      ),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      start: "",
      end: "",
      priority: "ok",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const { title } = values;
      const priority = values.priority;
      const id = moment(info.dateStr).valueOf();
      const start = `${info.dateStr}T${formik.values.start}`;
      const end = values.end;

      dispatch(addEvent({ title, start, end, priority, id }));
      console.log("month enviado");
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
          id="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={
            formik.errors.title && formik.touched.title
              ? "mb-2 focus:outline-none border-2 border-red-600"
              : "mb-2 focus:outline-none"
          }
          type="text"
          name="title"
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
        <input
          id="start"
          value={formik.values.start}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          type="time"
          name="start"
          className={
            formik.errors.start && formik.touched.start
              ? "mb-2 focus:outline-none border-2 border-red-600"
              : "mb-2 focus:outline-none"
          }
        />
        {formik.errors.start && formik.touched.start && (
          <p className="text-xs text-red-600">
            {formik.errors.start.charAt(0).toUpperCase() +
              formik.errors.start.slice(1)}
          </p>
        )}
        <label htmlFor="end" className="mb-2 font-bold">
          End:
        </label>
        <input
          id="end"
          defaultValue={endDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          type="datetime-local"
          name="end"
          className={
            formik.errors.end && formik.touched.end
              ? "mb-2 focus:outline-none border-2 border-red-600"
              : "mb-2 focus:outline-none"
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
          className="mb-2"
          value={formik.values.priority}
          onChange={formik.handleChange}
        >
          <option value="ok">Ok</option>
          <option value="middle-urgent">Middle Urgent</option>
          <option value="urgent">Urgent</option>
        </select>
        <button
          type="submit"
          className="bg-gray-600 mt-[8px] rounded text-xl text-white font-bold"
        >
          Add Event
        </button>
      </form>
    </div>
  );
}

export default Month;
