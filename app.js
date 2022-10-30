const express = require('express')
require('express-async-errors')
const jwt = require('jsonwebtoken')
const log = require('./logging')
const app = express()

// config
const port = 3000
const basePath = '/'
const pk = 'SlVoczZqMzJebGRlcmxhamFrbHNkZmpwb3dpdWVyamFzbGtkZmpsc2R1Zm9pd2Vqb2k0NjVld2VldzhyNjU0c2Q0M2RzJigkIyYoKiQjXjc5ODMyNzQ5OHNmZGl1ZXdAJigqJCMoIypVKCokJCQjJiokJigjQCYoJCYoI0AqZmV3dDM0MjIqMzI0Mzc4NWZkZmhnaHQzNHU0NTR0cnQsbGRpODIzajM='
const kepPem = Buffer.from(pk, 'base64')
const algorithm = 'HS512'
const expiresIn = '60d'
const audience = ''
const issuer = ''


app.get("/token", (req, res) => {
    res.send(
        jwt.sign(
            { key: 'value' },
            kepPem,
            {
                algorithm: algorithm,
                audience: audience,
                issuer: issuer,
                expiresIn: expiresIn
            }
        )
    )
})

// authorization
app.get('/verify', async (req, res, next) => {
    const token = (req.get('Authorization') || '').replace('Bearer ', '')
    if (!token) return res.status(403).send("Access Denied")
    const decoded = await new Promise((res, rej) => {
        jwt.verify(token, kepPem, {
            algorithms: algorithm,
            audience: audience,
            issuer: issuer
        }, (err, decoded) => {
            decoded ? res(decoded) : (() => {
                err.statusCode = 403
                rej(err)
            })()
        })
    })
    req.jwt = decoded
    log.trace('inbound request verified, token: %s, payload: %s', token, decoded)
    res.send(decoded)
    next()
})

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).send(err.message)
    log.error({
        err: err,
        req: req,
        res, res
    })
    next()
})

app.listen(port, () => {
    log.info(`Auth Mock Started on Port ${port} with Base Path ${basePath}`)
})