const mongoose = require("mongoose");
const {Schema} = mongoose

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
     
    },

    levels: [{type: Schema.Types.ObjectId, ref: 'Level'}]


  })


module.exports = mongoose.model("Category", categorySchema);