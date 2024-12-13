import mongoose, { model, mongo } from 'mongoose'

const modelSchema = new mongoose.Schema({
    model_name: {type:String, required: true},
    category:{type: String,required:true},
}, {timestamps:true});

export default mongoose.models.Model || mongoose.model("Model", modelSchema); 

