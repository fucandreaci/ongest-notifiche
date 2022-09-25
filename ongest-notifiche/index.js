const axios = require("axios");

const getData = async () => {
    return await axios.get("https://ongest.it/API_/Endpoints/App.php?token=oYwTo1mO4kS8M96v&OG=all");
}

const getUserNonPaganti = async () => {
    const users = await getData();
    for (const user of users.data.slice(0, 1)) {
        const userData = {
            id: user.id.toString(),
            associazione: user.nome_associazione,
            nome_associazione: user.nome_associazione,
        }

        try {
            await sendUserNotification("Mensilità corrente non pagata, si prega di regolarizzarla.", userData);
        } catch (e) {
            console.log(e.response.data.errors)
        }
    }
}

const sendUserNotification = async (msg, userData) => {
    return await axios.post("https://onesignal.com/api/v1/notifications", {
        app_id: '05c5afac-4696-4bc5-a9f6-2516e51c0a57',
        contents: {
            en: msg
        },
        headings: {
            en: 'ON-GEST'
        },
        subtitle: {
            en: userData.nome_associazione
        },
        include_external_user_ids: ['2']//[userData.id]
        //included_segments: ['All']
    }, {
        headers: {
            Authorization: 'Basic ODZjZTgyZWEtYWY0Ni00NTUxLWFkY2QtODQ5OThlODcwNGJh',
        }
    })
}

getUserNonPaganti();
setInterval(() => {
    const date = new Date();
    if (date.getDate() % 7 === 0) {
        getUserNonPaganti();
    }
}, 1000 * 60 * 60 * 24);
