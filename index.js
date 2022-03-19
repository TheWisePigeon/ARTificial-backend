const express = require('express')
const bp = require('body-parser')
const cloudinary = require('cloudinary')
const formidable = require('formidable')
const secrets = require('./secrets/secrets')
const mongoose = require('mongoose')
const app = express()


//databse stuff
const dbString = `mongodb+srv://${secrets.dbUser}:${secrets.password}@artificial.5ha3m.mongodb.net/artificial?retryWrites=true&w=majority`
mongoose.connect(dbString, { useNewUrlParser: true } )
const artworkSchema = new mongoose.Schema({
    title: String,
    desc: String,
    src: String,

})

const Artwork = mongoose.model("Artwork", artworkSchema)
const artwork = new Artwork({
    title: "test",
    desc: "bruh",
    src: "bruhruuh"
})
artwork.save()

app.use(bp.urlencoded({ extended: true }))

cloudinary.config({
    cloud_name: 'dbeaywnzl',
    api_key: secrets.api_key,
    api_secret: secrets.api_secret
});

async function upload(title, url) {
    cloudinary.v2.uploader.upload(url, { public_id: title }, function (error, result) {
        return await result;
    })
}

function get(title) {
    
}


app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/pages/index.html")
})
.post('/', (req, res)=>{

})
const port = process.env.PORT||5000

app.listen(port, ()=>{
    console.log(`App listening on port ${port}`);
})