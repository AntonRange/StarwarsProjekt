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
            for (const character of list.results) {
                const response = yield fetch(character.homeworld);
                const homeworld = yield response.json();
                let filmTitles = [];
                for (let j = 0; j < character.films.length; j++) {
                    const film = yield fetch(character.films[j]);
                    const filmData = yield film.json();
                    filmTitles.push(filmData.title);
                }
                test.push({
                    name: character.name,
                    birth_year: character.birth_year,
                    homeworld: homeworld.name,
                    films: filmTitles
                });
            }
        }
        createPerson();
        selectCharacters();
    });
}
characters();
class Person {
    constructor(name, birth_year, homeWorld, films) {
        this.name = name;
        this.birth_year = birth_year;
        this.homeWorld = homeWorld;
        this.films = films;
    }
}
let persons = [];
function createPerson() {
    console.log("reeeee");
    for (let j = 0; j < test.length; j++) {
        let newPerson = new Person(test[j].name, test[j].birth_year, test[j].homeworld, test[j].films);
        persons.push(newPerson);
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
// skapar "Cards" för varje person. En sektion och två p taggar. Ska uppdateras med mer! TESTVERSION
function charCards() {
    for (let i = 0; i < persons.length; i++) {
        let newCard = document.createElement("div");
        let newCardName = document.createElement("p");
        newCardName.innerHTML = `Name: ${persons[i].name}`;
        let newCardBirthYear = document.createElement("p");
        newCardBirthYear.innerHTML = `Birth Year: ${persons[i].birth_year}`;
        let newCardFilms = document.createElement("p");
        newCardFilms.innerHTML = `Starred in`;
        for (let j = 0; j < persons[i].films.length; j++) {
            newCardFilms.innerHTML += `${persons[i].films[j]}, `;
        }
        newCard.appendChild(newCardName);
        newCard.appendChild(newCardBirthYear);
        newCard.appendChild(newCardFilms);
        newCard.classList.add("charCards", "hidden");
        selectedCharCards.appendChild(newCard);
    }
}
// lyssnar på inputfielden på knapptryck. För varje knapp som trycks så jämför den inputvärdet med knapparnas textcontent. Tex om du skriver "lu" så kommer den hitta alla som har "lu" i knappens innertext.
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
            // här sker jämförelsen
            if (buttons[i].textContent && ((_a = buttons[i].textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(input.value.toLowerCase()))) {
                //så om if satsen hittar matching så tar den bort klassen hidden från knappen så att den visas i suggestions sectionen. Om en knapp inte matchar texten man skrivit in i inputfielden så får den hidden klassen
                buttons[i].classList.remove("hidden");
            }
            else {
                buttons[i].classList.add("hidden");
            }
        }
    }
});
function selectCharacters() {
    const charButtons = document.querySelectorAll(".charButtons");
    const charCards = document.querySelectorAll(".charCards");
    for (let i = 0; i < charButtons.length; i++) {
        charButtons[i].onclick = function () {
            // Hide all charCards
            for (let j = 0; j < charCards.length; j++) {
                charCards[j].style.display = "none";
            }
            // Show the corresponding charCard
            charCards[i].style.display = "block";
        };
    }
}
