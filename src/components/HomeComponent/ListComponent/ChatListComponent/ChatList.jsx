import React, { useEffect, useState } from "react";
import "./ChatList.css";
import { Avatar, Button, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddUser from "./AddUserComponent/AddUser";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useUserStore } from "../../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useChatStore } from "../../../../lib/chatStore";

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState(""); // Initialize as an empty string
  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();

  useEffect(() => {
    if (!currentUser.id) return; // Ensure currentUser.id exists

    const unSub = onSnapshot(
      doc(db, "userChats", currentUser.id),
      async (res) => {
        const items = res.data()?.chats || [];

        const chatData = await Promise.all(
          items.map(async (item) => {
            try {
              const userDocRef = doc(db, "users", item.receiverId);
              const userDocSnap = await getDoc(userDocRef);

              if (userDocSnap.exists()) {
                const user = userDocSnap.data();
                return { ...item, user };
              }
            } catch (err) {
              console.error("Error fetching user data:", err);
              return null;
            }
            return null;
          })
        );

        setChats(
          chatData.filter(Boolean).sort((a, b) => b.updatedAt - a.updatedAt)
        );
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    if (chatIndex > -1) {
      userChats[chatIndex].isSeen = true;
    }

    const userChatRef = doc(db, "userChats", currentUser.id);

    try {
      await updateDoc(userChatRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user?.username?.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="chat-list">
      <div className="search">
        <div className="searchbar">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search People"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <Button variant="contained" onClick={() => setAddMode((prev) => !prev)}>
          {addMode ? <RemoveIcon /> : <AddIcon />}
        </Button>
      </div>

      {chats.length === 0 ? (
        <Typography>No chats available</Typography>
      ) : (
        filteredChats.map((chat) => (
          <div
            className="item"
            key={chat.chatId}
            onClick={() => handleSelect(chat)}
            style={{
              backgroundColor: chat?.isSeen ? "transparent" : "#008C76FF",
            }}
          >
            <KeyboardArrowRightIcon />

            <Avatar
              alt={chat.user?.username || "User"}
              src={
                chat.user?.blocked?.includes(currentUser.id)
                  ? "User"
                  : chat.user?.imageUrl
              }
            />
            <div className="texts">
              <Typography variant="h4">
                {chat.user?.blocked?.includes(currentUser.id)
                  ? "User"
                  : chat.user?.username}
              </Typography>
              <Typography>{chat.lastMessage || "No messages yet"}</Typography>
            </div>
          </div>
        ))
      )}

      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
