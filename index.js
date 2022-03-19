const express = require('express')
const bp = require('body-parser')
const cloudinary = require('cloudinary')
const fileUpload = require('express-fileupload')
const secrets = require('./secrets/secrets')
const mongoose = require('mongoose')
const app = express()
app.use(fileUpload({
    createParentPath: true
}))


//databse stuff
// const dbString = `mongodb+srv://${secrets.dbUser}:${secrets.password}@artificial.5ha3m.mongodb.net/artificial?retryWrites=true&w=majority`
// mongoose.connect(dbString, { useNewUrlParser: true } )
// const artworkSchema = new mongoose.Schema({
//     title: String,
//     desc: String,
//     src: String,

// })

// const Artwork = mongoose.model("Artwork", artworkSchema)
// const artwork = new Artwork({
//     title: "test",
//     desc: "bruh",
//     src: "bruhruuh"
// })
// artwork.save()

app.use(bp.urlencoded({
    extended: true
}))

cloudinary.config({
    cloud_name: 'dbeaywnzl',
    api_key: secrets.api_key,
    api_secret: secrets.api_secret
});





app.get('/', (req, res) => {
        res.sendFile(__dirname + "/pages/index.html")
    })
    .post('/', async (req, res) => {
        if (req.files) {
            let artwork = req.files.artwork
            artwork.mv(__dirname + "/temp/" + artwork.name)
            cloudinary.v2.uploader.upload(`./temp/${artwork.name}`, {
                public_id: req.body.title
            }, function (error, result) {
                res.send(result)
            
            })
        }

    })
const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})