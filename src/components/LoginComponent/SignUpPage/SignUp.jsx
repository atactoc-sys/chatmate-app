import React, { useState } from "react";
import "./SignUp.css";
import {
  Button,
  IconButton,
  InputAdornment,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../../lib/upload";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleImageUploard = (e) => {
    if (e.target.files[0]) {
      setSelectedFile({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const imgUrl = await upload(selectedFile.file);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        imageUrl: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userChats", res.user.uid), {
        chats: [],
      });
      navigate("/signin");
    } catch (err) {
      console.log("Error:", err.message);
    }
  };

  return (
    <div className="signUpComponent">
      <div className="signupCntainer">
        <Typography variant="h4">Create Your Account</Typography>
        <form onSubmit={handleRegisterSubmit}>
          <TextField
            name="username"
            label="Username"
            variant="outlined"
            fullWidth
            className="inputField"
            type="text"
            placeholder="John Doe"
          />
          <TextField
            name="email"
            label="Email"
            variant="outlined"
            fullWidth
            className="inputField"
            type="email"
            placeholder="example@abc.xyz"
          />
          <TextField
            name="password"
            label="Password"
            variant="outlined"
            fullWidth
            className="inputField"
            placeholder="**********"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                    className="passwordIcon"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            component="label"
            variant="contained"
            startIcon={!selectedFile && <CloudUploadIcon />}
            className="uploadImage"
            sx={{
              backgroundImage: selectedFile
                ? `url(${selectedFile.url})`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {selectedFile ? selectedFile.file.name : "Upload file"}
            <VisuallyHiddenInput type="file" onChange={handleImageUploard} />
          </Button>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="loginButton"
          >
            Sign Up
          </Button>
        </form>
        <Typography variant="body2" className="loginLink">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/signin")}
            style={{ cursor: "pointer", color: "blue" }}
          >
            Log In
          </span>
        </Typography>
      </div>
    </div>
  );
};

export default SignUp;
