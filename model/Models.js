import mongoose from 'mongoose';

// Define the schema for the "Model" collection
const modelSchema = new mongoose.Schema(
  {
    model_name: { type: String, required: true },  // Required field for model name
    category: { type: String, required: true },    // Required field for category
  },
  { timestamps: true }  // Automatically add createdAt and updatedAt fields
);

// Ensure model is not redefined on every hot-reload or restart in development
// This check avoids errors caused by re-defining models in development mode
const Model = mongoose.models.Model || mongoose.model('Model', modelSchema);

export default Model;
