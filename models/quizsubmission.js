const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    week: {
        type: Number,
        required: true,
    },
    answers: [
        {
            question_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "questions",
                required: true,
            },
            answer: {
                type: String,
                required: true,
            }
        }
    ],
    submitted_at: {
        type: Date,
        default: Date.now,
    }
});

const Submission = mongoose.model("submissions", submissionSchema);
module.exports = Submission;
