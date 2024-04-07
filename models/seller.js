const mongoose=require ("mongoose");

const sellerSchema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },details:{
        type:Array,
        required:true
    },category:{
        type:Array
    },qty:{
        type:Array
    },
    pdf:{
        type:String,
        required:true
    },deliverycharge:{
        type:Number
    },minbuyprice:{
        type:Number

    }

});
const sellers=module.exports=mongoose.model("sellerlist",sellerSchema);