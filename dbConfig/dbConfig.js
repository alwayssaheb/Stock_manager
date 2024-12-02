import mongoose, { mongo } from "mongoose";

const uri =  "mongodb+srv://saheb:T4lIiTzp4VA2s2m6@cluster0.h3rk6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
export async function connectDB() {
    try{
        mongoose.connect(uri);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log("MongoDB conncted");
        })
        connection.on('error', (error) => {
            console.log('MongoDb Connection Error, please make sure DB is up and running');
            process.exit()  
        })
    }
    catch(error){
        console.log("something went wrong in connecting to DB");
        console.log(error);
    }
}