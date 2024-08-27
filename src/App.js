import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import SignIn from "./components/LoginComponent/SignInPage/SignIn";
import SignUp from "./components/LoginComponent/SignUpPage/SignUp";
import Home from "./components/HomeComponent/Home";
import NavBar from "./components/navbar/NavBar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import Loading from "./components/LoadingComponent/Loading";

function App() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });
    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) return <Loading />;

  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={currentUser ? <Home /> : <SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
