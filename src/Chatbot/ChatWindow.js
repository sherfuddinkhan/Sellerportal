import { useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

const ChatWindow = () => {

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! How can I help you?"
    }
  ]);

  const sendMessage = (message) => {

    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: message
      }
    ]);

  };

  return (

    <div className="chat-window">

      <div className="chat-header">

        AI Assistant

      </div>

      <div className="chat-body">

        {

          messages.map((msg, index) => (

            <ChatMessage
              key={index}
              sender={msg.sender}
              text={msg.text}
            />

          ))

        }

      </div>

      <ChatInput onSend={sendMessage} />

    </div>

  );

};

export default ChatWindow;