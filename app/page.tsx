"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Search, MoreVertical, Video, Phone, Mic } from "lucide-react";
import { useEffect, useState } from "react";
import { UUID } from "crypto";
import Image from "next/image";

type users = {
  username: string;
  email: string;
  profile: string;
};

type Chats = {
  id: UUID;
  email:string;
  username:string;
  profile:string;
  createdAt : string;
}

export default function Home() {
  const [selected, setSelected] = useState<string | null>(null);
  const [Chats,setChats] = useState<Chats[]>([])
  const { isSignedIn, user } = useUser();
  const [isGroup,setisGroup] = useState<boolean>(false)
  const router = useRouter();
  const username = user?.username;
  const email = user?.emailAddresses[0].emailAddress;
  const profile = user?.imageUrl;


  const fetchData = async (user: users) => {
    const res = await fetch("/api/user", {
      method: "Post",
      body: JSON.stringify(user),
    });
    const data = await res.json();
    console.log(data);
  };
  const fetchChats = async()=>{
    const res = await fetch("/api/user",{
      method:"GET"
    })
    const data = await res.json()
    console.log(data)
    setChats(data.result)
  }

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    if (!username || !email || !profile) {
      return;
    }
    fetchData({ username, email, profile });
    fetchChats()
  }, [isSignedIn, router, username, email, profile]);

  const handleMessage = async(user:Chats)=>{
    setSelected(selected === user.id ? null : user.id)
    const res = await fetch("/api/conversation",{
      method:"POST",
      body:JSON.stringify({
        type :isGroup,
        
      })
    })
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Chat List */}
      <aside className="w-[26%] bg-[#1e1e1e] text-white flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h1 className="text-lg font-semibold">Chats</h1>
          <MoreVertical className="h-5 w-5 text-gray-300" />
        </div>

        {/* Search bar */}
        <div className="p-3">
          <div className="flex items-center bg-[#2a2a2a] rounded-full px-3 py-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search or start a new chat"
              className="bg-transparent ml-2 text-sm w-full text-white placeholder:text-gray-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Chat list */}
        <div className="overflow-y-auto flex-1 no-scrollbar">
          {Chats.map((user) => (
            <div
              key={user.id}
              className="flex items-center px-4 py-3 hover:bg-[#333] cursor-pointer"
              onClick={() => handleMessage(user)}
            >
              <Image src={user.profile}alt={`${user.username}`} width={40} height={40} className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-semibold" />
    
              <div className="ml-3">
                <p className="font-medium text-white">{user.username}</p>
                <p className="text-xs text-gray-400 truncate">
                  last message preview...
                </p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      {selected ? (
        <main className="flex-1 flex flex-col bg-[#101010] relative">
          {/* Chat header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <div>
              <p className="text-white font-semibold">Geek Room Team</p>
              <p className="text-sm text-gray-400">select for group info</p>
            </div>
            <div className="flex items-center space-x-4 text-gray-300">
              <Video className="w-5 h-5 cursor-pointer" />
              <Phone className="w-5 h-5 cursor-pointer" />
              <MoreVertical className="w-5 h-5 cursor-pointer" />
            </div>
          </div>

          {/* Chat body */}
          <div className="flex-1 overflow-y-auto p-6 bg-[url('/whatsapp-pattern.png')] bg-cover">
            {/* Message bubbles */}
            <div className="flex flex-col space-y-3">
              <div className="self-end max-w-[60%] bg-green-600 text-white rounded-xl px-4 py-2">
                <p>Yeh raaz bhi mere hi saath chla jayega</p>
              </div>
              <div className="self-start max-w-[60%] bg-[#2d2d2d] text-white rounded-xl px-4 py-2">
                <p>wrna mujhe admin banade main chod deta hoon</p>
              </div>
            </div>
          </div>

          {/* Message input */}
          <div className="flex items-center px-4 py-2 bg-[#1a1a1a] border-t border-gray-700">
            <input
              type="text"
              placeholder="Type a message"
              className="flex-1 bg-transparent text-white placeholder:text-gray-400 focus:outline-none"
            />
            <Mic className="w-5 h-5 text-gray-400 ml-4 cursor-pointer" />
          </div>
        </main>
      ) : (
        <main className="flex-1 flex flex-col bg-[#101010] relative"></main>
      )}
    </div>
  );
}
