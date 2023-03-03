
function showEachForm() {
    const userId = event.target.id
    const newId = userId + "form"

    const current = document.getElementById(newId).style.display

    if (current == "flex") {
        document.getElementById(newId).style.display = "none"
    } else {
        document.getElementById(newId).style.display = "flex"
    }
}