"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";

type users = {
  id:string;
  username:string;
  email:string;
  profile:string;
  created_at:string;
}

type messages = {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  createdAt: string;
};

type conversation = {
  id: string;
  user1_id: string;
  user2_id: string;
  createdAt: string;
};

export default function Home() {
  const { isSignedIn, user } = useUser();
  const [conversation, setConversation] = useState<conversation[]>([]);
  const [inputText, setInputText] = useState("");
  const [inputSearch,setInputSearch] = useState("");
  const [messages, setMessages] = useState<messages[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [searchResult,setSearchResult] = useState<users[]>([])

  const UserName = user?.username;
  const email = user?.emailAddresses[0].emailAddress;
  const profileUrl = user?.imageUrl;

  const fetchUser = async () => {
    const res = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username: UserName,
        email: email,
        profile: profileUrl,
      }),
    });
    const data = await res.json();
    console.log(data);
  };

  
  const fetchConversationsUpdate = async () => {
    const res = await fetch("/app/api/conversations",{
      method:"POST",
      body:JSON.stringify({
        user1_id:UserName,
        user2_id:"user345",
      })
      
    })
    const data = await res.json()
    setConversation(data)
  }
  const fetchConversations = async () => {
    const res = await fetch("/api/conversations", {
      method: "GET",
    });
    const data = await res.json();
    console.log(data);
    setConversation(data.result);
  };

  const fetchMessages = async (conversationId: unknown) => {
    const res = await fetch(`/api/messages?conversation_id=${conversationId}`, {
      method: "GET",
    });
    const data = await res.json();
    console.log(data);
    setMessages(data.result);
  };

  const fetchMessagesInput = async () => {
    const res = await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({
        conversation_id: selectedConversationId,
        sender_id: user?.id,
        text: inputText,
      }),
    });
    const data = await res.json();
    console.log(data);
    setInputText("");
    await fetchMessages(selectedConversationId);
  };
  const handleConversationClick = (id: string) => {
    setSelectedConversationId(id);
    fetchMessages(id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSearch = async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const value = e.target.value;
  setInputSearch(value);
    if (value === "") {
      setSearchResult([])
      return;
    }
    const res = await fetch(`/api/users?query=${inputSearch}`,{
      method:"GET"
    })
    const data = await res.json()
    console.log(data)
    setSearchResult(data.result)
  }
  useEffect(() => {
    if (!isSignedIn) {
      redirect("/sign-in");
    } else {
      fetchUser();
      fetchConversations();
      fetchConversationsUpdate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, UserName, email, profileUrl]);

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <div className="w-1/4 border-r border-gray-300 p-4 flex flex-col">
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search by email or username"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={inputSearch}
          onChange={handleSearch}
        />
        {searchResult.map((item)=>(
          <button key={item.id} onClick={fetchMessages}>
            {item.username}
          </button>
        ))}
        {/* Group create button */}
        <button className="w-full bg-blue-500 text-white py-2 rounded mb-4">
          + Create Group
        </button>

        {/* List of chats */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {conversation.map((item) => (
            <div key={item.id}>
              <div className="p-3 rounded hover:bg-gray-100 border border-gray-200 cursor-pointer">
                <div className="font-medium">
                  <button onClick={() => handleConversationClick(item.id)}>
                    {item.user1_id === user?.id ? item.user2_id : item.user1_id}
                  </button>
                </div>
                <div className="text-sm text-gray-500">Click to open cha</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-3/4 flex flex-col p-4">
        {/* Chat header */}
        {/* <div className="border-b border-gray-300 pb-2 mb-4">
          <div className="text-lg font-semibold">Ishaan Sharma</div>
          <div className="text-sm text-gray-500">Online • Typing...</div>
        </div> */}

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {/* Received message */}
          {messages.map((item) => (
            <div
              className={`flex ${
                item.sender_id === user?.id ? "justify-end" : "justify-start"
              }`}
              key={item.id}
            >
              <div
                className={`max-w-sm p-3 rounded-lg ${
                  item.sender_id === user?.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {item.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message"
            className="flex-1 p-2 border border-gray-300 rounded"
            onChange={handleInputChange}
            value={inputText}
          />
          <button
            className="bg-blue-500 text-white px-4 rounded"
            onClick={fetchMessagesInput}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
