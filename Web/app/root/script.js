const run = async () => {

    await use("/components/popup.html", this);
    const popup = document.querySelector(".POPUP");
    window.popup = popup;

    const box = document.getElementById("content");
    const viewTemplate = await fetchView("views/index.html");
    const view = await loadView(viewTemplate);

    renderView(box, view);

}
run();