import { useState } from "react";

const ChatInput = ({
  onSend,
}) => {

  const [message, setMessage] = useState("");

  const handleSend = () => {

    onSend(message);

    setMessage("");

  };

  return (

    <div className="chat-input">

      <input
        type="text"
        placeholder="Type message..."
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
      />

      <button onClick={handleSend}>

        Send

      </button>

    </div>

  );

};

export default ChatInput;