
reset()
function calculate(){
    const collection = document.getElementsByClassName("misson-buttons");
    var score = 0
    Array.from(collection).forEach(div => {
        const selectElements = div.querySelectorAll('select');
        selectElements.forEach(selection =>{
            if (selection.value == "yes"){
                score = score+parseInt(selection.name)
            }
            else if (selection.name == "precision"){
                console.log(selection.value)
                console.log(score)
                score = score+parseInt(selection.value)
            }
            else if(!isNaN(Number(selection.value))){
                    console.log(selection)
                    console.log(selection.name)
                    score = score + (parseInt(selection.name)*parseInt(selection.value))
            }
        })
    });
    document.getElementById("score-display").innerText="SCORE: " + score.toString() 
    score = 0
}
function reset(){
    const collection = document.getElementsByClassName("misson-buttons");
    var score = 0
    Array.from(collection).forEach(div => {
        const selectElements = div.querySelectorAll('select');
        selectElements.forEach(selection =>{
            selection.selectedIndex = 0
        })})
}
