const textContainer = document.getElementById("text");
const textGenerator = document.getElementById("textGenerator");
const caret = document.getElementById("caret");
const speed = document.getElementById("speed");

const word = document.createElement("div");
word.classList.add("word");

const letter = document.createElement("span");
letter.classList.add("letter");

let currentLetter;
let startTime;
let timeStarted = false;
let trueCharsCount = 0;

let generateText = async () => {
    textContainer.textContent = ""
    let url = "https://fish-text.ru/get";
    let req = await fetch(url, {
        type: "sentence",
        number: 4,
        format: "JSON"
    })

    let res = await req.json();

    let text = res.text.split(" ").map(w => {
        let wt = word.cloneNode();
        w.split("").forEach(l => {
            let lt = letter.cloneNode();
            lt.textContent = l;
            wt.append(lt);
        });
        textContainer.append(wt)
    });
    LetterEvents.wc = 0;
    LetterEvents.lc = 0;
    currentLetter = textContainer.children[0].children[0];
    caret.style.display = "block";
    caret.style.left = currentLetter.getBoundingClientRect().left + "px";
    caret.style.top = currentLetter.getBoundingClientRect().top + 3 + "px";
    timeStarted = false;
}

class LetterEvents {
    static wc = 0;
    static lc = 0;
    static w = textContainer;

    static colorNextLetter(key, code){
        let e = this.w.children[this.wc].children;
        if("qwertyuiopasdfghjklzxcvbnm,.=.?/!:;'\"йцукенгёшщзхъфывапролджэячсмитьбю".includes(key.toLowerCase())){
            if(key === e[this.lc].textContent){
                e[this.lc].classList.add("correct");
                currentLetter = e[this.lc];
                caret.style.left = currentLetter.getBoundingClientRect().left + currentLetter.offsetWidth + "px";
                caret.style.top = currentLetter.getBoundingClientRect().top + 3 + "px";
                this.lc += 1;
                trueCharsCount++;
            } else {
                e[this.lc].classList.add("wrong")
            }
        } else if((key === " ") && (this.lc === e.length)){
            this.lc = 0;
            this.wc += 1;
            caret.style.left = currentLetter.getBoundingClientRect().left + currentLetter.offsetWidth + 10 + "px";
        }
    }
}
generateText();

textGenerator.addEventListener("click", () => {
    generateText(); 
});

window.addEventListener("keydown", (e) => {
    e.preventDefault(); 
    LetterEvents.colorNextLetter(e.key, e.code)
    if(!timeStarted){
        startTime = Date.now();
        setInterval(() => {
            speed.textContent = Math.floor(trueCharsCount * 60 * 60 * 10 / (Date.now() - startTime) % (60 * 60 * 1000));
        }, 1000)
        timeStarted = true;
    }
});