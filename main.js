let missionInfoJson;

async function loadMissionInfo() {
    try {
        const response = await fetch('MissionInfo.json');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        missionInfoJson = await response.json();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}
(async function () {
    await loadMissionInfo();
    let languages = Object.keys(missionInfoJson)
    let chosenLanguge = getLanguageFromURL(languages)
    createLangugeSelect(missionInfoJson,chosenLanguge)
    translate(chosenLanguge)
    reset()
})();
function getLanguageFromURL(allowedLanguges) {
    const urlParams = new URLSearchParams(window.location.search);
    let lang = urlParams.get('lang')
    console.log(lang)
    if (!allowedLanguges.includes(lang)) { lang = undefined }
    return lang || 'english';
}

function translate(languge) {

    document.getElementsByTagName('body')[0].style.direction = missionInfoJson[languge][0].textDirection
    const article = document.getElementById('article')
    missionInfoJson[languge].slice(1).forEach(mission => {
        //create container
        let container = document.createElement("div")
        container.className = "misson"
        article.appendChild(container)
        //create name
        container.appendChild(createText('h1', mission.name))
        //create description
        container.appendChild(createText('h4', mission.description))
        //create img
        let img = document.createElement('img')
        img.src = mission.image
        img.className = "misson-image"
        container.appendChild(img)

        //create missons container
        let pointGiversContainer = document.createElement("div")
        pointGiversContainer.className = "misson-buttons"
        container.appendChild(pointGiversContainer)
        //create extra info
        if (mission.extra_info) {
            pointGiversContainer.appendChild(createText('label', mission.extra_info + "\n"))
        }
        //create missons
        mission.pointGivers.forEach(pointGiver => {
            pointGiversContainer.appendChild(createText('label', pointGiver.name + " "))
            let select = document.createElement('select')
            select.onchange = calculate
            select.className = "mission-select"
            pointGiversContainer.appendChild(select)
            if (pointGiver.type == "YESNO") {

                select.appendChild(createOption(missionInfoJson[languge][0].no, 0))
                select.appendChild(createOption(missionInfoJson[languge][0].yes, pointGiver.points))
            }
            else if (pointGiver.type == "MANY") {
                for (let i = 0; i <= pointGiver.numberOfObjects; i++) {
                    if (i == 1) {
                        select.appendChild(createOption(i + " " + pointGiver.singleObjectName, pointGiver.points * i))
                    }
                    else { select.appendChild(createOption(i + " " + pointGiver.multibleObjectNames, pointGiver.points * i)) }
                }                    
            }
            else if (pointGiver.type == "FORCED") {
                Object.keys(pointGiver.points).forEach(pointName => {
                    let points = pointGiver.points[pointName]
                    select.appendChild(createOption(pointName, points))
                });
            }
            pointGiversContainer.appendChild(createText('h1', ''))
        })
    });
}
function createText(type, text) {
    let element = document.createElement(type)
    let elementText = document.createTextNode(text)
    element.appendChild(elementText)
    return element
}
function createOption(text, value) {
    let element = document.createElement('option')
    let elementText = document.createTextNode(text)
    element.value = value
    element.appendChild(elementText)
    return element
}

function calculate() {
    const collection = document.getElementsByClassName("mission-select");
    let score = 0
    Array.from(collection).forEach(select => {
        score = score + parseInt(select.value)
    });
    document.getElementById("score-display").innerText = "SCORE: " + score.toString()
    score = 0

}
function reset() {
    const collection = document.getElementsByClassName("misson-buttons");
    var score = 0
    Array.from(collection).forEach(div => {
        const selectElements = div.querySelectorAll('select');
        selectElements.forEach(selection => {
            selection.selectedIndex = 0
        })
    })
    calculate()
}
function createLangugeSelect(missionInfoJson,chosenLanguge){
    console.log(chosenLanguge)
    let select = document.getElementById('language-select')
    let label = document.getElementById('language-text')
    let languages  = Object.keys(missionInfoJson)
    languages.forEach(languge => {
        select.appendChild(createOption(missionInfoJson[languge][0].name,languge))
    })
    console.log(missionInfoJson)
    select.value = chosenLanguge
    label.textContent = missionInfoJson[chosenLanguge][0].languge + ": "
    select.style.left = '80px'
}
function changeLanguge(){
    let select = document.getElementById('language-select')
    window.location.href = "index.html?lang="+select.value;
}