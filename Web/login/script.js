document.querySelector("#create-account-button").href = "/register" + window.location.search;

const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const loginButton = document.querySelector("#login-button");

const action = queryParameter("action");
const app = queryParameter("app");
const redirectURL = queryParameter("redirect");

const displayError = (text) => {
    const textbox = document.querySelector(".text-box");
    textbox.classList.remove("invisible");
    textbox.querySelector("span").innerHTML = text;
}

if(action == "login-redirect") {
    displayError("You need to login first!")
}

loginButton.addEventListener("click", async () => {

    const email = emailInput.value == "" ? null : emailInput.value;
    const password = passwordInput.value == "" ? null : passwordInput.value;

    const tokenRequest = await requestToken(email, password);
    if(tokenRequest.error != false) {
        displayError(tokenRequest.error.message);
        return;
    }

    arcticExtensionAddUser(tokenRequest.token);

    setCookie("userAccessToken", tokenRequest.token, 30);

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