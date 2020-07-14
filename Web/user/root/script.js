const route = async (viewLink) => {

    const box = document.getElementById("box");
    const viewTemplate = await fetchView(viewLink);
    const loadedView = await loadView(viewTemplate);
    fadeToView(box, loadedView)

}
const reload = async () => {

    const userAccessToken = getCookie("userAccessToken");
    if(userAccessToken == null) redirect(serverAddress + "/login?action=login-redirect&redirect=" + window.location.href);

    const user = await getUserInfo(userAccessToken);
    if(user.error != false) redirect(serverAddress + "/login?action=login-redirect&redirect=" + window.location.href); 

    window.user = user;
    window.user.userAccessToken = userAccessToken;

}

const run = async () => {

    await reload();

    const box = document.getElementById("box");
    const viewTemplate = await fetchView("views/dashboard.html");
    const view = await loadView(viewTemplate);

    renderView(box, view);

}
run();