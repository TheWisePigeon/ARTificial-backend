const express = require('express')
const bp = require('body-parser')
const cloudinary = require('cloudinary')
const fs = require('fs')
const dotenv = require('dotenv')
const fileUpload = require('express-fileupload')
const mongoose = require('mongoose')
const app = express()
app.use(fileUpload({
    createParentPath: true
}))


//database stuff
const dbString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@artificial.5ha3m.mongodb.net/artificial?retryWrites=true&w=majority`
mongoose.connect(dbString, { useNewUrlParser: true } )
const artworkSchema = new mongoose.Schema({
    title: String,
    desc: String,
    src: String,

})

const Artwork = mongoose.model("Artwork", artworkSchema)


app.use(bp.urlencoded({
    extended: true
}))

cloudinary.config({
    cloud_name: 'dbeaywnzl',
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});





app.get('/', (req, res) => {
        res.sendFile(__dirname + "/pages/index.html")
    })
    .post('/', async (req, res) => {
        let obj
        if (req.files) {
            let artwork = req.files.artwork
            artwork.mv(__dirname + "/temp/" + artwork.name)
            cloudinary.v2.uploader.upload(`./temp/${artwork.name}`, {
                public_id: req.body.title
            }, function (error, result) {
                const art = new Artwork({
                    title: req.body.title,
                    desc: req.body.desc,
                    src: result.secure_url
                })
                art.save()
                fs.unlink(__dirname + `/temp/${artwork.name}`, (err)=>{
                    if (err){
                        console.log(err);
                    }
                    console.log("File deleted successfully");
                })
                res.send(result)
                
            })
            
        }

    })
//const port = process.env.PORT || 5000

app.listen(process.env.PORT, () => {
    console.log(`App listening on port `);
})

