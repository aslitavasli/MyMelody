const mongoose = require("mongoose");
const {Schema} = mongoose
const levelSchema = new mongoose.Schema(
  {
    pronounciations: {
      type: Array,
      required: true,
     
    },

    spellings: {
      type: Array,
      required: true,
    },

    pitches: {type: Array, required: true},

    phrase: {
        type: String,
        required: true,
      },
    
    // category: {type: Schema.Types.ObjectId, ref: 'Category'}
    

  }
);

module.exports = mongoose.model("Level", levelSchema);