import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/authReducer";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

function Perfil({ onClose, open }) {
  /* efeito abrir o Perfil para editar .. efeito definido pelo props open q é dado pelo Home qnd carregamos em perfil  */
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (open) {
      setIsTransitioning(true);
    } else {
      setIsTransitioning(false);
    }
  }, [open]);

  /* Envio de dados para o firebase do update do perfil */
  const currentUser = useSelector(selectCurrentUser);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);

  const submitHandlerPerfil = async (event) => {
    event.preventDefault();
    const dbPath = doc(db, "users", `${currentUser}`);

    if (photo) {
      const storage = getStorage();
      const storageRef = ref(storage, `users/${currentUser}/profilePhoto`);
      await uploadBytes(storageRef, photo);
      const photoUrl = await getDownloadURL(storageRef);

      await updateDoc(dbPath, { perfil: { name: name, photo: photoUrl } });
    } else {
      await updateDoc(dbPath, { perfil: { name: name } });
    }
  };

  return (
    <div className="w-full h-full fixed left-0 top-0 flex justify-center items-center z-30">
      <div
        className="w-full h-full absolute bg-black bg-opacity-70 backdrop-filter backdrop-blur-sm "
        onClick={onClose}
      />
      {/* div do modal da edição do perfil com o isTransitioning para dar o efeito quando é para ver ou não o model , quando isTransitioning é true da´se o efeito */}
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
              className="w-full rounded border-none mt-2 pl-2"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="foto">Photo:</label>
            <input
              type="file"
              id="foto"
              name="foto"
              className="w-full rounded border-none mt-2"
              onChange={(event) => setPhoto(event.target.files[0])}
            />
          </div>
          <button
            onClick={submitHandlerPerfil}
            className="bg-gray-600 px-4 py-1 mt-6 rounded block text-xl text-white font-bold transform transition duration-200 hover:scale-110"
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
