document.querySelector("#login-button").href = "/login" + window.location.search;

const emailInput = document.getElementById("email")
const passwordInput = document.getElementById("password")
const nameInput = document.getElementById("name");
const button = document.getElementById("register-button")

const action = queryParameter("action");
const app = queryParameter("app");
const redirectURL = queryParameter("redirect");

const displayError = (text) => {
    const textbox = document.querySelector(".text-box");
    textbox.classList.remove("invisible");
    textbox.querySelector("span").innerHTML = text;
}

button.addEventListener("click", async () => {

    const email = emailInput.value == "" ? null : emailInput.value;
    const password = passwordInput.value == "" ? null : passwordInput.value;
    const name = nameInput.value == "" ? null : nameInput.value;

    const jsonResult = await request(serverAddress + "/user/create", {
        email,
        password,
        name
    })
    if(jsonResult.error != false) { 
        displayError(jsonResult.error.message);
        return;
    }

    setCookie("userAccessToken", jsonResult.token, 30);

    if(action == "authenticate") {
        const result = await addUserToApp(tokenRequest.token, app);
        window.location.href = redirectURL + "?authToken=" + result.authToken
    } else if(action == "login-redirect") {
        window.location.href = redirectURL;
    } else {
        window.location.href = serverAddress + "/user";
    }
    return;

})