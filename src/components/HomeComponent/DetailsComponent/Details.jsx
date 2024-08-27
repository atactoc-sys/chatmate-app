import React from "react";
import "./Details.css";
import { Avatar, Button, Typography } from "@mui/material";
import BlockIcon from "@mui/icons-material/Block";
import { useChatStore } from "../../../lib/chatStore";
import { useUserStore } from "../../../lib/userStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

const Details = () => {
  const { user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
  const { currentUser } = useUserStore();
  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="details">
      <div className="userprofile">
        <Avatar
          alt={user?.username || "User"}
          src={user?.imageUrl || "./default-avatar.jpg"}
          sx={{ width: 50, height: 50, objectFit: "cover" }}
        />

        <Typography variant="h4">{user?.username}</Typography>
        <Typography>Lorem ipsum dolor, sit</Typography>
      </div>
      <div className="info">
        <Button
          variant="contained"
          endIcon={<BlockIcon />}
          onClick={handleBlock}
        >
          {isCurrentUserBlocked
            ? "Bloched"
            : isReceiverBlocked
            ? "User blocked"
            : "Bock User"}
        </Button>
      </div>
    </div>
  );
};

export default Details;
