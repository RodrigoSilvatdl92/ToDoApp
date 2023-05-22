import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useFormik } from "formik";
import { signUp } from "../store/authReducer";

import fundo from "../imagens/fundo.jpg";
import { signUpSchema } from "../schemas/schemas";

function SignUp() {
  /* State for password Visible or not */

  const [passwordIsVisible, setPasswordIsVisible] = useState(false);
  const [confirmPasswordIsVisible, setConfirmPasswordIsVisible] =
    useState(false);

  const handlerPasswordVisible = () => {
    setPasswordIsVisible((lastState) => !lastState);
  };

  const handlerPasswordVisible2 = () => {
    setConfirmPasswordIsVisible((lastState) => !lastState);
  };

  /* form validation and submit */

  const [sendValidationEmail, setSendValidationEmail] = useState(false);

  const onSubmit = async (values, actions) => {
    console.log(actions);
    const { email, password, confirmedPassword } = formik.values;

    if (confirmedPassword === password) {
      try {
        await signUp(email, password);
        actions.resetForm();
        setSendValidationEmail(true);
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmedPassword: "",
    },
    validationSchema: signUpSchema,
    onSubmit,
  });

  /* como definiste o onSubmitHandler dentro do formik ele agora tem estes dois argumentos ( values e actions) */

  return (
    <div className="relative">
      <div
        className="absolute h-screen w-full bg-cover bg-center bg-no-repeat -z-20 top-0 left-0"
        style={{ backgroundImage: `url(${fundo})` }}
      >
        <div className="absolute h-full w-full bg-black/20 -z-20 " />
        <div className="max-w-screen-xl m-auto pt-[100px] px-8  ">
          <h1 className="font-bold text-2xl md:text-4xl text-gray-100">
            Make every day count! - Stay{" "}
            <span className="relative text-white ">
              organized
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-tl -z-10    from-gray-300 to-gray-500 transform scale-x-105 scale-y-105 skew-x-12" />
            </span>{" "}
            and{" "}
            <span className="relative text-white ">
              schedule
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-tl -z-10 from-gray-300 to-gray-500 transform scale-x-105 scale-y-105 skew-x-12" />
            </span>{" "}
            with our to-do app and integrated calendar
          </h1>
        </div>
        <div className="max-w-[380px] mt-[150px] mx-auto bg-black/70 rounded-md ">
          <form
            onSubmit={formik.handleSubmit}
            className="ml-10 py-10 m-auto w-[80%]"
          >
            <h1 className="text-white font-bold text-2xl">Sign Up</h1>
            {/* User Email */}
            <input
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.errors.email && formik.touched.email
                  ? "mt-6 w-full rounded-sm hover:border-none focus:outline-none px-1 border-2 border-red-600"
                  : "mt-6 w-full rounded-sm hover:border-none focus:outline-none px-1"
              }
              type="text"
              placeholder="Email..."
            />
            {formik.errors.email && formik.touched.email && (
              <p className="text-xs text-red-600">
                {formik.errors.email.charAt(0).toUpperCase() +
                  formik.errors.email.slice(1)}
              </p>
            )}
            {/* User password */}
            <div className="mt-6 relative">
              <input
                id="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.password && formik.touched.password
                    ? "w-full rounded-sm hover:border-none focus:outline-none px-1 border-2 border-red-600"
                    : "w-full rounded-sm hover:border-none focus:outline-none px-1"
                }
                type={passwordIsVisible ? "text" : "password"}
                placeholder="Password..."
              />
              {formik.errors.password && formik.touched.password && (
                <p className="text-xs text-red-600">
                  {formik.errors.password.charAt(0).toUpperCase() +
                    formik.errors.password.slice(1)}
                </p>
              )}
              {passwordIsVisible ? (
                <AiFillEyeInvisible
                  onClick={handlerPasswordVisible}
                  className="absolute top-1 right-2 "
                />
              ) : (
                <AiFillEye
                  onClick={handlerPasswordVisible}
                  className="absolute top-1 right-2 "
                />
              )}
              {/* User confirmed password */}
              <div className="mt-6 relative">
                <input
                  id="confirmedPassword"
                  value={formik.values.confirmedPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.errors.confirmedPassword &&
                    formik.touched.confirmedPassword
                      ? " w-full rounded-sm hover:border-none focus:outline-none px-1 border-2 border-red-600"
                      : " w-full rounded-sm hover:border-none focus:outline-none px-1"
                  }
                  type={confirmPasswordIsVisible ? "text" : "password"}
                  placeholder="Confirm Password..."
                />
                {formik.errors.confirmedPassword &&
                  formik.touched.confirmedPassword && (
                    <p className="text-xs text-red-600">
                      {formik.errors.confirmedPassword.charAt(0).toUpperCase() +
                        formik.errors.confirmedPassword.slice(1)}
                    </p>
                  )}
                {confirmPasswordIsVisible ? (
                  <AiFillEyeInvisible
                    onClick={handlerPasswordVisible2}
                    className="absolute top-1 right-2 "
                  />
                ) : (
                  <AiFillEye
                    onClick={handlerPasswordVisible2}
                    className="absolute top-1 right-2 "
                  />
                )}
              </div>
            </div>
            <button className="bg-gray-600 px-4 py-1 mt-6 rounded block text-xl text-white font-bold transform transition duration-200 hover:scale-110">
              Sign Up
            </button>
            {sendValidationEmail && (
              <p className="text-xs text-green-700">
                An email with the validation link has been sent to your Email!
              </p>
            )}
            <p className="text-sm text-white mt-2 ">
              Already registred?{" "}
              <Link to="/">
                <span className="font-bold underline cursor-pointer">
                  Sign in now
                </span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
