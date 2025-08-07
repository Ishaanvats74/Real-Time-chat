"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type users = {
  id: string;
  username: string;
  email: string;
  profile: string;
  created_at: string;
};

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

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isSignedIn, user } = useUser();
  const [conversation, setConversation] = useState<conversation[]>([]);
  const [inputSearch, setInputSearch] = useState("");
  const [searchResult, setSearchResult] = useState<users[]>([]);
  const router = useRouter();

  const UserName = user?.username;
  const email = user?.emailAddresses[0].emailAddress;
  const profileUrl = user?.imageUrl;

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputSearch(value);
    if (value == "") {
      setSearchResult([]);
    } else {
      const res = await fetch(`/api/users?query=${value}`, {
        method: "GET",
      });
      const data = await res.json();
      console.log(data.result);
      setSearchResult(data.result);
    }
  };

  const fetchConversation = async () => {
    const res = await fetch(`/api/conversations?user=${email}`, { method: "GET" });
    const data = await res.json();
    console.log(data.result);
    setConversation(data.result);
  };

  const handleSearchResult = async (item: users) => {
    const res = await fetch(`/api/conversations`, {
      method: "POST",
      body: JSON.stringify({ sender: email, recieve: item.email }),
    });
    const data = await res.json();
    console.log(data.result)
    router.push(`/messages/${item.id}`); 
  };
  useEffect(() => {
    if (!isSignedIn) {
      redirect("/sign-in");
    } else {
      fetchConversation();

      console.log(user?.id);
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
        {searchResult.map((item) => (
          <button onClick={() => handleSearchResult(item)} key={item.id}>
            <div className="flex justify-between items-center">
              <div>{item.username}</div>
              <div className="">{item.email}</div>
            </div>
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
                  <Link href={`/app/messages/${item.user2_id}`}>
                    {item.user1_id === user?.id ? item.user2_id : item.user1_id}
                  </Link>
                </div>
                <div className="text-sm text-gray-500">Click to open chat</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div>{children}</div>
    </div>
  );
}
