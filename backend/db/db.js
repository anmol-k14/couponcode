const mongoose = require('mongoose');

function  connect() {
    const mongoUri=process.env.MONGO_URI 

    mongoose.connect(mongoUri)
    .then(()=>{
        console.log("connected");
    })
    .catch(err=>{
        console.log(err);
    })
    
}



module.exports = connect;