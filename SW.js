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
}
// skapar buttons för alla personer som vi skapat och lägger till namnet på person innuti
function buttonMaker() {
    for (let i = 0; i < persons.length; i++) {
        let newbuttons = document.createElement("button");
        newbuttons.classList.add("hidden", "charButtons");
        newbuttons.textContent = persons[i].name;
        inputContainer.appendChild(newbuttons);
    }
}
input.addEventListener("keyup", function (event) {
    var _a;
    const buttons = document.querySelectorAll("button");
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
