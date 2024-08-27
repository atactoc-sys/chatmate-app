import React, { useState } from "react";
import "./AddUser.css";
import { Avatar, Divider, IconButton, Typography } from "@mui/material";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../../../lib/firebase";
import { useUserStore } from "../../../../../lib/userStore";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const AddUser = () => {
  const { currentUser } = useUserStore();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapShot = await getDocs(q);
      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
        setError(null); // Reset error if search is successful
      } else {
        setUser(null);
        setError("User not found.");
      }
    } catch (err) {
      console.error("Error searching user:", err);
      setError("Failed to search for user.");
    }
  };

  const handleAdd = async () => {
    if (!user) return;

    try {
      const newChatRef = doc(collection(db, "chats"));
      const chatId = newChatRef.id;

      // Create a new chat document
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      // Update userChats for the searched user
      await updateDoc(doc(db, "userChats", user.id), {
        chats: arrayUnion({
          chatId,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      // Update userChats for the current user
      await updateDoc(doc(db, "userChats", currentUser.id), {
        chats: arrayUnion({
          chatId,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });

      setUser(null); // Clear user after adding to chat
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error("Error adding user to chat:", error);
      setError("Failed to add user to chat.");
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="UserName" name="username" />
        {/* <Button type="submit" variant="contained" className="searchButton">
          Search
        </Button> */}
        <IconButton type="submit" variant="contained" className="searchButton">
          <PersonSearchIcon />
        </IconButton>
      </form>

      {error && <Typography color="error">{error}</Typography>}

      {user && (
        <div className="items">
          <Divider
            style={{
              color: "#d32e5eff",
              marginTop: "20px",
              marginBottom: "5px",
            }}
          />
          <div className="user">
            <div className="detail">
              <Avatar
                alt={user.username}
                src={user.imageUrl}
                className="userPhoto"
              />
              <Typography>{user.username}</Typography>
            </div>
            {/* <Button
              variant="contained"
              className="adduserbutton"
              onClick={handleAdd}
            >
              Add User
            </Button> */}
            <IconButton className="adduserbutton" onClick={handleAdd}>
              <PersonAddIcon />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUser;
