const express = require('express')
const bp = require('body-parser')
const cloudinary = require('cloudinary')
const secrets = require('./secrets/secrets')
const app = express()

app.use(bp.urlencoded({ extended: true }))

cloudinary.config({
    cloud_name: 'dbeaywnzl',
    api_key: secrets.api_key,
    api_secret: secrets.api_secret
});

function upload(title, url) {
    cloudinary.v2.uploader.upload(url, { public_id: title }, function (error, result) {
        console.log(result);
    })
}

function get(title) {
    
}


app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/pages/index.html")
})


app.post('/upload', (req, res)=>{

})
const port = process.env.PORT||5000

app.listen(port, ()=>{
    console.log(`App listening on port ${port}`);
})