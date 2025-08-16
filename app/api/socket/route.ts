import { Server } from "socket.io";
import 'dotenv/config';
import http from "http";
import { neon } from "@neondatabase/serverless";


const sql = neon(process.env.DATABASE_URL!);
const httpServer = http.createServer();


export async function GET() {
    
    const io = new Server(httpServer, {
        cors: {
            origin: "*", // Allow all origins for development; restrict in production
            methods: ["GET", "POST"],
        },
    });
    
    io.on("connection", (socket) => {
        console.log("User Connected:", socket.id);
        
        socket.on("joinConversation", async (conversationId) => {
            try {
                socket.join(conversationId.toString());
                console.log(`📌 User ${socket.id} joined conversation ${conversationId}`);
            } catch (error) {
                console.error("Error joining conversation:", error);
            }
        });
        
        socket.on("sendMessage", async (msg) => {
            try {
                const { conversation_id, content, sender_id, receiver_id } = msg;
                
                console.log("Received message to send:", msg);
                
                const result = await sql`
                INSERT INTO messages (conversation_id, sender_id, receiver_id, content)
                VALUES (${conversation_id}, ${sender_id}, ${receiver_id}, ${content})
                RETURNING id, conversation_id, sender_id, receiver_id, content, created_at
            `;
            console.log("Message inserted into database:", result);
            
            
            // Get the inserted message with its ID and timestamp
            const insertedMessage = result[0];
            
            // Broadcast the message with the database-generated data
            const messageToSend = {
                id: insertedMessage.id,
                conversation_id: insertedMessage.conversation_id,
                sender_id: insertedMessage.sender_id,
                receiver_id: insertedMessage.receiver_id,
                content: insertedMessage.content,
                createdAt: insertedMessage.created_at
            };
            
            
            
            console.log("Broadcasting message to room:", conversation_id);
            console.log("Message data:", messageToSend);
            
            io.to(conversation_id.toString()).emit("newMessage", messageToSend);
            
            io.to(conversation_id.toString()).emit("conversationUpdated",{
                conversation_id: insertedMessage.conversation_id,
                new_message_time: insertedMessage.created_at,
            })
            
        } catch (error) {
            console.error("Error sending message:", error);
            console.error("Error details:", error);
            socket.emit("messageError", { error: "Failed to send message" });
        }
    });
    
    
    
    socket.on("disconnect", () => {
        console.log("User Disconnected:", socket.id);
    });
});

const PORT =  3001;

httpServer.listen(PORT, () => {
    console.log(`Socket.IO server is running on port ${PORT}`);
});
}