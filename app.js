const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const { title } = require('process')
const app = express()
const port = 8000

app.set('view engine', 'ejs')
app.use(expressLayouts)

//aplication middleware
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.render('index',{
        title: 'Halaman About',
        layout: 'layouts/main-layout'
    })
})

app.get('/about', (req, res) => {
    res.render('about',{
        title: 'Halaman About',
        layout: 'layouts/main-layout'
    })
})

app.use((req, res) =>{
    res.status(404)
    res.send('404')
})

app.listen(port, () =>{
    console.log("berhasil connect");
})