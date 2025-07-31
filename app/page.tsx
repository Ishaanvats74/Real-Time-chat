"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Search, MoreVertical, Video, Phone, Mic } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [selected, setSelected] = useState<string | null>(null);
  const { isSignedIn } = useUser();
  const router = useRouter();

  if (!isSignedIn) {
    router.push("/sign-in");
    return;
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
          {[
            "Ayush",
            "Mayank",
            "Code Vinu",
            "Papa",
            "Ashima",
            "BSC CS",
            "Geek Room Team",
            "Ayush",
            "Mayank",
            "Code Vinu",
            "Papa",
            "Ashima",
            "BSC CS",
            "Geek Room Team",
          ].map((user, idx) => (
            <div
              key={idx}
              className="flex items-center px-4 py-3 hover:bg-[#333] cursor-pointer"
              onClick={() => setSelected(selected === user ? null : user)}
            >
              <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-semibold">
                {user.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="font-medium text-white">{user}</p>
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
                {/* <Image
                src="/crying-cat-meme.jpg"
                alt="meme"
                className="mt-2 rounded-lg"
                /> */}
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
