import mongoose from 'mongoose';  
  
const donationSchema = new mongoose.Schema({  
  name: String,  
  email: String,  
  amount: Number,  
  message: String  
});  
  
export default donationSchema;
