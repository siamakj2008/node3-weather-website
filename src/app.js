const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')
const path = require('path')
const request = require('request')
const express = require('express')
const hbs = require('hbs')
// console.log(__dirname)
// console.log(__filename)

// console.log(path.join(__dirname, '../public'))
const app = express()
const port = process.env.PORT || 3000


// Define path for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
// Setup static directiory ot serve 
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather ',
        name: 'Andrew Mead'
    })
})
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Andrew Mead'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helpText: 'This is some helpful text.',
        name: 'Andrew Mead'
    })
})

// app.get('/her', (req, res) => {
//     res.render('her', {
//         title: 'Her'
//     })
// })
// app.get('', (req, res) => {
//     res.send('<h1>Weather</h1>')
// })

// app.get('/help', (req, res) => {
//     res.send({
//         name: 'Andrew',
//         age: 27
//     })
// })

app.get('/about', (req, res) => {
    res.send('<h1>About</h1>')
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'An address must be provided'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({
                error
            })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })

    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})


// app.get('/help/*', (req, res) => {
//     res.send('Help article not found')
// })

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'help article not found'
    })
})

// app.get('*', (req, res) => {
//     res.send('My 404 page')
// })

app.get('*', (req, res) => {
    res.render('404', {
        title: 404,
        name: 'Andrew Mead',
        errorMessage: 'Page not found'
    })
})




// app.com
app.listen(port, () => {
    console.log('server is up on port' + port)
})