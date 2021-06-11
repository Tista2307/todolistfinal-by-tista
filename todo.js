const express=require("express")
const app=express();
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const date=require(__dirname+"/date.js")
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}))
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true,useUnifiedTopology: true})
const todoschema={
    task:String
}
const workmodel=mongoose.model("allWork",todoschema);
const listschema={
    name:String,
    taskl:[todoschema]
}
const listmodel=mongoose.model("newpage",listschema);
app.set("view engine","ejs");
const item1 = new workmodel ({
    task: "Start entering"
  });
const i = [item1];
var worki=[]
app.get("/",function(req,res){
var day=date.getDay();
workmodel.find((err,fitems)=>{
    if(err)
    {
        console.log(err);
    }
    else
    {
       if(fitems.length===0)
        {
            workmodel.insertMany(i,(e)=>{
                if(e)console.log(e);
                else
                console.log("Successfully added default items");
            })
            res.redirect("/")
        }
        else
        {
        res.render("list",{listtitle:day,newi:fitems})
        }
    }
})
})
        

app.post("/",function(req,res){var day=date.getDay();
var item=req.body.newitem
var listname=req.body.button
//i.push(item)
var taski=new workmodel({
    task:item
})
if(listname===day){
taski.save();
res.redirect("/")}
else{
    listmodel.findOne({name:listname},function(err,foundname){
    if(!err){
        foundname.taskl.push(taski);
        foundname.save();
        res.redirect("/"+listname);
    }
    })
}
})



app.post("/delete",function(req,res){
    var valid=req.body.checkbox
    var listname=req.body.hidden;
    var day=date.getDay();
    if(listname===day){
    workmodel.deleteMany({_id:valid},(err)=>{
        if(err) console.log(err);
        else
        console.log("Deletion successful");
    })
    res.redirect("/")}
    else{
        listmodel.findOneAndUpdate({name:listname},{$pull:{taskl:{_id:valid}}},function(err,foundit){
            if(!err){
                res.redirect("/"+listname);
            }
        })
    }
})
app.get("/:topic",function(req,res){
    var u =req.params.topic
    listmodel.findOne({name:u},function(err,foundname){
     if(!err){
          if(!foundname){
            var listn=new listmodel({
                name:u,
                taskl:i
            })
            listn.save();
            res.redirect("/"+u);
          }
          else{
              res.render("list",{listtitle:foundname.name,newi:foundname.taskl})
          }
     }
    })
    
})

app.get("/about",function(req,res){
res.render("about");
})
app.listen(3000,function(){
    console.log("Listening at port 8080")
})