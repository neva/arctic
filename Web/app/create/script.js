const button = document.getElementById("create-app-btn");
const nameField = document.getElementById("name-field");

button.addEventListener("click", async () => {

    const userAccessToken = getCookie("userAccessToken");
    if(userAccessToken == null) redirect(serverAddress + "/login?redirect=" + window.location.href);

    const app = await createApp(nameField.value, userAccessToken);
    redirect(serverAddress + "/app/dashboard?app=" + app.id);

})