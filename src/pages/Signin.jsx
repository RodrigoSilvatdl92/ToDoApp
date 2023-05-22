import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { logIn } from "../store/authReducer";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectError } from "../store/authReducer";
import { selectCurrentUser } from "../store/authReducer";
import { useNavigate } from "react-router-dom";
import { setError } from "../store/authReducer";
import fundo from "../imagens/fundo.jpg";
import { recoverPassword } from "../store/authReducer";

function Signin() {
  const [displayRecoverPassoword, setDisplayRecoverPassword] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState("");
  const [recoverPasswordEmailSent, setRecoverPasswordEmailSent] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* State for password Visible or not */

  const [passwordIsVisible, setPasswordIsVisible] = useState(false);

  const handlerPasswordVisible = () => {
    setPasswordIsVisible((lastState) => !lastState);
  };

  /* sign in */

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const hasError = useSelector(selectError);
  const currentUser = useSelector(selectCurrentUser);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    try {
      dispatch(logIn(userEmail, userPassword));
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate("/home");
    }
  }, [currentUser, navigate]);

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
          <form className="ml-10 py-10 m-auto w-[80%]">
            <h1 className="text-white font-bold text-2xl">Sign In</h1>
            {/* username */}
            <input
              onChange={(event) => {
                setUserEmail(event.target.value);
                dispatch(setError(""));
              }}
              className="mt-6 w-full rounded-sm hover:border-none focus:outline-none px-1"
              type="text"
              placeholder="Email..."
            />
            <div className="mt-6 relative">
              {/* password */}
              <input
                onChange={(event) => {
                  setUserPassword(event.target.value);
                  dispatch(setError(""));
                }}
                className="w-full rounded-sm hover:border-none focus:outline-none px-1"
                type={passwordIsVisible ? "text" : "password"}
                placeholder="Password..."
              />
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
            </div>
            <div className="flex justify-between mt-6">
              <div>
                <button
                  onClick={onSubmitHandler}
                  className="bg-gray-600 px-4 py-1 rounded block text-xl text-white font-bold transform transition duration-200 hover:scale-110"
                >
                  Sign In
                </button>
                {hasError && <p className="text-xs text-red-600">{hasError}</p>}
              </div>
              <div>
                <button
                  className="text-white"
                  onClick={async (e) => {
                    e.preventDefault();
                    setDisplayRecoverPassword((lastState) => !lastState);
                  }}
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <p className="text-sm text-white mt-2 ">
              New at ToDoApp?{" "}
              <Link to="/Signup">
                <span className="font-bold underline cursor-pointer">
                  Register now
                </span>
              </Link>
            </p>
            {displayRecoverPassoword && (
              <div className="mt-4">
                <input
                  className="outline-none"
                  type="text"
                  placeholder="Email..."
                  name="emailRecoverPassword"
                  onChange={(event) => setRecoverEmail(event.target.value)}
                />
                <button
                  disabled={!recoverEmail}
                  className={`${
                    !recoverEmail
                      ? "disabled-button2"
                      : "text-white mt-2 border-2 px-1"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    try {
                      dispatch(recoverPassword(recoverEmail));
                      setRecoverPasswordEmailSent(true);
                    } catch (error) {
                      console.log(error.message);
                    }
                  }}
                >
                  Recover Password
                </button>
                <button
                  className="text-white ml-4 border-2 px-1"
                  onClick={() =>
                    setDisplayRecoverPassword((lastState) => !lastState)
                  }
                >
                  Cancel
                </button>
                {recoverPasswordEmailSent && (
                  <p className="text-sm text-green-600">
                    Recover password email has been sent!
                  </p>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signin;
