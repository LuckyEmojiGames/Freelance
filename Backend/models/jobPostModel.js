const mongoose = require("mongoose");
const {Schema} = mongoose;

const jobPostSchema = new Schema({
    jobTitle:{
        type:String,
        required:true,
    },
    jobStatus:{
        type:String,
        required:true,
    }, 
    // posted,assigned,started,inprogress,completed
    Resp:{
        type:String,
        required:true,
    },
    Email:{
        type:String,
        required:true,
    },
    Telegram:{
        type:String,
        required:true,
    },
    Phone:{
        type:Number,
        required:true,
    },
    Info:{
        type:String,
        required:true,
    },
    Requirement:{
        type:String,
        required:true,
    },
    Condition:{
        type:String,
        required:true,
    },
    Note:{
        type:String,
        required:true,
    },
    // Client:{
    //     type:Schema.Types.ObjectId,
    //     ref:"User",
    //     required:true
    // },
    // freelancer : {
    //     type:Schema.Types.ObjectId,
    //     ref:"User",
    //     required:false,
    // },
    // jobProposals:[
    //     {
    //         type:Schema.Types.ObjectId,
    //         ref:"JobBid",
    //     }
    // ],
    // proposalsSubmittedBy:[
    //     {
    //         type:Schema.Types.ObjectId,
    //         ref:"User"
    //     }
    // ],
    // createdAt: {
    //     type: Date,
    //     default: Date.now,
    //   },
});

module.exports = mongoose.model("JobPost",jobPostSchema);