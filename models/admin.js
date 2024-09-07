const mongoose=require("mongoose")
const schema=mongoose.Schema(
    {
        username: {
            type: String,
            required:true
        },
        password: {
            type: String,
            required: true
        }
    }
)

var adminModel=mongoose.model("Admins",schema)
module.exports=adminModel