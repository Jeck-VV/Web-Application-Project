const SERVER_URL = 'http://localhost:3001';

const getUserInfo = async () => {
    const response = await fetch(SERVER_URL + "/api/sessions/current", {
        credentials: "include",
    });
    const user = await response.json();
    if (response.ok) {
        return user;
    } else {
        throw user.error;
    }
};

const logIn = async (credentials) => {
    const response = await fetch(SERVER_URL + "/api/sessions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    }
    else {
        const errDetails = response.headers.get("WWW-Authenticate");
        throw errDetails;
    }
};

const logOut = async () => {
    const response = await fetch(SERVER_URL + "/api/sessions/current", {
        method: "DELETE",
        credentials: "include"
    });
    if (response.ok)
        return null;
}

const getStazioniInfo = async () => {
    const response = await fetch(SERVER_URL + "/api/stazioni", {
        method: "GET",
        credentials: "include", 
    });
    if (response.ok) {
        const stazioni = await response.json();
        return stazioni;
    } else {
        const errDetail = await response.json();
        throw errDetail.error;
    }
}

const getTratteInfo = async () => {
    const response = await fetch(SERVER_URL + "/api/tratte", {
        method: "GET",
        credentials: "include", 
    });
    if (response.ok) {
        const tratte = await response.json();
        return tratte;
    } else {
        const errDetail = await response.json();
        throw errDetail.error;
    }
}

const getLineeInfo = async () => {
    const response = await fetch(SERVER_URL + "/api/linee", {
        method: "GET",
        credentials: "include", 
    });
    if (response.ok) {
        const linee = await response.json();
        return linee;
    } else {
        const errDetail = await response.json();
        throw errDetail.error;
    }
}

const getClassificaInfo = async () => {
    const response = await fetch(SERVER_URL + "/api/leaderboard", {
        method: "GET",
        credentials: "include", 
    });
    if (response.ok) {
        const classifica = await response.json();
        return classifica;
    } else {
        const errDetail = await response.json();
        throw errDetail.error;
    }
}

const putPartitaInfo = async (path, startStation, endStation) => {
    const response = await fetch(SERVER_URL + "/api/partita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ path, startStation, endStation }),
    });
    if (response.ok) {
        return await response.json(); 
    } else {
        const errDetail = await response.json();
        throw errDetail.error;
    }
}

const getPartitaStartInfo = async () => {
    const response = await fetch(SERVER_URL + "/api/partita/start", {
        method: "GET",
        credentials: "include",
    });
    if (response.ok) {
        return await response.json();
    } else {
        const errDetail = await response.json();
        throw errDetail.error;
    }
}


const API = { getUserInfo, logIn, logOut, getStazioniInfo, getTratteInfo, getLineeInfo, getClassificaInfo, putPartitaInfo, getPartitaStartInfo };
export default API;