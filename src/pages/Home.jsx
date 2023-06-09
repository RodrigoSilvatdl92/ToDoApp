import React, { useState, useEffect } from "react";
import { logOut, selectCurrentUser } from "../store/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

import Instructions from "../components/Instructions";
import Perfil from "../components/Perfil";
import Calendar from "../components/Calendar";
import SearchBar from "../components/SearchBar";
import logo from "../imagens/logo.jpg";

function Home() {
  const dispatch = useDispatch();

  const [PerfilVisible, setPerfilVisible] = useState(false);
  const [PerfilOpen, setPerfilOpen] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  const handlerPerfilClick = () => {
    setPerfilVisible((lastState) => !lastState);
    if (!PerfilVisible) {
      setPerfilOpen(true);
    }
  };

  /* loading do name e da photo do perfil  */

  const currentUser = useSelector(selectCurrentUser);
  const [data, setData] = useState("");

  useEffect(() => {
    onSnapshot(doc(db, "users", `${currentUser}`), (doc) => {
      setData(doc.data().perfil);
    });
  }, [currentUser]);

  console.log(data);

  return (
    <div className="max-w-screen-xl m-auto px-2 ">
      <div className="flex  items-center justify-center max-h-[240px] w-full rounded-md  shadow-lg shadow-black/5 dark:shadow-black/30">
        <div className="w-[33%] self-end pb-4">
          <img src={logo} alt="/" className="w-[100px] " />
        </div>
        <div className="w-[34%] text-2xl text-center md:text-6xl pb-4">
          To Do App
        </div>
        <div className="w-[33%] flex-col items-end ">
          <div className="flex-col">
            <img
              className=" ml-auto mr-4 mt-2 w-[40px] rounded-[50%] h-[40px] object-cover  md:rounded-[50%] md:w-[60px] md:h-[60px] md:object-cover"
              src={data?.photo}
              alt="/"
            />
            <div className="text-black text-right pr-4 text-base md:text-2xl w-[100%] mt-1 mb-4 ">
              <p>Hello</p>
              <p>{data?.name}</p>
            </div>
          </div>
          <div className="flex justify-end mb-4">
            <button
              onClick={handlerPerfilClick}
              className="bg-gray-600 p-1 mr-4 rounded block md:text-xl text-sm text-white font-semibold  transform 
              transition duration-200 hover:bg-gray-500 hover:text-black  "
            >
              Perfil
            </button>
            <button
              className="bg-gray-600 p-1 mr-4 rounded block md:text-xl text-sm text-white font-semibold  transform 
              transition duration-200 hover:bg-gray-500 hover:text-black "
              onClick={() => setInstructionsOpen(true)}
            >
              Instructions
            </button>
            <button
              onClick={() => dispatch(logOut())}
              className="bg-gray-600 p-1 mr-4 rounded block md:text-xl text-sm text-white font-semibold  transform 
              transition duration-200 hover:bg-gray-500 hover:text-black w-[100px] whitespace-nowrap"
            >
              Log Out
            </button>
          </div>
        </div>
        <div className="flex-col justify-center h-full ">
          <div className="flex justify-center " />
          {instructionsOpen ? (
            <Instructions
              onClose={() => setInstructionsOpen(false)}
              open={instructionsOpen}
            />
          ) : (
            ""
          )}
          {PerfilVisible ? (
            <Perfil onClose={handlerPerfilClick} open={PerfilOpen} />
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="h-[800px]">
        <div className="mt-4">
          <SearchBar />
        </div>
        <Calendar />
      </div>
      <p className="text-sm text-right"></p>
    </div>
  );
}

export default Home;
