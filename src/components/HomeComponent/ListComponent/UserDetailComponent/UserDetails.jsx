import React from "react";
import "./UserDetails.css";
import { Typography, IconButton, Avatar } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import VideocamIcon from "@mui/icons-material/Videocam";
import { useUserStore } from "./../../../../lib/userStore";

const UserDetails = () => {
  const { currentUser } = useUserStore();
  return (
    <div className="user-details">
      <div className="user">
        <Avatar
          x={{ objectFit: "cover" }}
          alt={currentUser.username}
          src={currentUser.imageUrl}
        />

        <Typography variant="h3">{currentUser.username}</Typography>
      </div>
      <div className="actionIcons">
        <IconButton aria-label="more">
          <MoreVertIcon />
        </IconButton>
        <IconButton aria-label="video">
          <VideocamIcon />
        </IconButton>
        <IconButton aria-label="edit">
          <EditIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default UserDetails;
