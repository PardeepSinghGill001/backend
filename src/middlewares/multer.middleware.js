import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //req - the request coming from user
        //file -present with the multer, it gives the file access(which containes all our files)that is why multer is used because we cannot configure file in the request body in express
        //cb - a callback
      cb(null, "./public/temp")//all the files will be kept here
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
  })
  
  export const upload = multer({ 
     storage,
     })