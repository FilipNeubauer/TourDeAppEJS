function openAdd() {
    document.getElementsByClassName("add-div")[0].style.visibility = "visible"
    // console.log(document.getElementsByClassName("add-div"))


    // console.log(document.getElementsByClassName("light-box")[0].style.visibility)
    document.getElementsByClassName("light-box")[0].style.visibility = "visible"
}



function clickedLightBox() {
    document.getElementsByClassName("light-box")[0].style.visibility = "hidden";
    // document.getElementsByClassName("update-div")[0].style.visibility = "hidden";
    document.getElementsByClassName("add-div")[0].style.visibility = "hidden";
}

