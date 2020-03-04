const express = require('express')
const mongoose = require('mongoose')
const shortUrl = require('./models/shortUrls')
const app = express()

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))


app.get('/', async (req, res) => {
    const shortUrls = await shortUrl.find()
    res.render('index', {shortUrls: shortUrls})
})

app.post('/shortURLS', async (req, res) => {
    await shortUrl.create({full: req.body.fullURL})
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const SURL = await shortUrl.findOne({short: req.params.shortUrl})
    if(SURL == null)return res.sendStatus(404)

    SURL.clicks++
    (await SURL).save()

    res.redirect(SURL.full)

})

app.listen(process.env.PORT || 3000)
