require('dotenv').config()

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');




//db connection
mongoose.connect(process.env.DATABASE_URL,
  {useCreateIndex: true, 
    useNewUrlParser: true, 
    useUnifiedTopology: true })
  .then(()=>{
    app.listen(3007);
    console.log('database connected!');})
  .catch(err => console.log(err));

app.use(express.json())
app.use(cors());

const userRouter = require('./routes/user');
app.use('/user', userRouter); 




  