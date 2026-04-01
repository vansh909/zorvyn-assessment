const mongoose = require('mongoose');

const financialRecords = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"user",
        required: true,
    },
    amount:{
        type: Number,
        required: true,
    },
    type:{
        type:String,
        enum:["income", "expense"],
        required: true
    },
    category:{
        type:String,
        required: true,
    },

    date:{
        type: Date,
        default : Date.now()
    },
    notes:{
        type: String,
    }
},{timestamps: true});


const records = mongoose.model("financialRecords", financialRecords);

module.exports = records;