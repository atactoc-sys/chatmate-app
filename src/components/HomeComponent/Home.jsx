import React from "react";
import "./Home.css";
import List from "./ListComponent/List";
import Chat from "./ChatComponent/Chat";

import { useChatStore } from "../../lib/chatStore";
import EmptyView from "./EmptyContainer/EmptyView";

const Home = () => {
  const { chatId } = useChatStore();
  return (
    <div className="homeComponent">
      <List />
      {chatId ? <Chat /> : <EmptyView />}
    </div>
  );
};

export default Home;
