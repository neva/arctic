const serverAddress = "http://46.101.113.205:3000"


// standard functions
const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/"
}
const getCookie = (name) => {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if(match) return match[2];
    return null;
}
const queryParameter = (name) => {
    url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
const request = async (address, request) => {

    const result = await fetch(address, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
    })
    const jsonResult = await result.json();
    return jsonResult;

}
const getUserAccessToken = () => {

    // check if query parameter contains userAccessToken
    if(queryParameter("userAccessToken")) return queryParameter("userAccessToken");

    // check if cookies contain userAccessToken
    const userAccessToken = getCookie("userAccessToken");
    if(userAccessToken == null) redirect(serverAddress + "/login?action=login-redirect&redirect=" + window.location.href);
    return userAccessToken;

}
var redirect = (url) => window.location.href = url;

// arctic specific functions
const requestToken = async (email, password) => {

    const jsonResult = await request(serverAddress + "/user/token", {
        email, password
    })
    return jsonResult;

}
const addUserToApp = async (userAccessToken, appID) => {

    const jsonResult = await request(serverAddress + "/user/app/add", {
        "userAccessToken": userAccessToken,
        "appID": appID
    })

    return jsonResult;

}
const createApp = async (appName, userAccessToken) => {

    const jsonResponse = await request(serverAddress + "/app/create", {
        userAccessToken,
        appName
    })
    return jsonResponse;

}
const getUserInfo = async (userAccessToken) => {

    const jsonResponse = await request(serverAddress + "/user/info", {
        userAccessToken
    })

    return jsonResponse;

}
const isMember = async (userAccessToken, appID) => {

    const response = await request(serverAddress + "/app/member/list", {
        userAccessToken,
        appID
    })
    if(response.error == false) {
        return true;
    } else {
        return false;
    }

}
const getAppInfo = async (appID) => {

    const jsonResponse = await request(serverAddress + "/app/info", {
        appID
    });

    return jsonResponse;

}

const updateUser = async (userAccessToken, query) => {

    const result = await request(serverAddress + "/user/update", {
        userAccessToken,
        "update": query
    })
    return result;

}
const deleteUser = async (email, password) => {

    const result = await request(serverAddress + "/user/delete", {
        "email": email,
        "password": password
    })
    return result;

}
const changePassword = async (userID, password, newPassword) => {

    const result = await request(serverAddress + "/user/password", {
        "userID": userID,
        "password": password,
        "newPassword": newPassword
    })
    return result;

}