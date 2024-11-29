const express = require("express");
const cors = require('cors');
const app = express();
const router = require('./routes/index.js');

app.use(express.json());
app.use(cors);


app.use('/api/v1',router);

app.listen(3000, function(err){
    if(err) console.log(err);
    console.log("Server listening on 3000");

})