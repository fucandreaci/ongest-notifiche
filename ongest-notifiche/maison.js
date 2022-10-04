const axios = require("axios");

const getData = async () => {
    return await axios.get("https://ongest.it/API_/Endpoints/App.php?token=oYwTo1mO4kS8M96v&OG=OG0005");
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
        app_id: 'efb3a893-067e-4657-91d0-7957d8afb906',
        contents: {
            en: msg
        },
        headings: {
            en: 'Maison de la Danse'
        },
        include_external_user_ids: ['22']//[userData.id]
        //included_segments: ['All']
    }, {
        headers: {
            Authorization: 'Basic MTZmZWYzYWItYTFlZi00YzcxLWJlYmYtOWQ4ZjVjNmVhOTJj',
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
