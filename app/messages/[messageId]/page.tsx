"use client";

import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";


type messages = {
  id?: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  createdAt?: string;
};
type conversation = {
  id: string;
  user1_email: string;
  user2_email: string;
  username1: string;
  username2: string;
  createdAt: string;
};

const Page = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<messages[]>([]);
  const [conversation, setConversation] = useState<conversation[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const { user } = useUser();
  const email = user?.emailAddresses[0].emailAddress;
  const { messageId } = useParams<{ messageId: string }>();
  console.log(messageId);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  const handleinput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);
  
  useEffect(()=>{
    const fetchConversation = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/conversations?user=${email}`, {
          method: "GET",
        });
        const data = await res.json();
        console.log(data.result);
        setConversation(data.result);
        
      } catch (error) {
        console.error("Error fetching conversation:", error);
      } finally{
        setLoading(false);
      }
    };
    fetchConversation();
  },[email]);
  
  useEffect(()=>{
    if (!socket) return;
    
    socket.emit("joinConversation", messageId);
    
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?conversation_id=${messageId}`, {
          method: "GET",
        });
        const data = await res.json();
        setMessages(data.result);
        
        
      } catch (error) {
        console.error("Error fetching messages:", error);
        
      }}
      fetchMessages();
      socket.on("newMessage", (msg: messages) => {
        setMessages((prev) => [...prev, msg]);
      });
      
      return () => {
        socket.off("newMessage");
      };
      
    },[messageId, socket]);
    
    
    const fetchMessagesInput = async () => {
      const convo = conversation.find((item) => item.id.toString() === messageId);
      if (!inputText.trim() || !user || !socket || !convo) return;
  
      const newMsg: messages = {
        conversation_id: messageId,
        content: inputText,
        sender_id: user.username!,
        receiver_id:
          convo?.user1_email == email ? convo.username2 : convo.username1,
      };
  
      socket.emit("sendMessage", newMsg);
      setInputText("");
    };

    
  if (loading) {
    return <div className="p-4">Loading conversation...</div>;
  }

  return (
    <div className="h-full w-full flex flex-col p-4">
      {/* Chat header */}

      {conversation
        .filter((item) => item.id == messageId)
        .map((item) => (
          <div
            className="border-b border-gray-300 pb-3 mb-4 flex items-center justify-between"
            key={item.id}
          >
            <div>
              <div className="text-lg font-semibold">
                {item.user2_email == user?.emailAddresses[0].emailAddress
                  ? item.username1
                  : item.username2}
              </div>
              <div className="text-sm text-gray-500">
                Tap for More Information...
              </div>
            </div>
            <button className="text-gray-500 hover:text-gray-700">⋮</button>
          </div>
        ))}

      <div
        className="flex-1 overflow-y-auto space-y-3 px-2 mb-4 "
        ref={containerRef}
      >
        {messages.map((item) => {
          const isSender = item.sender_id === user?.username;
          return (
            <div
              key={item.id}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
                  isSender
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-black rounded-bl-none"
                }`}
              >
                {item.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-300 flex gap-2 items-center">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={handleinput}
          value={inputText}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchMessagesInput();
            }
          }}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full shadow-sm"
          onClick={fetchMessagesInput}
        >
          Send
        </button>
      </div>
    </div>
  );
};
export default Page;
