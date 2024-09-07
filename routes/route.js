const express=require ('express');
const router=express.Router();
const seller=require("../models/seller");
const orders=require("../models/orders2024"); // updated for 2023*************
const products=require("../models/products");
const brands=require("../models/brand");
const comments=require("../models/comment");
const nodemailer=require('nodemailer');
const categorys=require("../models/category");

const {google}=require('googleapis');
const OAuth2=google.auth.OAuth2;

const OAuth2_client=new OAuth2(process.env.clientID,process.env.clientsecret)

OAuth2_client.setCredentials({refresh_token:process.env.refreshtoken})

var CryptoJS = require("crypto-js");
//view product in table
router.get("/viewProduct",(req,res)=>{
  products.find((err,data)=>{
    if(err){
      res.json({msg:"failed to add product"});
  }else{
    data.sort((a,b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0))
let data1=[];
data.forEach((x)=>{
  if(x.available=='Yes'){
    data1.push(x);
  }
})
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data1), process.env.enckey).toString();
 
// Decrypt
var bytes  = CryptoJS.AES.decrypt(ciphertext, process.env.enckey);
var originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    res.send({"text1":ciphertext});
  }
  })
})

router.get("/superproduct",(req,res)=>{
  products.find((err,data)=>{
    if(err){
      res.json({msg:"failed to add product"});
  }else{
    let hotsale=data.filter(function (x){
      return x.supersalepos!=0});
      hotsale.sort((a,b) => (a.supersalepos > b.supersalepos) ? 1 : ((b.supersalepos > a.supersalepos) ? -1 : 0))
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(hotsale), process.env.enckey).toString();
 
// Decrypt
var bytes  = CryptoJS.AES.decrypt(ciphertext, process.env.enckey);
var originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    res.send({"text":ciphertext});
  }
  })
})
//To place order by buyer
router.post("/placeorder",(req,res)=>{
  let bytes  = CryptoJS.AES.decrypt(req.body.text, process.env.enckey);
      let originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      // var paypricewithshipping=0;
  
  var gmail;
  const me = "PYRO";
  let d = new Date();
  let date1 = d.getDate();
  let month = d.getMonth() + 1;
  let time = d.getHours() + "" + d.getMinutes() + "" + d.getMilliseconds();
  var orderid = me + date1 + month + time;
  // console.log(orderid)
  seller.find((err,data)=>{
    if(data.length!=0)
    gmail=data[0].details[3];
    },err=>{
          
   })
  var query = { username: originalText.username};
  var querycart1 = { prodind:originalText.prodind,
  qty:originalText.qty,
  eachactualprice:originalText.eachactualprice,
 eachpayprice:originalText.eachpayprice,
  savedprice:originalText.savedprice,
 actualprice:originalText.actualprice,
 payprice:originalText.payprice,
 payamt:originalText.payamt,
 actualamt:originalText.actualamt,
 saveamt:originalText.saveamt,
 productqty:originalText.productqty,
code:originalText.code};


// console.log(originalText.deliverycharge)
 let t1={
  username:originalText.username,
  myid:orderid,
  placedlist:[querycart1],
  book:0,
  payments:0,
  delivery:0,
  status:0,
  location:originalText.location,
  date:originalText.date,
  shipping:originalText.shipping,
  phone:originalText.phonenumber,
  deliverycharge:originalText.deliverycharge,
  delivereddate:"No",
  comment:"",
  sellerdiscount:0,
  llr:""
  
};
// console.log(t1)
 let neworder=new orders(t1)
neworder.save((err,result)=>{
    if(err){
      // console.log(err)
        res.json({msg:err});
    }else{
    

      delete result._id;
      delete result._v;

      var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(result), process.env.enckey).toString();
 
// Decrypt
var bytes  = CryptoJS.AES.decrypt(ciphertext, process.env.enckey);
var originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    res.send({"text":ciphertext});
          
    }
})
})
// shop place order

router.post("/shopplaceorder",(req,res)=>{
  let bytes  = CryptoJS.AES.decrypt(req.body.text, process.env.enckey);
      let originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      // var paypricewithshipping=0;
  
  var gmail;
  const me = "SHOP";
  let d = new Date();
  let date1 = d.getDate();
  let month = d.getMonth() + 1;
  let time = d.getHours() + "" + d.getMinutes() + "" + d.getMilliseconds();
  var orderid = me + date1 + month + time;
  seller.find((err,data)=>{
    if(data.length!=0)
    gmail=data[0].details[3];
    },err=>{
          
   })
  var query = { username: originalText.username};
  var querycart1 = { prodind:originalText.prodind,
  qty:originalText.qty,
  eachactualprice:originalText.eachactualprice,
 eachpayprice:originalText.eachpayprice,
  savedprice:originalText.savedprice,
 actualprice:originalText.actualprice,
 payprice:originalText.payprice,
 payamt:originalText.payamt,
 actualamt:originalText.actualamt,
 saveamt:originalText.saveamt,
 productqty:originalText.productquantity,
code:originalText.code};
 
 let neworder=new orders({
  username:originalText.username,
  myid:orderid,
  placedlist:[querycart1],
  book:0,
  payments:0,
  delivery:0,
  status:0,
  location:originalText.location,
  date:originalText.date,
  shipping:originalText.shipping,
  phone:originalText.phonenumber,
  delivereddate:"No",
  comment:originalText.comment,
  sellerdiscount:originalText.sellerdiscount,
  deliverycharge:0,
  llr:""
  
})
neworder.save((err,result)=>{
    if(err){
        res.json({msg:err});
    }else{
   
    delete result._id;
      delete result._v;
      var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(result), process.env.enckey).toString();
 
// Decrypt
var bytes  = CryptoJS.AES.decrypt(ciphertext, process.env.enckey);
var originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    res.send({"text":ciphertext});
          
    }
})
})

//get seller details
 router.get("/sellerdetail",(req,res)=>{
  let query={"_id":"6054ad5271d68d221488f9d1"}
      seller.find(query,(err,data)=>{
        // console.log(data)
        // console.log("*****")
        if(data.length!=0)
        var t={name:data[0].details[0],gpay:data[0].gpay,pdf:data[0].pdf,contact:data[0].details[1],payment:data[0].details[2],deliverycharge:data[0].deliverycharge,minbuyprice:data[0].minbuyprice}
      // console.log(t);
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(t), process.env.enckey).toString();
         res.send({"text":ciphertext})
        },err=>{
              
       })
})

 // get category and qty
router.get("/categorylists",(req,res)=>{
  categorys.find((err,data)=>{
    data.sort((a,b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0))
    let data1=[];
data.forEach((x)=>{
  if(x.qty!=0&&x.active=='Yes'){
    data1.push(x);
  }
})


    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data1), process.env.enckey).toString();
        res.send({"text1":ciphertext});
         })
})
router.get("/getbrand",(req,res)=>{
  brands.find((err,data)=>{
    if(data.length!=0)
    data.sort((a,b) => (a.position > b.position) ? 1 : ((b.position > a.position) ? -1 : 0))
    // console.log(data)
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.enckey).toString();
 
    // Decrypt
    
        res.send({"text":ciphertext});
    },err=>{
          
   })
})

router.get("/gettrack/:track",(req,res)=>{
  var query={"myid":req.params.track};
  orders.find(query,(err,data)=>{
    if(data!=null){
    if(data.length!=0){
      delete data[0]._id;
      delete data[0]._v;

      var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.enckey).toString();
      res.send({"text":ciphertext})

    }else{
      res.send('')

    }
    }else{
      res.send('')
    }
    },err=>{
          
   })
})

router.post("/postcomment",(req,res)=>{
  var today = new Date();
  seller.find((err,data)=>{
    if(data.length!=0)
    gmail=data[0].details[3];
    },err=>{
          
   })
  let newcomment=new comments({
    name:req.body.name,
    msg:req.body.msg,
    phone:req.body.phone,
    date:""+today.getDate()+"/"+(Number(today.getMonth())+1)+"/"+today.getFullYear(),
    status:0
  })
  newcomment.save((err,result)=>{
      if(err){
          res.json({msg:err});
      }else{
       res.json(result)
      }
    })
});




module.exports=router;
