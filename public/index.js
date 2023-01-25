function openUpdate() {
    document.getElementById("update-form").style.display = "initial";
    recordId = event.target.name;
    console.log(recordId);

    document.getElementById("updateId").value = recordId;
    
    document.getElementById("updateDate").value = document.getElementById(recordId.toString(10)).getElementsByTagName("p")[0].innerHTML
    document.getElementById("updateLanguage").value = document.getElementById(recordId.toString(10)).getElementsByTagName("p")[1].innerHTML
    document.getElementById("updateTime").value = document.getElementById(recordId.toString(10)).getElementsByTagName("p")[2].innerHTML
    document.getElementById("updateRating").value = document.getElementById(recordId.toString(10)).getElementsByTagName("p")[3].innerHTML
    document.getElementById("updateDesc").value = document.getElementById(recordId.toString(10)).getElementsByTagName("p")[4].innerHTML
    document.getElementsByClassName("light-box")[0].style.visibility = "visible";

};

function openAdd() {
    document.getElementById("add-form").style.display = "initial";
    document.getElementsByClassName("light-box")[0].style.visibility = "visible";
}

function clickedLightBox() {
    document.getElementsByClassName("light-box")[0].style.visibility = "hidden";
    document.getElementById("update-form").style.display = "none";
    document.getElementById("add-form").style.display = "none";
}

// document.getElementsByClassName("update-button").addEventListener("click", openUpdate);