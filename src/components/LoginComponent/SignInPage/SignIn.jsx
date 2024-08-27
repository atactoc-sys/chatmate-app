import React from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../lib/firebase";

const SignIn = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // Navigate to home after successful sign-in
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="signInComponent">
      <div className="signinContainer">
        <Typography variant="h4">Welcome Back!</Typography>
        <form onSubmit={handleSignIn}>
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
            variant="contained"
            fullWidth
            className="loginButton"
            type="submit"
          >
            Login
          </Button>
        </form>
        <Typography>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            style={{ cursor: "pointer", color: "blue" }}
          >
            Sign Up
          </span>
        </Typography>
      </div>
    </div>
  );
};

export default SignIn;
