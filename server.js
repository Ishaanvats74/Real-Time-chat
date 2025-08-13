import { Server } from "socket.io";
import http from "http";

const httpServer = http.createServer();

const io = new Server(httpServer,{
    cors: { origin: "*" }
})


io.on("connection",(socket)=>{
    console.log("User Connected:", socket.id);

    socket.on("joinConversation",async(conversationId)=>{
      socket.join(conversationId)
      console.log(`📌 User ${socket.id} joined conversation ${conversationId}`);
    })

    socket.on("sendMessage",async(msg)=>{
        const {conversationId,content,senderId,receiverId} = msg 
        io.to(conversationId).emit("newMessage",msg);
         await sql`
      INSERT INTO messages (conversation_id, sender_id, receiver_id, content)
      VALUES (${conversationId}, ${senderId}, ${receiverId}, ${content})
    `;
    })

    socket.on("disconnect",()=>{
        console.log("User Disconnected:", socket.id);
    })
})

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})