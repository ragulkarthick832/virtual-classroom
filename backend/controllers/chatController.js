const {getChatModelStudent,getChatModelParent} = require("../models/Chat");
const mongoose = require("mongoose");

// ✅ Create or store a chat message
exports.createChat = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    // Prevent sender from chatting with themselves
    if (sender.name === receiver.name) {
      return res.status(400).json({ success: false, message: "Sender and receiver cannot be the same" });
    }

    // Allow only valid roles
    const allowedRoles = ["student", "teacher", "parent"];
    if (!allowedRoles.includes(sender.role) || !allowedRoles.includes(receiver.role)) {
      return res.status(400).json({ success: false, message: "Invalid role specified" });
    }

    // Get or create the correct chat collection
    if (sender.role == "student" || receiver.role =="student"){
      const Chat = getChatModelStudent(sender.name, receiver.name);
      const newChat = new Chat({ sender, receiver, message });
      await newChat.save();
      res.status(201).json({ success: true, data: newChat });
    } else{
      const Chat = getChatModelParent(sender.name, receiver.name);
      const newChat = new Chat({ sender, receiver, message });
      await newChat.save();
      res.status(201).json({ success: true, data: newChat });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ✅ Get all chat messages between two users
exports.getChatsBetweenUsers = async (req, res) => {
  try {
    const { senderName, senderRole, receiverName, receiverRole } = req.query;
    console.log(`Fetching chat between ${senderName} (${senderRole}) and ${receiverName} (${receiverRole})`);

    // Get the correct chat collection based on both name and role
    if (senderRole == "student" || receiverRole == "student"){
        const Chat = getChatModelStudent(senderName, receiverName);
        // Fetch all messages sorted by timestamp
        const chats = await Chat.find().sort({ timestamp: 1 });

        res.status(200).json({ success: true, data: chats });
    } else{
      const Chat = getChatModelParent(senderName, receiverName);
      // Fetch all messages sorted by timestamp
      const chats = await Chat.find().sort({ timestamp: 1 });

      res.status(200).json({ success: true, data: chats });
    }
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


exports.getRecipientsWhoMessagedFaculty = async (req, res) => {
  const { facultyName } = req.params;

  try {
    // Get all collection names from MongoDB
    const collections = await mongoose.connection.db.listCollections().toArray();

    // Filter collections that start with "chat_" or "parent_chat" and include facultyName
    const chatCollections = collections
      .map((col) => col.name)
      .filter((name) => (name.startsWith("chat_") || name.startsWith("parent_chat")) && name.includes(facultyName));

    let recipientSet = new Map(); // Use a Map to store unique recipients with roles

    // Loop through each chat collection and fetch messages
    for (let collectionName of chatCollections) {
      const chats = await mongoose.connection.db
        .collection(collectionName)
        .find({ "receiver.name": facultyName })
        .toArray();

      chats.forEach((chat) => {
        if ((chat.sender.role === "student" || chat.sender.role === "parent") && chat.sender.name) {
          recipientSet.set(chat.sender.name, chat.sender.role);
        }
      });
    }

    // Convert the map to an array of objects with name and role
    const recipients = Array.from(recipientSet, ([name, role]) => ({ name, role }));

    return res.status(200).json({ recipients });
  } catch (error) {
    console.error("Error fetching recipients:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

