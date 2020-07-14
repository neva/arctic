const appName = document.getElementById("appName");
const appIDText = document.getElementById("app-id"); 

const run = async () => {

    const appID = queryParameter("id");

    const info = await getAppInfo(appID);
    console.log(info);

    appName.innerHTML = info.appName;
    appIDText.innerHTML = info.appID;

}
run();