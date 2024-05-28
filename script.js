document.addEventListener("DOMContentLoaded", async () => {
    // Create Typing text spans
    let text = "";
    let alphabet = "a ";
    // let textSize = Math.floor(Math.random() * 5) + 5;
    let textSize = 10;
    let wordList = await getFile();
    for (let i = 0; i < textSize; i++) {
        text += wordList[Math.floor(Math.random() * wordList.length)];
        if (i != textSize-1) {
            text += " ";
        }
    }


    const textContainer = document.querySelector("#typeText");
    const accuracy = document.querySelector(".accuracy");
    const speed = document.querySelector(".speed");
    let wordIdx = [0];
    for (let i = 0; i < text.length; i++) {
        const newSpan = document.createElement("span");
        newSpan.classList.add("typeChar");
        newSpan.innerText = text[i];
        textContainer.append(newSpan);
        if (text[i] == " ") {
            wordIdx.push(i+1);
        }
    }

    const allChars = document.querySelectorAll(".typeChar");
    let curActive = 0;
    let wordsTyped = 0;
    let curWord = 0;
    let finished = false;

    let acc = 0;
    let numWrong = 0;
    let numCorrect = 0;
    let total = 0;

    let seconds = 0;
    let timeInterval;

    allChars[curActive].classList.add("active");

    document.addEventListener("keydown", (event) => {
        if (!finished) {
            if (curActive == 0) {
                seconds = 0.01
                timeInterval = setInterval(() => {
                    seconds++;
                    let wpm = Number(((((total/5) / seconds) * 60) * acc/100).toFixed(2));
                    speed.innerText = `Speed: ${wpm} wpm`;
                }, 1000);
            }
            let key = event.key;
            console.log(key);
            let allowed = "abcdefghijklmnopqrstuvwxyz/?.>,<;:']}[{+=-_)(*&^%$#@!~ ";
            if (key === "Backspace" && curActive > 0) {
                numCorrect++;
                total++;
                allChars[curActive].style.color = "black";
                allChars[curActive].style.backgroundColor = "transparent";
                curActive--;
                allChars[curActive].style.color = "black";
                allChars[curActive].style.backgroundColor = "white";

            }
            else if (allowed.indexOf(key) != -1) {
                key = key == " " ? "" : key;
                allChars[curActive].style.color = "blue";
                if (key === allChars[curActive].innerText) {
                    allChars[curActive].style.backgroundColor = "lightgreen";
                    numCorrect++;
                } else {
                    allChars[curActive].style.backgroundColor = "pink";
                    numWrong++;
                }
                total++;
                acc = (numCorrect / total) * 100;
                acc = Number(acc.toFixed(1));
                accuracy.innerText = `Accuracy: ${acc}%`;
                allChars[curActive].classList.remove("active");
                if (curActive != text.length-1) {
                    curActive++;
                    allChars[curActive].classList.add("active");
    
                    if (curWord != wordIdx.length-1 && curActive == wordIdx[curWord+1]) {
                        curWord++;
                        wordsTyped++;
                    }
                } else {
                    finished = true;
                    wordsTyped++;
                    clearInterval(timeInterval);
                    let wpm = Number(((((total/5) / seconds) * 60) * acc/100).toFixed(2));
                    if (acc < 20) {
                        wpm = 0;
                    }
                    speed.innerText = `Speed: ${wpm} wpm`;
                }
            }
        }
    })
})

function getFile() {
    return fetch("wordlist.txt")
        .then((res) => res.text())
        .then((text) => {
            // do something with "text"
            let wordList = text.split("\n");
            return wordList;
        })
        .catch((e) => console.error(e));
}