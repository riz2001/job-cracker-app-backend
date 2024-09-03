const mongoose=require("mongoose")
const cors=require("cors")
const express=require("express")
const Bcrypt=require("bcrypt")
const Cors=require("cors")
const jwt=require("jsonwebtoken")
const userModel=require("./models/users")

let app=express()
app.use(express.json())
app.use(Cors())

mongoose.connect("mongodb+srv://rizwan2001:rizwan2001@cluster0.6ucejfl.mongodb.net/preg?retryWrites=true&w=majority&appName=Cluster0")



app.post("/signup",async(req,res)=>{
   
     let input=req.body
     let hashedpassword=Bcrypt.hashSync(req.body.password,10)
     console.log(hashedpassword)
     req.body.password=hashedpassword
     
    userModel.find({email:req.body.email}).then(
        (items)=>{
         
            if(items.length>0){
                res.json({"status":"email id already exist"})
            }
            else
            
            {
                let result=new userModel(input)
                res.json({"status":"success"}) 
                result.save()
                
            }
        }
        
               
      
        

    ).catch(

        (error)=>{}
        
    )
})
    
     
   


app.listen(3030,()=>{
    console.log("server started")
})