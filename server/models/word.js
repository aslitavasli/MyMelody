 const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema(
  {
    original: {
      type: String,
      required: true,
    },

    ipaOriginal: {
      type: String,
      required: true,
    },

    ipaSpelled: {
        type: String,
        required: true,
      },
      
    
    // uploadedAt: {
    //      type: Date, default: Date.now
    //  },

     //an array of pronounciations
    audioData: [{
         type: String,
         
        }], 

    syllableNumber: {
        type: Number,
        required: true,
    }


  }
);

module.exports = mongoose.model("Word", wordSchema);