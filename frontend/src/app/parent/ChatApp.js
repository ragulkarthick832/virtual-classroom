// src/app/parent/ChatApp.js
"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function ChatApp() {
  const [user, setUser] = useState({ name: "", role: "parent" });
  const [faculties, setFaculties] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log(storedUser)
    if (storedUser) setUser(storedUser);
    fetchFaculty();
  }, []);

  useEffect(() => {
    if (selectedFaculty) fetchMessages();
  }, [selectedFaculty]);

  const fetchFaculty = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/faculty");
      setFaculties(res.data.faculties);
    } catch (err) {
      console.error("Error fetching faculty", err);
    }
  };

  const fetchMessages = async () => {
    if (!selectedFaculty) return;
  
    try {
      const response = await axios.get(
        `http://localhost:5001/api/chatBetweenUsers`,
        {
          params: {
            senderName: user.name,
            senderRole: user.role,
            receiverName: selectedFaculty.name,
            receiverRole: selectedFaculty.role || "teacher",
          },
        }
      );
  
      setMessages(response.data.data);
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedFaculty) return;

    const receiver = {
      name: selectedFaculty.name,
      role: selectedFaculty.role || "teacher",
    };

    try {
        const response = await axios.post("http://localhost:5001/api/send", {
          sender: user, // Use logged-in user as sender
          receiver,
          message: newMessage,
        });
        setMessages([...messages, response.data.data]);
        setNewMessage("");
        scrollToBottom();
      } catch (error) {
        console.error("Error sending message:", error);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      chatRef.current?.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <div className="bg-[#222539] p-6 rounded-lg shadow-md text-white max-w-4xl mx-auto w-full">
      <h2 className="text-lg font-bold mb-4">Chat with Faculty</h2>

      <select
        onChange={(e) =>
          setSelectedFaculty(
            faculties.find((f) => f.name === e.target.value)
          )
        }
        className="w-full p-2 bg-gray-800 text-white rounded mb-4"
      >
        <option value="">-- Select Faculty --</option>
        {faculties.map((f) => (
          <option key={f.email} value={f.name}>
            {f.name}
          </option>
        ))}
      </select>

      {selectedFaculty && (
        <>
          <p className="mb-2">
            Chatting with: <strong>{selectedFaculty.name}</strong>
          </p>
          <div
            ref={chatRef}
            className="h-64 overflow-y-auto border border-gray-600 p-3 rounded mb-4"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 ${
                  msg.sender.name === user.name ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    msg.sender.name === user.name
                      ? "bg-pink-500 text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  <strong>{msg.sender.name}:</strong> {msg.message}
                </span>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 p-2 bg-gray-800 text-white rounded-l border border-gray-600"
            />
            <button
              onClick={sendMessage}
              className="bg-pink-500 text-white px-4 rounded-r"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}