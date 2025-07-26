import multer from "multer";

const storage = multer.memoryStorage(); // store files in memory as Buffer

export const upload = multer({ storage }).array("image"); // field name = 'image'
