const ChatMessage = ({
  sender,
  text,
}) => {

  return (

    <div
      className={`message ${sender}`}
    >

      {text}

    </div>

  );

};

export default ChatMessage;