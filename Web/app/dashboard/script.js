const reload = async () => {

    const userAccessToken = getUserAccessToken();

    const appID = queryParameter("app");
    // TODO / Redirect to 404 page

    const userIsMember = await isMember(userAccessToken, appID);
    if(!userIsMember) console.log("User isn't member!"); // Redirect to 404 page

    const appInfo = await getAppInfo(appID);
    window.app = appInfo;
    window.userAccessToken = userAccessToken;

}
const route = async (viewLink) => {

    const box = document.getElementById("box");
    const viewTemplate = await fetchView(viewLink);
    const loadedView = await loadView(viewTemplate);
    fadeToView(box, loadedView)

}
const updateApp = async (app, query) => {

    const result = await request(serverAddress + "/app/update", {
        "userAccessToken": window.userAccessToken,
        "appID": app.appID, 
        "update": query
    })
    return result;

}
const disableToken = async (app, token) => {

    const result = await request(serverAddress + "/app/token/disable", {
        "userAccessToken": window.userAccessToken,
        "appID": app.appID,
        "appToken": token
    })
    return result;

}
const getToken = async (app) => {

    const result = await request(serverAddress + "/app/token/list", {
        "userAccessToken": window.userAccessToken,
        "appID": app.appID
    })
    return result.token;

}
const createToken = async (app) => {

    const result = await request(serverAddress + "/app/token/create", {
        "userAccessToken": window.userAccessToken,
        "appID": app.appID
    })
    return result.token;

}
const getMember = async (appID, userAccessToken) => {

    const result = await request(serverAddress + "/app/member/list", {
        userAccessToken,
        appID
    })
    return result.extendedMemberList;

}
const removeMember = async (appID, userID, userAccessToken) => {

    console.log(userAccessToken, userID, appID)
    const result = await request(serverAddress + "/app/member/remove", {
        userAccessToken,
        userID,
        appID
    })
    return result;

}
const addMember = async (appID, userAccessToken, newUserID) => {

    const result = await request(serverAddress + "/app/member/add", {
        userAccessToken,
        userID: newUserID,
        appID
    })
    return result;

}

const run = async () => {

    await reload();

    route("views/dashboard.html");

}
run();