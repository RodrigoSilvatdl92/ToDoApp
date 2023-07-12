import React, { useState, useEffect, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/authReducer";
import { updateDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { IoMdPhotos } from "react-icons/io";

function Perfil({ onClose, open }) {
  const fileInputRef = useRef(null);
  const currentUser = useSelector(selectCurrentUser);
  const [data, setData] = useState("");
  const [name, setName] = useState("");
  const [picture, setPicture] = useState("");
  const [photo, setPhoto] = useState("");
  /* efeito abrir o Perfil para editar .. efeito definido pelo props open q é dado pelo Home qnd carregamos em perfil  */
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    onSnapshot(doc(db, "users", currentUser), (doc) => {
      setData(doc.data().perfil);
    });
  }, [currentUser]);

  useEffect(() => {
    if (data) {
      setName(data.name);
      setPhoto(data.photo);
    }
  }, [data]);

  useEffect(() => {
    if (open) {
      setIsTransitioning(true);
    } else {
      setIsTransitioning(false);
    }
  }, [open]);

  /* Envio de dados para o firebase do update do perfil */

  console.log(photo);
  const submitHandlerPerfil = async (event) => {
    console.log(event);
    event.preventDefault();
    const dbPath = doc(db, "users", `${currentUser}`);

    const storage = getStorage();
    const storageRef = ref(storage, `users/${currentUser}/profilePhoto`);
    console.log(storageRef);
    if (picture) {
      await uploadBytes(storageRef, picture);
    }
    const photoUrl = picture ? await getDownloadURL(storageRef) : photo;

    await updateDoc(dbPath, { perfil: { name: name, photo: photoUrl } });
    onClose();
  };

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
        <form className="w-[80%] m-auto z-20 ">
          <div>
            <label htmlFor="username">Name:</label>
            <input
              onChange={(event) => setName(event.target.value)}
              type="text"
              id="name"
              name="name"
              defaultValue={name}
              className="w-full rounded border-none mt-2 pl-2"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="foto">Photo:</label>
            <input
              type="file"
              id="foto"
              name="foto"
              ref={fileInputRef}
              className="hidden"
              onChange={(event) => setPicture(event.target.files[0])}
            />
            <IoMdPhotos
              className="cursor-pointer"
              size={30}
              onClick={() => fileInputRef.current.click()}
            />
          </div>
          <button
            onClick={submitHandlerPerfil}
            className="bg-gray-600 px-4 py-1 mt-6 rounded block text-xl text-white font-semibold hover:bg-gray-500 hover:text-black"
          >
            Update Perfil
          </button>
        </form>
        <button className="absolute top-2 right-2 text-black">
          <AiOutlineClose onClick={onClose} />
        </button>
      </div>
    </div>
  );
}

export default Perfil;
