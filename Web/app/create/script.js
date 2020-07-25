const reload = async () => {

    const userAccessToken = getUserAccessToken();

    const user = await getUserInfo(userAccessToken);
    if(user.error != false) redirect(serverAddress + "/login?action=login-redirect&redirect=" + window.location.href); 

    window.user = user.user;
    window.user.userAccessToken = userAccessToken;

}
const run = async () => {
    
    await reload();

    await use("/components/popup.html", this);
    const popup = document.querySelector(".POPUP");
    window.popup = popup;

    const box = document.getElementById("box");
    const viewTemplate = await fetchView("views/index.html");
    const view = await loadView(viewTemplate);

    renderView(box, view);

}
run();