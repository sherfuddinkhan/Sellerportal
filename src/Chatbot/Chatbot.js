import { useState } from "react";
import ChatWindow from "./ChatWindow";
import "./Chatbot.css";

const Chatbot = () => {

  const [open, setOpen] = useState(false);

  return (
    <>

      <button
        className="chatbot-button"
        onClick={() => setOpen(!open)}
      >
        💬
      </button>

      {open && <ChatWindow />}

    </>
  );

};

export default Chatbot;