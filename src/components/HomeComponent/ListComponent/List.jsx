import React from "react";
import "./List.css";
import UserDetails from "./UserDetailComponent/UserDetails";
import ChatList from "./ChatListComponent/ChatList";

const List = () => {
  return (
    <div className="list">
      <UserDetails />

      <ChatList />
    </div>
  );
};

export default List;
