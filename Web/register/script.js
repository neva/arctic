const run = async () => {

    await use("/components/popup.html", this);
    const popup = document.querySelector(".POPUP");
    window.popup = popup;

    const box = document.getElementById("box");
    const viewTemplate = await fetchView("views/register.html");
    const view = await loadView(viewTemplate);

    renderView(box, view);

}
run();