'use client';

import { useUser } from '@clerk/nextjs';
import React, { useState } from 'react'

type messages = {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  createdAt: string;
};
const Page = () => {
    const [messages,setMessages] = useState<messages[]>([])
    const {user} = useUser()

    const fetchMessages = async () => {
        const res = await fetch(`/api/messages`,{method:"GET"})
    }
  return (
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
  )
}

export default Page
