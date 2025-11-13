import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const newName = Date.now() + "-" + file.originalname;
    cb(null, newName);
  },
});

const upload = multer({ storage });

export default upload;
