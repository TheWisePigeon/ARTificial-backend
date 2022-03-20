const express = require('express')
const secrets = require('./secrets')
const cors = require('cors')
const bp = require('body-parser')
const cloudinary = require('cloudinary')
const fs = require('fs')
const fileUpload = require('express-fileupload')
const mongoose = require('mongoose')
const app = express()
app.use(fileUpload({
    createParentPath: true
}))


//database stuff
const dbString = `mongodb+srv://${secrets.DB_USER}:${secrets.DB_PASSWORD}@artificial.5ha3m.mongodb.net/artificial?retryWrites=true&w=majority`
mongoose.connect(dbString, { useNewUrlParser: true } )
const artworkSchema = new mongoose.Schema({
    title: String,
    desc: String,
    src: String,

})

const Artwork = mongoose.model("Artwork", artworkSchema)

app.use(cors())
app.use(bp.urlencoded({
    extended: true
}))

cloudinary.config({
    cloud_name: 'dbeaywnzl',
    api_key: secrets.API_KEY,
    api_secret: secrets.API_SECRET
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


app.get('/arts', (req, res)=>{

    Artwork.find( (err, fruits)=>{
        if(err){
            res.send(err)
        }else{
            res.send(fruits)
        }
    } )


})
const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

