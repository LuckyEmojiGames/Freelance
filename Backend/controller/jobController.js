const fs = require("fs");
const path = require("path");
const BigPromise = require("../middleware/BigPromise")
const CustomError = require("../utils/customError");
const JobPost = require("../models/jobPostModel");
const JobBid = require("../models/jobBidModel");
const Task = require("../models/Task")

exports.postJob = async (req, res, next) => {
 
    const { jobTitle, Resp, Email, Telegram, Phone, Info, Requirement, Condition, Note } = req.body;

    if (!jobTitle || !Resp || !Email || !Telegram || !Phone || !Info || !Requirement || !Condition || !Note) {
        return next(new CustomError("Fields are missing", 401));
    }
    const jobPosted = await JobPost.create({
        jobTitle,
        jobStatus:"posted",
        Resp,
        Email,
        Telegram,
        Phone,
        Info,
        Requirement,
        Condition,
        Note
    })

    res.status(200).json({
        success:true,
        job : jobPosted
    })
};

// get all jobs for home page
exports.getAllJobs = BigPromise(async (req, res, next) => {
    const jobs = await JobPost.find({freelancer:{$exists:false}});

    res.status(200).json({
        success:true,
        jobs
    })
})

exports.Task = async (req, res, next) => {
 
    const { description, file, price, currency, deadline } = req.body;

    if (!description || !price || !currency || !file || !deadline) {
        return next(new CustomError("Fields are missing", 401));
    }
    const taskPosted = await Task.create({
        description,
        file,
        price,
        currency,
        deadline
    })

    res.status(200).json({
        success:true,
        task : taskPosted
    })
};

// get all tasks for home page
exports.getAllTasks = async (req, res, next) => {
    const jobs = await Task.find({freelancer:{$exists:false}});

    res.status(200).json({
        success:true,
        jobs
    })
}

// single job for detail page
exports.getSingleJobById = BigPromise(async(req,res,next)=>{
    const {jobId} = req.body;
    const job = await JobPost.findById(jobId);

    if(!job){
        return CustomError("Job Not Found",404);
    }

    res.status(200).json({
        success:true,
        job
    })
})

// get job Bids by id
exports.getJobBidsById = BigPromise(async(req,res,next)=>{
    const {jobIdInput} = req.body;
    const jobs = await JobBid.find({jobId : jobIdInput});

    if(!jobs){
        res.status(200).json({
            message : "No Job exist with the id"
        })
    }

    res.status(200).json({
        success:true,
        jobs
    })
})