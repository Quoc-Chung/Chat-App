import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage";
import Status from "./Components/Status/Status";
import StatusViewer from "./Components/Status/StatusViewer";
import SignIn from "./Components/SignIn_SignUp/SignIn";
import SignUp from "./Components/SignIn_SignUp/SignUp";
import { ToastContainer } from "react-toastify";
import VerifyOtpAndResetPassword from "./Components/ForgotPassword/VerifyOtpAndResetPassword";
const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/status" element={<Status />}>
          {" "}
        </Route>
        <Route path="status/:userId" element={<StatusViewer />}>
          {" "}
        </Route>
        <Route path="/signin"  element={<SignIn />}/>

        <Route path="/signup" element={<SignUp />}/>
        <Route path="/verify-otp" element={<VerifyOtpAndResetPassword />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
};

export default App;
