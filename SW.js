"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const input = document.getElementById("searchInput");
const allCharacters = "https://swapi.dev/api/people/";
const pElement = document.querySelector("p");
const inputContainer = document.querySelector("#InputContainer");
const suggestions = document.getElementById("suggestions");
const favorites = document.getElementById("favourites");
const selectedCharCards = document.querySelector("#selectedCharCards");
let charList = {};
let pages = {};
for (let i = 0; i <= 9; i++) {
    if (i === 0) {
        pages[i] = allCharacters;
    }
    else {
        pages[i] = `${allCharacters}?page=${i}`;
    }
}
let listOfCharacters = [];
let test = [];
function characters() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 1; i <= 9; i++) {
            console.log(pages[i]);
            listOfCharacters = yield fetch(pages[i]);
            console.log(`Loading page ${i}`);
            let list = yield listOfCharacters.json();
            test.push(list.results);
        }
        createPerson();
        consolebuttons();
    });
}
characters();
class Person {
    constructor(name, birth_year) {
        this.name = name;
        this.birth_year = birth_year;
    }
}
let persons = [];
function createPerson() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < test[i].length; j++) {
            let newPerson = new Person(test[i][j].name, test[i][j].birth_year);
            persons.push(newPerson);
        }
    }
    buttonMaker();
    charCards();
}
// skapar buttons för alla personer som vi skapat och lägger till namnet på person innuti
function buttonMaker() {
    for (let i = 0; i < persons.length; i++) {
        let newbuttons = document.createElement("button");
        newbuttons.classList.add("charButtons", "hidden");
        newbuttons.textContent = persons[i].name;
        suggestions.appendChild(newbuttons);
    }
}
function charCards() {
    for (let i = 0; i < persons.length; i++) {
        let newCard = document.createElement("div");
        let newCardName = document.createElement("p");
        newCardName.innerHTML = persons[i].name;
        let newCardBirthYear = document.createElement("p");
        newCardBirthYear.innerHTML = persons[i].birth_year;
        newCard.appendChild(newCardName);
        newCard.appendChild(newCardBirthYear);
        newCard.classList.add("charCards", "hidden");
        selectedCharCards.appendChild(newCard);
    }
}
input.addEventListener("keyup", function (event) {
    var _a;
    const buttons = document.querySelectorAll(".charButtons");
    if (!input.value) {
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.add("hidden");
        }
    }
    else {
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].textContent && ((_a = buttons[i].textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(input.value.toLowerCase()))) {
                buttons[i].classList.remove("hidden");
            }
            else {
                buttons[i].classList.add("hidden");
            }
        }
    }
});
let lastClickedButton;
function consolebuttons() {
    const charButtons = document.querySelectorAll(".charButtons");
    const charCards = document.querySelectorAll(".charCards");
    charButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const person = persons.find((p) => p.name === button.innerText);
            if (person) {
                input.value = "";
                charCards.forEach((card) => {
                    card.classList.add("hidden");
                    const cardName = card.querySelector("p:first-child");
                    if (cardName.innerText === person.name) {
                        card.classList.remove("hidden");
                    }
                });
            }
        });
    });
}
// TESTA SENARE 
// const favoritKnapp = document.querySelector("#favoritKnapp") as HTMLButtonElement;
// favoritKnapp.onclick = function() {
//     console.log("hej");
//     const favorites = document.getElementById("favourites") as HTMLDivElement;
//     if (lastClickedButton) {
//         const copyButton = lastClickedButton.cloneNode(true) as HTMLButtonElement;
//         copyButton.classList.remove("charButtons", "hidden");
//         copyButton.classList.add("favCharacters");
//         if (lastClickedButton.onclick) {
//             copyButton.addEventListener("click", lastClickedButton.onclick);
//         }
//         favorites.appendChild(copyButton);
//     }
// }
//----------------------------------------------------------------------------------------------------------//
