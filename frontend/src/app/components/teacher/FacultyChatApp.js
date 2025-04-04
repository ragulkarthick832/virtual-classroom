import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function TeacherChatApp() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipients, setRecipients] = useState([]); // Stores both students and parents
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const chatContainerRef = useRef(null);
  const [teacher, setTeacher] = useState({ name: "", role: "" });

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setTeacher(storedUser);
      }
      fetchRecipients(storedUser?.name);
    } catch (error) {
      console.error("Error retrieving teacher info:", error);
    }
  }, []);

  useEffect(() => {
    if (selectedRecipient) fetchMessages();
  }, [selectedRecipient]);

  // Fetch both students and parents
  const fetchRecipients = async (teacherName) => {
    if (!teacherName) return;
    try {
      const response = await axios.get(`http://localhost:5001/api/faculty/${teacherName}/recipients`);
      const recipientList = response.data.recipients.map(({ name, role }) => ({ name, role }));
      setRecipients(recipientList);
      console.log("Recipients fetched:", recipientList);
    } catch (error) {
      console.error("Error fetching recipients:", error);
    }
  };

  // Fetch messages between teacher and selected recipient
  const fetchMessages = async () => {
    if (!selectedRecipient || !teacher.name) return;
    try {
      const response = await axios.get("http://localhost:5001/api/chatBetweenUsers", {
        params: {
          senderName: teacher.name,
          senderRole: teacher.role,
          receiverName: selectedRecipient.name,
          receiverRole: selectedRecipient.role,
        },
      });
      setMessages(response.data.data);
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Send message to selected recipient
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRecipient || !teacher.name) return;

    try {
      const response = await axios.post("http://localhost:5001/api/send", {
        sender: teacher,
        receiver: selectedRecipient,
        message: newMessage,
      });

      setMessages([...messages, response.data.data]);
      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    setTimeout(() => {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <div className="chat-container bg-[#222539] p-6 rounded-lg shadow-md text-white">
      <h2 className="text-lg font-bold mb-2">Chat with Students & Parents</h2>

      <label>Select Recipient:</label>
      <select
        onChange={(e) =>
          setSelectedRecipient(recipients.find((recipient) => recipient.name === e.target.value))
        }
        className="w-full p-2 bg-gray-800 text-white rounded-lg mt-2"
      >
        <option value="">-- Choose Recipient --</option>
        {recipients.length > 0 ? (
          recipients.map((recipient, index) => (
            <option key={index} value={recipient.name}>
              {recipient.name} ({recipient.role})
            </option>
          ))
        ) : (
          <option disabled>No recipients found</option>
        )}
      </select>

      {selectedRecipient && (
        <>
          <p className="mt-2">
            Chatting with: <strong>{selectedRecipient.name} ({selectedRecipient.role})</strong>
          </p>
          <div
            ref={chatContainerRef}
            className="chat-box h-64 overflow-y-auto border p-2 rounded-lg mt-2"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender.name === teacher.name ? "text-right" : "text-left"}`}
              >
                <div
                  className={`bubble p-2 rounded-lg inline-block ${
                    msg.sender.name === teacher.name ? "bg-blue-500" : "bg-gray-700"
                  }`}
                >
                  <strong>{msg.sender.name}:</strong> {msg.message}
                </div>
              </div>
            ))}
          </div>
          <div className="chat-input mt-4 flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 bg-gray-800 text-white rounded-l-lg border"
            />
            <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded-r-lg">
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}
