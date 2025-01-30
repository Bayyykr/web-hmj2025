const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const port = 8000

app.set('view engine', 'ejs')
app.use(expressLayouts)

//aplication middleware
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.render('index',{
        title: 'Halaman About',
        layout: 'layouts/main-layout',
        css: '/css/style.css',
        js: '/js/script.js'
    })
})

app.get('/about', (req, res) => {
    res.render('about',{
        title: 'Halaman About',
        layout: 'layouts/main-layout',
        css: '/css/about.css',
        js: '/js/about.js'
    })
})

app.use((req, res) =>{
    res.status(404)
    res.send('404')
})

app.listen(port, () =>{
    console.log("berhasil connect");
})