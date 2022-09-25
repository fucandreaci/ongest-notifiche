const express = require('express');
const bodyParser = require('body-parser')
const axios = require("axios");

const app = express();
const port = 8000;
const jsonParser = bodyParser.json()

app.post('/', jsonParser, (req, res) => {
    if (!req || !req.body || !req.body.token || req.body.token !== 'oYwTo1mO4kS8M96v') {
        res.send({
            status: 'error',
            message: 'Invalid permissions'
        });
    }

    if (!req.body.msg || !req.body.associazione || !req.body.associazione.nome_associazione || !req.body.associazione.id) {
        res.send({
            status: 'error',
            message: 'Invalid data'
        });
    }

    try {
        sendAllNotification(req.body.msg, req.body.associazione)
        res.send({
            status: 'ok',
        })
    } catch (e) {
        console.log(e)
        res.send({
            status: 'error',
            message: 'Error sending notification'
        })
    }
});


const sendAllNotification = async (msg, associazione) => {
    return await axios.post("https://onesignal.com/api/v1/notifications", {
        app_id: '05c5afac-4696-4bc5-a9f6-2516e51c0a57',
        contents: {
            en: msg
        },
        subtitle: {
            en: 'Avviso da ' + associazione.nome_associazione
        },
        headings: {
            en: 'ON-GEST'
        },
        filters: [
            {"field": "tag", "key": "associazione", "relation": "=", "value": associazione.id}
        ]
    }, {
        headers: {
            Authorization: 'Basic ODZjZTgyZWEtYWY0Ni00NTUxLWFkY2QtODQ5OThlODcwNGJh',
        }
    })
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));