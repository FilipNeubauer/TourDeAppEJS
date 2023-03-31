// const { response } = require("express");

function serverInfo() {
    // // console.log("idk")
    // fetch("https://tda.knapa.cz/sysinfo", {
    //     mode:"no-cors",
    //     credentials: 'include',
    //     method: "GET",
    //     headers: {"x-access-token" : "b9a5730e4d8e5ceec0e3ddf4863a89a3"}, 
    //     // body: JSON.stringify({})
    //   }).then(res => {
    //     console.log("Request complete! response:", res);
    //   });


      const options = {
        // mode:"no-cors",
        method: 'GET',
        // credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': 'b9a5730e4d8e5ceec0e3ddf4863a89a3'
            // "X-Auth-Token": "b9a5730e4d8e5ceec0e3ddf4863a89a3"
        },
      };
      
      fetch('https://tda.knapa.cz/sysinfo', options)
        .then(response => response.json())
        .then(response => {


            console.log(response)
            const isoTimeString = response.boot_time;
            const targetDate = new Date(isoTimeString);
            const now = new Date();
            
            const timeDifferenceInMs = now - targetDate;
            const timeDifferenceInMinutes = Math.floor(timeDifferenceInMs / 1000 / 60);
            const hours = Math.floor(timeDifferenceInMinutes / 60);
            const minutes = timeDifferenceInMinutes % 60;
    
    
            const versionString = response.platform;
        const versionNumbers = versionString.match(/\d+/g);
        const majorVersion = versionNumbers[0];
        const minorVersion = versionNumbers[1];
        const patchVersion = versionNumbers[2];
        const semanticVersion = `${majorVersion}.${minorVersion}.${patchVersion}`;
    
            document.getElementsByClassName("server-time")[0].innerHTML = hours + "h " + minutes + "min";
            document.getElementsByClassName("server-version")[0].innerHTML = semanticVersion;



        })
        .catch(err => console.error(err));

}


function allCommits() {
    fetch("https://tda.knapa.cz/commit", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': 'b9a5730e4d8e5ceec0e3ddf4863a89a3'
        }
    }).then(response => response.json())
        .then(response => {
            console.log(response.length)
            document.getElementsByClassName("all-commits")[0].innerHTML = response.length
        })
}
 

async function lastCommit() {
    const first = await fetch("https://tda.knapa.cz/commit/latest/1", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': 'b9a5730e4d8e5ceec0e3ddf4863a89a3'
        }
    })
    const json = await first.json()
    const desc = json[0].description
    const creator_id = json[0].creator_id
    const time = json[0].date


    const timestamp = new Date(time);
    const day = timestamp.getDate().toString().padStart(2, '0');
    const month = (timestamp.getMonth() + 1).toString().padStart(2, '0');
    const hours = timestamp.getHours().toString().padStart(2, '0');
    const minutes = timestamp.getMinutes().toString().padStart(2, '0');
    
    const formattedDate = `${day}.${month} ${hours}:${minutes}`;
    


    const nameFirst = await fetch("https://tda.knapa.cz/user/" + creator_id, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': 'b9a5730e4d8e5ceec0e3ddf4863a89a3'
        }
    })
    const jsonName = await nameFirst.json()
    const name = jsonName.name

    // console.log(name, desc, formattedDate)


    document.getElementsByClassName("name")[0].innerHTML = name
    document.getElementsByClassName("lastTime")[0].innerHTML = formattedDate
    document.getElementsByClassName("desc")[0].innerHTML = desc



}




// async function todayCommit() {

//     const now = new Date();
//     now.setHours(0);
//     now.setMinutes(0);
//     now.setSeconds(1);
//     now.setMilliseconds(0);
    
//     const isoString = now.toISOString();
//     console.log(isoString)


//     const response = await fetch("https://tda.knapa.cz/commit/filter/" + isoString, {
//         method: "GET",
//         headers: {
//             'Content-Type': 'application/json',
//             'x-access-token': 'b9a5730e4d8e5ceec0e3ddf4863a89a3'
//         }
//     })
//     const json =  await response.json()
//     console.log(json)
//     const all = json.length
//     console.log(all)

//     document.getElementsByClassName("todayPocet")[0].innerHTML = all

// }


function fetchAll() {
    allCommits()
    serverInfo()
    lastCommit()
    todayCommit()
}

fetchAll()
setInterval(fetchAll(), 10*1000)



    
    // // Storing response
    // const response = await fetch(url);
    
    // // Storing data in form of JSON
    // var data = await response.json();
    // console.log(data);
    // if (response) {
    //     hideloader();
    // }
    // show(data);


