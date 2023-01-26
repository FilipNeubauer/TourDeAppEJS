function openUpdate() {
    document.getElementsByClassName("update-div")[0].style.visibility = "visible";
    document.getElementsByClassName("light-box")[0].style.visibility = "visible";

    recordId = event.target.id;
    // console.log(recordId)
    recordId = recordId.slice(0, recordId.length - 6)
    // console.log(recordId)
    // console.log(recordId);

    document.getElementById("updateId").value = recordId;


    let updateDate = document.getElementById(recordId.toString(10)).getElementsByTagName("span")[0].innerHTML
    let updateTime = document.getElementById(recordId.toString(10)).getElementsByTagName("span")[2].innerHTML
    let updateLanguage = document.getElementById(recordId.toString(10)).getElementsByTagName("h2")[0].innerHTML
    let updateRating = document.getElementById(recordId.toString(10)).getElementsByClassName("record-heading")[0].getElementsByTagName("p")[0].id
    // console.log(document.getElementById(recordId.toString(10)).getElementsByClassName("record-heading")[0].getElementsByTagName("p")[0].innerHTML)
    let updateDesc = document.getElementById(recordId.toString(10)).getElementsByClassName("description")[0].getElementsByTagName("p")[0].innerHTML
    

    // console.log(document.getElementById(recordId.toString(10)).getElementsByTagName("span"))
    // let updateDateTime = document.getElementById(recordId.toString(10)).getElementsByTagName("div")[2].getElementsByTagName("p")[0].getElementsByTagName("span");
    // // console.log(typeof(updateDateTime))
    // [updateDate, updateTime] = updateDateTime.split(",")
    // updateTime = updateTime.split(" ")[2];
    // console.log(document.getElementById(recordId.toString(10)).getElementsByTagName("div")[2].getElementsByTagName("p")[0].innerHTML)

    // console.log(document.getElementById("updateDate"))
    // console.log(typeof(updateDate));

    document.getElementById("updateDate").value = updateDate;
    document.getElementById("updateLanguage").value = updateLanguage.trim();
    document.getElementById("updateRating").value = updateRating.trim();
    document.getElementById("updateDesc").value = updateDesc.trimStart().trimEnd();


   // document.getElementById("updateLanguage").value = document.getElementById(recordId.toString(10)).getElementsByTagName("p")[1].innerHTML
    document.getElementById("updateTime").value = updateTime;
  //  document.getElementById("updateRating").value = document.getElementById(recordId.toString(10)).getElementsByTagName("p")[3].innerHTML
   // document.getElementById("updateDesc").value = document.getElementById(recordId.toString(10)).getElementsByTagName("p")[4].innerHTML

};

function openAdd() {
    document.getElementsByClassName("add-div")[0].style.visibility = "visible";
    document.getElementsByClassName("light-box")[0].style.visibility = "visible";
}

function clickedLightBox() {
    document.getElementsByClassName("light-box")[0].style.visibility = "hidden";
    document.getElementsByClassName("update-div")[0].style.visibility = "hidden";
    document.getElementsByClassName("add-div")[0].style.visibility = "hidden";
}

function deleteForm() {
    formId = event.target.id;
    console.log(formId);
    formId = formId.slice(0, formId.length - 6);
    console.log(formId)

    document.getElementById("delForm" + formId).submit();
}
// document.getElementsByClassName("update-button").addEventListener("click", openUpdate);