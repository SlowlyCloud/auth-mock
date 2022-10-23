const express = require('express')
require('express-async-errors')
const jwt = require('jsonwebtoken')
const log = require('./logging')
const app = express()

// config
const port = 3000
const basePath = '/'
const pk = 'LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFb3dJQkFBS0NBUUVBcDl2N21wNEZlL21qK3FHMUxvbGhmMGtQRXhmZUh4YzZJRkFJL1VVMnNSMkVqb0d5Cm9xbjJnUFNyMkJSL0dmNkY0d25pVEowdEVydEJmNFZRcTBxMGpDVWhDMjFjRms3Tm10d1pSa0FvdWQwSTc3aFkKVXF2dG9memVWWCs1dUNVaHNvT1VmWWlsa0xLSFJBRm1NSVozZmQwdlM4WEYxOU51UVhQUEFKNjlUWnhvUmhBTgpIWXJCUE1pMlZGOW5wMHZBaUU1N3dFQ1hLVjAwZjBoWGFTN2x6ZDk3d0NiTjFkeFk4aUVCblRCMDVjYmVvYml5CkYrT25iMm1CalpoRmNFMEpGVE11cndiZkp1SVVpdmRRT2FpMU9VdGJvZGZKTTBVRmhpSkNjek5NTmYxT1B2SXYKL1ZlUnp3UXBUdnU0c2dwMVJac1IzZW9CbmVJWmFWVHYrZThGZ3dJREFRQUJBb0lCQUUrclFCcWRmNXJjM0hBNwpTZVFCZmszTVhpUkF3c0xjNGxDdHkrWnhjRWpWNnJFOGE0MTZ2NjFxOHhqR2VhRGJ4YTRCWmUvWTlhaWJTYlg5CmoxRU5UdTNwUFdyUUI5SHFxdmtpRjdqWkFMdGVaanhvc1RyanNSQ2VGT1JkajhjUGtKUEtrYktYSllXc3hqaUgKdFhtNGlJUXJjNlF5QlBtdnR2Zkh3R3JaN0owbHBxU1ExTnh3dWQxcTM2NE5mSWV0Y3IxZmVyQ3JxeVVqcmFXZgpXTUY3UmgwdzNlTzVYbnFFdFltUEZmVVdKQzU0enlkU3VtU1RjTW5YMkdLWHRSU083U2ZxcjdnNUZGTXM3SXNKCmVyak5CZzVaZGJWQTZiKzU2UXAwVEFkV0F6akV4ODB5cVVRc0RQeDZoNnE3bVBPc2d3YWxSWTU1bDVOL2hQR0QKNU5xUzhHRUNnWUVBM3lRSU9oSW5CZ1JsUitTaDVtNGVIb3FhWlMxVFFiWmhzVDVCbzBBU2JiRjBtTEsvTzZrOAp4OHNjVlJrUEQ1MGoyK25BNDQyOGV2REc1S1dYZWwvRDdTQXpMLzBvQUlYa0tJd04xTXJDTkxKWlozV0ZUREFICmFqUGMvNXBleEdjOWloU1V5T0pieTZCaW1GVHdzRTVFY3RZckx3dE9MTlVUcmRkdnZrUEdXM01DZ1lFQXdKUHkKN0tlVHh0TGF6emxleVhkeXNuUHZ3YXVLWm5STS9rcjM0dVNjY1piQVRyQ3NSRWJKR0pncmhDRVNNMVJsMUpxUwpHOU9zdHI0M1o1UkxDRDdoTlI0MXQyR0hkZVhMVVJaa2dESTRxQzl5SFNNYmh2RDB1dmFrSGtpRmtNT01PM3luCm1qRUpySE5DSncxVEFpUUxGb1FDbEVpNkpwbVd4YkxLN2JueVNiRUNnWUIreHljUmIwelNvMTZ6MlJlUEoxTmYKZ05vMXorbTB0UjJPS1ZQN242U1l4REQ5ck5qdjJiaVp2ekdLdStFTnV2Y3J0QVNPaFBIb1c3SjFLQXdIVUMrdQpJeFJTR0tCSW84bThxODRUNzFzbHU0c0dPQVFUQkZyQ0lWTlh1ZXBMNW1oVmNsb1NSR0ZwTU9lenF0YlJKTGJKCkZCdVc3L0pya0doTTVkRXNKYSttTndLQmdHZjBOVkRjVU9BbDJDbStiVlZSbmwrSVIrY0NvMjRVMzY3eFp3aGEKb2J5TFJQbjFVcmgwZ1g4K1BWZFF4dE5nZnF1YVdMNmVyLy9oaEdUc1h1aHZrUUFzYzVDdkhBRmZiell4WVVUMgpWekVxazIzNUVwWHdJaHQrb2k4YXRNYmxXQ0NRZEtTK1RkdUNTRFp1Y2QyWStVZEpNVjg4TndnNUpuTkh4VlU0ClovcXhBb0dCQUxZcHU2akdvYzVuelhWa0U0RXBOYTJiSFVtN05Hb1NUMjFveE5ZcFNFcHVReW5uTnFVMzR2dUgKMUVwUk1UNkl6OVFjOVpvcGVnMEJrd2NCV2VpaHJ0TmhhWFpxcHJISHFnb0s0dkprNUdXNW1oNEl3R0xUYjl4UAo4R2duTDNqc1RseFE5NEgxZ0RJa0pTeEdSS0FpUURYMkhtdHNvbTJFUmhsd1RTSEErdW1uCi0tLS0tRU5EIFJTQSBQUklWQVRFIEtFWS0tLS0t'
const kepPem = Buffer.from(pk, 'base64')
const algorithm = 'RS256'
const expiresIn = '1d'
const audience = []
const issuer = ''


app.get("/token", (req, res) => {
    res.send(
        jwt.sign(
            { key: 'value' },
            kepPem,
            {
                algorithm: algorithm,
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