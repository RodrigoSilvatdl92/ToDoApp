import { createSlice } from "@reduxjs/toolkit";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  arrayUnion,
  doc,
  setDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

const initialState = {
  currentUser: "",
  currentUserId: "",
  error: null,
  events: [],
  holidays: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.currentUser = action.payload.email;
      state.currentUserId = action.payload.id;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setEvents(state, action) {
      state.events = action.payload;
    },
    setHolidays(state, action) {
      state.holidays = action.payload;
    },
  },
});

export const { setUser, setError, setEvents, setHolidays } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectError = (state) => state.auth.error;
export const selectCurrentUserId = (state) => state.auth.currentUserId;
export const selectEvents = (state) => state.auth.events;
export const selectHolidays = (state) => state.auth.holidays;

/* sign up */
export const signUp = async (email, password) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await sendEmailVerification(user);
    await setDoc(doc(db, "users", email), {
      toDoList: [],
      perfil: {
        name: "",
        photo: "",
      },
    });

    return { user: user, error: null };
  } catch (error) {
    console.log(error.message);
    return { user: null, error: error };
  }
};

/* log in */

export const logIn = (email, password) => {
  return async (dispatch) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      if (!user) {
        throw new Error("Wrong Password");
      }

      if (user.emailVerified) {
        dispatch(setError(""));
        dispatch(setUser({ email: user.email, id: user.uid }));
      } else {
        throw new Error("Please verify your email before logging in");
      }
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        return dispatch(
          setError("User does not exist, please register an account ")
        );
      }
      dispatch(setError(error.message));
    }
  };
};

/* log out */
export const logOut = () => {
  return async (dispatch) => {
    try {
      await signOut(auth);
      dispatch(setUser({ email: "", id: "" }));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };
};

/* recover passowrd */

export const recoverPassword = (email) => {
  console.log(email);
  return async (dispatch) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("password reset email sent!");
    } catch (error) {
      console.log(error.message);
    }
  };
};

/* add events */

export const addEvent = (event) => {
  console.log("chegou aqui ao addEvent");
  return async (dispatch, getState) => {
    try {
      const { currentUser, events } = getState().auth;

      const { title, start, end, priority } = event;
      console.log(
        `title:${title}, start:${start}, end:${end}, priority:${priority}`
      );
      const id = new Date(start).getTime();

      const dbToDoList = doc(db, "users", `${currentUser}`);

      dispatch(setEvents([...events, event]));
      await updateDoc(dbToDoList, {
        toDoList: arrayUnion({
          title: title,
          start: start,
          end: end,
          priority: priority,
          id: id,
        }),
      });
    } catch (error) {
      console.log(error.message);
    }
  };
};

export const loadEvents = () => {
  return async (dispatch, getState) => {
    try {
      const { currentUser } = getState().auth;
      const dbToDoList = doc(db, "users", `${currentUser}`);
      onSnapshot(doc(db, "users", `${currentUser}`), async (doc) => {
        const data = doc.data().toDoList;

        const eventsFiltered = data?.filter((event) => {
          const dateString = event.end;
          const date = new Date(dateString);
          const now = new Date();

          return date > now;
        });

        if (eventsFiltered) {
          await updateDoc(dbToDoList, { toDoList: eventsFiltered });
          dispatch(setEvents(eventsFiltered));
        } else {
          return;
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };
};
