const Assignment = require("../models/Assignment");
const multer = require("multer");
const path = require("path");


exports.uploadAssignment = async (req, res) => {
  try {
    const { title, instruction, subject, duetime, duedate } = req.body;
    console.log(req.body);
    if (!title || !instruction || !subject || !duetime || !duedate) {
      return res.status(400).json({ error: "All fields are required!" });
    }
    // Check for duplicate title (case insensitive)
    const existingAssignment = await Assignment.findOne({ title: title });

    if (existingAssignment) {
      return res.status(400).json({ message: "An assignment with this title already exists!" });
    }


    // Use the file uploaded via multer to set the file URL.
    // If req.file exists, create the URL string; otherwise, set to an empty string.
    let relatedfile = req.file ? `/uploads/${req.file.filename}` : "";

    const newAssignment = new Assignment({
      title,
      instruction,
      subject, // Added subject field
      duetime,
      duedate,
      relatedfile,
      teacher: req.user.id,
      submittedFiles: [],
    });

    await newAssignment.save();
    console.log(newAssignment);
    res
      .status(201)
      .json({
        message: "Assignment uploaded successfully!",
        assignment: newAssignment,
      });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};



exports.getTeacherAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ teacher: req.user.id })
            .populate("teacher", "name email")
            .select("title instruction subject duetime duedate relatedfile submittedFiles");

        res.json(assignments);
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

// ─── Multer Storage Configuration with Detailed Logging ─────────────────────────────
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("🔥 [MULTER] Destination function called.");
    console.log("📂 Storing file in uploads folder...");
    cb(null, "uploads/"); // Save files in 'uploads' directory
  },
  filename: function (req, file, cb) {
    console.log("🔥 [MULTER] Filename function called.");
    console.log("📄 Original filename:", file.originalname);
    const fileExtension = path.extname(file.originalname);
    console.log("📄 File extension extracted:", fileExtension);
    const baseName = path
      .basename(file.originalname, fileExtension)
      .replace(/\s+/g, "_");
    console.log("📝 Processed base name:", baseName);
    const generatedFileName = Date.now() + "-" + baseName + fileExtension;
    console.log("✅ [MULTER] Generated filename:", generatedFileName);
    cb(null, generatedFileName); // Save with correct extension
  },
});

exports.upload = multer({ storage: storage });


// View student submissions for an assignment
exports.viewSubmissions = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id)
            .populate("submittedFiles.student", "name email");

        if (!assignment) return res.status(404).json({ error: "Assignment not found" });

        res.json({ subject: assignment.subject, submissions: assignment.submittedFiles });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};

// Get the count of pending submissions
exports.getPendingSubmissions = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ error: "Assignment not found" });

        // Placeholder: You need to replace this with actual logic to get total students
        const totalStudents = 50; // Example: Fetch from a "Course" model
        const submittedCount = assignment.submittedFiles.length;
        const pendingCount = Math.max(0, totalStudents - submittedCount);

        res.json({ subject: assignment.subject, pendingCount });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
};