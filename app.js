const express = require("express")
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv")
dotenv.config({path:'./.env'})

// proxy  use karne kae liye package lock aur nodemudules ko htana hae 
// firse npm i karna hae nhi toh proxy kam nhi karti

// for storing the photos in local folder 
const multer  = require('multer')





app.use(express.json());
// const cors = require('cors');
// app.use(cors({ origin: 'http://localhost:3000' }));

// backend kae folder use karne kae liye static bnana hae , client can access only static files
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));


// database connect karne kae liye
const DB = process.env.DB;

try {
    const connected = mongoose.connect(DB);
    if(connected){
        console.log('connected')
    }
} catch (error) {
    console.log("error" , error);
}

// mongoose.connect(DB, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on('error', (err) => {
//   console.error('MongoDB connection error:', err);
// });
// db.once('open', () => {
//   console.log('Connected to MongoDB');
// });

// app.get("/" , (req,res)=>{
//     res.send("hello");
// })

const User = require('./Userschema');


// see multer documentation dimaag kharab hogya tha 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
const upload = multer({ storage: storage })

// hmesha lga dena for post request to comvert json to object (express.json() is same but body parser is used for older version)
const bodyParser = require("body-parser"); 
app.use(bodyParser.json());


app.post("/" , upload.single('file') , async(req , res)=>{
    
    console.log("hello");
    const {name , description  , email ,ingredients,category} = req.body;
    console.log(name);
    const imageurl = req.file.filename;
   console.log(req.body);
   console.log(req.file);
    if(!name || !description || !email || !ingredients || !category|| !imageurl) {
       return res.status(422).json({message:"fill all the fields"});
    }
    const newrecipe = new User ({name , description  , email ,ingredients,category, imageurl});
    const status = await newrecipe.save();
    if(status){
        console.log("recipe saved")
        res.json({message:"recipe saved"})
    }
} )


// get mae / address mt use karna nhi aayega kaaam
app.get('/getdata',async (req,res)=>{
    try {
      console.log("hello");
        const latestUsers = await User.find({}).sort({_id:-1}).limit(20);
        res.json(latestUsers);

        console.log(latestUsers);
        console.log("sended")
        // console.log(latestUsers);
        // res.send(latestUsers);
        // latestUsers.map(user=>user.)
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
})
app.get("/latestrecipes" , async(req , res)=>{
  try{
    const latestrec = await User.find({}).sort({_id:-1});
    res.json(latestrec);
    console.log("LATEST RECIPES SENDED");

  }catch(err){
    console.log(err);
    res.status(500).send("server error");
  }
})

const PORT = process.env.PORT;
app.listen(PORT , ()=>{
    console.log("app is running");
})