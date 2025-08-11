"use client";

import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type users = {
  id: string;
  username: string;
  email: string;
  profile: string;
  created_at: string;
};

type conversation = {
  id: string;
  user1_email: string;
  user2_email: string;
  username1: string;
  username2: string;
  createdAt: string;
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isSignedIn, user } = useUser();
  const [conversation, setConversation] = useState<conversation[]>([]);
  const [inputSearch, setInputSearch] = useState("");
  const [searchResult, setSearchResult] = useState<users[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

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
    console.log(data.result);
  };
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
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
    const res = await fetch(`/api/conversations?user=${email}`, {
      method: "GET",
    });
    const data = await res.json();
    console.log(data.result);
    setConversation(data.result);
  };

  const handleSearchResult = async (item: users) => {
    const res = await fetch(`/api/conversations`, {
      method: "POST",
      body: JSON.stringify({
        sender: email,
        receiver: item.email,
        username1: user?.username,
        username2: item.username,
      }),
    });
    const data = await res.json();
    console.log(data.result);
    const convo = data.result[0];
    setConversation(data.result);
    setSelected(convo.id);
      router.push(`/messages/${convo.id}`);
      setSearchResult([])
  };

  useEffect(() => {
    if (!isSignedIn) {
      redirect("/sign-in");
    } else {
      fetchUser();
      fetchConversation();
    }
  }, [isSignedIn]);

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <div className="w-1/4 border-r border-gray-300 p-4 flex flex-col">
        {/* Search bar */}
        <div className="flex items-center gap-2  py-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search by email or username"
            className="flex-1 p-2 border border-gray-300 rounded"
            value={inputSearch}
            onChange={handleSearch}
          />
          <SignedIn>
            <UserButton afterSignOutUrl="/sign-in" />
          </SignedIn>
        </div>
        {searchResult.map((item) => (
          <button
            onClick={() => {
              handleSearchResult(item);
            }}
            key={item.id}
          >
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
            <button
              key={item.id}
              onClick={() => {
                if (selected == item.id) {
                  setSelected(null);
                } else {
                  setSelected(item.id);
                  router.push(`/messages/${item.id}`);
                }
              }}
              className="w-full text-left"
            >
              <div className="p-3 rounded hover:bg-gray-100 border border-gray-200 cursor-pointer">
                <div className="font-medium"></div>
                <div>
                  <div>
                    {item.user1_email == user?.emailAddresses[0].emailAddress
                      ? item.username2
                      : item.username1}
                  </div>
                  <div className="text-sm text-gray-500">
                    Click to open chat
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && <div className="w-3/4">{children}</div>}
    </div>
  );
}
