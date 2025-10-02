import multer from "multer";
import path from "path";
import fs from "fs";

const uploadFolder = path.resolve("uploads");

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export const uploadFile = (req, res, next) => {
  upload.single("file")(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: "Upload error", error: err });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No files have been uploaded" });
    }

    const filePath = `/uploads/${req.file.filename}`;
    res.status(200).json({ url: filePath });
  });
};
