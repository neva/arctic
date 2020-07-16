const run = async () => {

    const box = document.getElementById("box");
    const viewTemplate = await fetchView("views/register.html");
    const view = await loadView(viewTemplate);

    renderView(box, view);

}
run();