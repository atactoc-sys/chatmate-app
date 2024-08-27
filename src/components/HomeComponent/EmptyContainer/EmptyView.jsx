import React from "react";
import "./EmptyView.css";
import { Typography } from "@mui/material";
const EmptyView = () => {
  return (
    <div className="empty">
      <Typography variant="h3">Start a new conversation</Typography>
      <Typography variant="h5">Messages will apere here</Typography>
    </div>
  );
};

export default EmptyView;
