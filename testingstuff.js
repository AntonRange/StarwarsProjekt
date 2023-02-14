"use strict";
const input = document.getElementById("searchInput");
const allCharacters = "https://swapi.dev/api/people/";
const pElement = document.querySelector("p");
const inputContainer = document.querySelector("#InputContainer");
const suggestions = document.getElementById("suggestions");
const prevCharSection = document.getElementById("prevChar");
const nextCharSection = document.getElementById("nextChar");
const selectedCharCards = document.querySelector("#selectedCharCards");
const favoriteButton = document.querySelector("#FavImage");
const loadingPtag = document.getElementById("loadingPtag");
const overlay = document.querySelector('.overlay');
let pages = {};
for (let i = 0; i <= 9; i++) {
    if (i === 0) {
        pages[i] = allCharacters;
    }
    else {
        pages[i] = `${allCharacters}?page=${i}`;
    }
}
let characters = [];
async function apiFetch() {
    for (let i = 1; i <= 9; i++) {
        loadingPtag.innerHTML = `Loading page ${i}`;
        console.log(pages[i]);
        let listOfCharacters = await fetch(pages[i]);
        console.log(`Loading page ${i}`);
        let list = await listOfCharacters.json();
        for (const character of list.results) {
            const response = await fetch(character.homeworld);
            const homeworld = await response.json();
            const charWorld = [homeworld.climate, homeworld.name, homeworld.population, homeworld.terrain];
            let filmTitles = [];
            for (let j = 0; j < character.films.length; j++) {
                const film = await fetch(character.films[j]);
                const filmData = await film.json();
                filmTitles.push(filmData.title);
            }
            characters.push({
                name: character.name,
                birth_year: character.birth_year,
                homeworld: charWorld,
                films: filmTitles
            });
        }
    }
    overlay.style.display = 'none';
    createPerson();
}
apiFetch();
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
    for (const character of characters) {
        const newPerson = new Person(character.name, character.birth_year, character.homeworld, character.films);
        persons.push(newPerson);
    }
    buttonMaker();
    SelectedcharCards();
    changeChar();
}
function buttonMaker() {
    for (let i = 0; i < persons.length; i++) {
        let newbuttons = document.createElement("button");
        newbuttons.classList.add("charButtons", "hidden");
        newbuttons.textContent = persons[i].name;
        suggestions.appendChild(newbuttons);
    }
}
let fuckingdog = [];
function SelectedcharCards() {
    for (let i = 0; i < persons.length; i++) {
        console.log(persons[i]);
        let newCard = document.createElement("div");
        let newCardName = document.createElement("p");
        let newCardBirthYear = document.createElement("p");
        let newCardFilms = document.createElement("p");
        newCardName.innerHTML = `Name: ${persons[i].name}`;
        newCardBirthYear.innerHTML = `Birth Year: ${persons[i].birth_year}`;
        newCardFilms.innerHTML = `Featured in: ${persons[i].films.join(", ")}`;
        newCard.appendChild(newCardName);
        newCard.appendChild(newCardBirthYear);
        newCard.appendChild(newCardFilms);
        newCard.classList.add("charCards", "hidden");
        selectedCharCards.appendChild(newCard);
    }
}
let pressedButtons = [];
input.addEventListener("click", function () {
    const charButtons = document.querySelectorAll(".charButtons");
    for (let i = 0; i < pressedButtons.length; i++) {
        let number = pressedButtons[i];
        charButtons[number].classList.remove("hidden");
        console.log(pressedButtons);
    }
});
// lyssnar på inputfielden på knapptryck. För varje knapp som trycks så jämför den inputvärdet med knapparnas textcontent. Tex om du skriver "lu" så kommer den hitta alla som har "lu" i knappens innertext.
input.addEventListener("keyup", function (event) {
    var _a;
    const charButtons = document.querySelectorAll(".charButtons");
    for (let i = 0; i < pressedButtons.length; i++) {
        let number = pressedButtons[i];
        charButtons[number].classList.add("hidden");
    }
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
function clonedButtons() {
    const clonedButton = document.querySelectorAll(".Cloned");
    const charButtons = document.querySelectorAll(".charButtons");
    for (let i = 0; i < clonedButton.length; i++) {
        clonedButton[i].addEventListener("click", function () {
            let indexAttribute = clonedButton[i].getAttribute("index");
            let index = indexAttribute ? parseInt(indexAttribute, 10) : null;
            console.log(index);
            if (index !== null) {
                charButtons[index].click();
            }
        });
    }
}
function changeChar() {
    let test = 0;
    const charButtons = document.querySelectorAll(".charButtons");
    for (let i = 0; i < charButtons.length; i++) {
        charButtons[i].onclick = function () {
            favoriteButton.src = "1828970.png";
            test = i;
            input.value = "";
            pressedButtons.push([i]);
            updateCards();
            for (let k = 0; k < charButtons.length; k++) {
                charButtons[k].classList.add("hidden");
            }
        };
    }
    const nextbtn = document.querySelector("#nextButton");
    const prevbtn = document.querySelector("#prevButton");
    const charCards = document.querySelectorAll(".charCards");
    nextbtn.onclick = function () {
        test++;
        prevbtn.disabled = test === 0;
        nextbtn.disabled = test === persons.length - 1;
        updateCards();
    };
    prevbtn.onclick = function () {
        test--;
        prevbtn.disabled = test === 0;
        nextbtn.disabled = test === persons.length - 3;
        updateCards();
    };
    function updateCards() {
        prevbtn.disabled = test === 0;
        const currentChar = test;
        let nextChar = test + 1;
        let prevChar = test - 1;
        for (let c = 0; c < persons.length; c++) {
            charCards[c].classList.add("hidden");
        }
        if (prevChar >= 0) {
            charCards[prevChar].classList.remove("hidden");
            prevCharSection.appendChild(charCards[test - 1]);
        }
        if (currentChar >= 0) {
            charCards[currentChar].classList.remove("hidden");
            selectedCharCards.appendChild(charCards[test]);
        }
        if (nextChar >= 0 && nextChar < persons.length) {
            charCards[nextChar].classList.remove("hidden");
            nextCharSection.appendChild(charCards[test + 1]);
        }
    }
    updateCards();
}
