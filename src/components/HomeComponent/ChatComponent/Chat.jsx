import React, { useEffect, useRef, useState } from "react";
import "./Chat.css";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import InfoIcon from "@mui/icons-material/Info";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import MicIcon from "@mui/icons-material/Mic";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import MoodIcon from "@mui/icons-material/Mood";
import SendIcon from "@mui/icons-material/Send";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
import { useUserStore } from "../../../lib/userStore";
import upload from "./../../../lib/upload";
import Details from "../DetailsComponent/Details";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [chat, setChats] = useState(null);
  const endRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  const { currentUser } = useUserStore();
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  useEffect(() => {
    if (!chatId) return;

    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChats(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImage = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0], // Corrected property name to 'file'
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    let imgUrl = null;

    if (text.trim() === "" && !img.file) return; // Ensure not sending empty message or image
    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userChatUpdate = async (id) => {
        const userChatRef = doc(db, "userChats", id);
        const userChatsSnapshot = await getDoc(userChatRef);
        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );
          if (chatIndex > -1) {
            userChatsData.chats[chatIndex].lastMessage = text;
            userChatsData.chats[chatIndex].isSeen =
              id === currentUser.id ? true : false;
            userChatsData.chats[chatIndex].updatedAt = Date.now();

            await updateDoc(userChatRef, {
              chats: userChatsData.chats,
            });
          }
        }
      };

      await Promise.all([
        userChatUpdate(currentUser.id),
        userChatUpdate(user.id),
      ]);
    } catch (err) {
      console.error(err);
    }
    setText(""); // Clear the input after sending the message
    setImg({
      file: null,
      url: "",
    });
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chat">
      <div className="up">
        <div className="user">
          <Avatar
            sx={{ width: 48, height: 48, objectFit: "cover" }}
            alt={user?.username}
            src={user?.imageUrl || "./avatar.jpg"}
          />
          <div className="details">
            <Typography variant="h4">{user?.username}</Typography>
            <Typography>Online</Typography>
          </div>
        </div>
        <div className="icons">
          <IconButton aria-label="call">
            <CallIcon />
          </IconButton>
          <Divider
            sx={{
              color: "#f525485e",
              display: "flex",
              alignItems: "center",
              border: "1px solid",
              borderRadius: 2,
            }}
            orientation="vertical"
            variant="middle"
            flexItem
          />
          <IconButton aria-label="video call">
            <VideoCallIcon />
          </IconButton>
          <Divider
            sx={{
              color: "#f525485e",
              display: "flex",
              alignItems: "center",
              border: "1px solid",
              borderRadius: 2,
            }}
            orientation="vertical"
            variant="middle"
            flexItem
          />
          <IconButton aria-label="info" onClick={toggleDrawer}>
            <InfoIcon />
          </IconButton>
        </div>
      </div>
      <div className="middle">
        {chat?.messages?.map((message, index) => (
          <div
            className={
              message.senderId === currentUser?.id ? "message our" : "message"
            }
            key={index}
          >
            <div className="texts">
              {message.img && <img src={message.img} alt="sent-img" />}
              <Typography>{message?.text}</Typography>
            </div>
          </div>
        ))}
        {img.url && (
          <div className="message our">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>

      <div className="down">
        <div className="barContent">
          <IconButton
            aria-label="emoji"
            onClick={() => setOpen((prev) => !prev)}
          >
            <MoodIcon />
          </IconButton>
          {open && (
            <div className="picker">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}

          <input
            type="text"
            placeholder="Write your message here"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
          />

          <label htmlFor="file-upload">
            <IconButton
              aria-label="insert photo"
              component="span"
              disabled={isCurrentUserBlocked || isReceiverBlocked}
              style={{
                backgroundColor: "#f7c5cc",
                color: isHovered ? "#3c1053ff" : "#df6589ff",
                border: "none",
                padding: "8px",
                boxShadow: "none",
                cursor:
                  isCurrentUserBlocked || isReceiverBlocked
                    ? "not-allowed"
                    : "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <InsertPhotoIcon />
            </IconButton>
          </label>
          <input
            type="file"
            id="file-upload"
            style={{ display: "none" }}
            onChange={handleImage}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
          />

          <IconButton aria-label="photo camera">
            <PhotoCameraIcon />
          </IconButton>
          <IconButton aria-label="mic">
            <MicIcon />
          </IconButton>
        </div>
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </Button>
      </div>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer}
        classes={{ paper: "drawerPaper" }}
      >
        <Box p={2} width="250px" role="presentation" className="drawerContent">
          <Details />
        </Box>
      </Drawer>
    </div>
  );
};

export default Chat;
