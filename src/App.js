import SignIn from "./pages/Signin";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import { PrivateRouteHome } from "./components/PrivateRoutes";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route element={<PrivateRouteHome />}>
        <Route path="/home" element={<Home />} />
      </Route>
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
