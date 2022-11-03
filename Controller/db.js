const mongoose = require('mongoose');

const db = mongoose.connect('mongodb://localhost:27017/zettacamp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log('connect'))
.catch((err)=>console.log(err));

module.exports = {db, mongoose};