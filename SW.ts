const input = document.getElementById("searchInput") as HTMLInputElement;
const allCharacters = "https://swapi.dev/api/people/";
const pElement = document.querySelector("p") as HTMLParagraphElement;
const inputContainer = document.querySelector("#InputContainer") as HTMLDivElement;
const suggestions = document.getElementById("suggestions") as HTMLDivElement;
const favorites = document.getElementById("favourites") as HTMLDivElement;
const selectedCharCards = document.querySelector("#selectedCharCards") as HTMLDivElement;
const favoriteButton = document.querySelector("#favoritKnapp") as HTMLButtonElement;
let charList: any = {};
let pages: any = {};
for (let i = 0; i <= 9; i++) {
  if (i === 0) {
    pages[i] = allCharacters;
  } else {
    pages[i] = `${allCharacters}?page=${i}`;
  }
}

let listOfCharacters: any = [];
let test: any = [];

async function characters() {
    for (let i = 1; i <= 9; i++) {
      console.log(pages[i]);
      listOfCharacters = await fetch(pages[i]);
      console.log(`Loading page ${i}`);
      let list = await listOfCharacters.json();
  
      for (const character of list.results) {
        const response = await fetch(character.homeworld);
        const homeworld = await response.json();
  
        let filmTitles = [];
        for (let j = 0; j < character.films.length; j++) {
          const film = await fetch(character.films[j]);
          const filmData = await film.json();
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
    createPerson()
    selectCharacters()
  }
characters()





class Person {
    name: string;
    birth_year: string;
    homeWorld: string;
    films: string;
  
    constructor(name: string, birth_year: string, homeWorld: string, films: string) {
      this.name = name;
      this.birth_year = birth_year;
      this.homeWorld = homeWorld;
      this.films = films;
    }
  }
let persons: Person[] = [];
function createPerson() {
    console.log("reeeee");
    for (let j = 0; j < test.length; j++) {
      let newPerson = new Person(test[j].name, test[j].birth_year, test[j].homeworld, test[j].films);
      persons.push(newPerson);
}
buttonMaker()
charCards()
}
// skapar buttons för alla personer som vi skapat och lägger till namnet på person innuti
function buttonMaker() {
    for (let i = 0; i < persons.length; i++) {
      let newbuttons = document.createElement("button") as HTMLButtonElement;
      newbuttons.classList.add("charButtons", "hidden");
      newbuttons.textContent = persons[i].name;
      suggestions.appendChild(newbuttons);
    }
  }

  // skapar "Cards" för varje person. En sektion och två p taggar. Ska uppdateras med mer! TESTVERSION
  function charCards() {
    for (let i = 0; i < persons.length; i++) {
      let newCard = document.createElement("div") as HTMLDivElement;
      let newCardName = document.createElement("p") as HTMLParagraphElement;
      let newCardBirthYear = document.createElement("p") as HTMLParagraphElement;
      let newCardFilms = document.createElement("p") as HTMLParagraphElement;
      newCardName.innerHTML = `Name: ${persons[i].name}`;
      newCardBirthYear.innerHTML = `Birth Year: ${persons[i].birth_year}`;
      newCardFilms.innerHTML = `Starred in: `;
      for (let j = 0; j < persons[i].films.length; j++) {
        newCardFilms.innerHTML += ` ${persons[i].films[j]}, `
      }
      newCard.appendChild(newCardName);
      newCard.appendChild(newCardBirthYear);
      newCard.appendChild(newCardFilms);
      newCard.classList.add("charCards", "hidden")
      selectedCharCards.appendChild(newCard)
    }
  }
let pressedButtons:any = [];
input.addEventListener("click", function() {
    const charButtons = document.querySelectorAll(".charButtons") as NodeListOf<HTMLButtonElement>;
    for (let i = 0; i < pressedButtons.length; i++) {
        let number = pressedButtons[i];
        charButtons[number].classList.remove("hidden")
    }
  });
// lyssnar på inputfielden på knapptryck. För varje knapp som trycks så jämför den inputvärdet med knapparnas textcontent. Tex om du skriver "lu" så kommer den hitta alla som har "lu" i knappens innertext.
  input.addEventListener("keyup", function(event) {
    const charButtons = document.querySelectorAll(".charButtons") as NodeListOf<HTMLButtonElement>;
    for (let i = 0; i < pressedButtons.length; i++) {
        let number = pressedButtons[i];
        charButtons[number].classList.add("hidden")
    }
    const buttons = document.querySelectorAll(".charButtons") as NodeListOf<HTMLButtonElement>;
    if (!input.value) {
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.add("hidden");
      }
    } else {
      for (let i = 0; i < buttons.length; i++) {
        // här sker jämförelsen
        if (buttons[i].textContent && buttons[i].textContent?.toLowerCase().includes(input.value.toLowerCase())) {
            //så om if satsen hittar matching så tar den bort klassen hidden från knappen så att den visas i suggestions sectionen. Om en knapp inte matchar texten man skrivit in i inputfielden så får den hidden klassen
          buttons[i].classList.remove("hidden");
        } else {
          buttons[i].classList.add("hidden");
        }
      }
    }
  });

  function selectCharacters() {
    const charButtons = document.querySelectorAll(".charButtons") as NodeListOf<HTMLButtonElement>;
    const charCards = document.querySelectorAll(".charCards") as NodeListOf<HTMLDivElement>;
    
    for (let i = 0; i < charButtons.length; i++) {
       
        charButtons[i].onclick = function() {
            favoriteButton.onclick = function() {
            
                let clonedButton = charButtons[i].cloneNode(true) as HTMLButtonElement;
                clonedButton.setAttribute("index", String(i));
        
        clonedButton.classList.remove("hidden", "charButtons")
        clonedButton.classList.add("Cloned")
        favorites.appendChild(clonedButton);
        console.log(clonedButton)
        favButton()
            }
            input.value = "";
            pressedButtons.push([i])
          // Hide all charCards
          for (let j = 0; j < charCards.length; j++) {
            charCards[j].style.display = "none";
          }
          // Show the corresponding charCard
          charCards[i].style.display = "block";
      
          // Hide all charButtons
          for (let k = 0; k < charButtons.length; k++) {
            charButtons[k].classList.add("hidden");
          }
        };
      }
  }

function favButton() {
    const clonedButton = document.querySelectorAll(".Cloned") as NodeListOf<HTMLButtonElement>;
    const charButtons = document.querySelectorAll(".charButtons") as NodeListOf<HTMLButtonElement>;
    for (let i = 0; i < clonedButton.length; i++) {
        clonedButton[i].addEventListener("click", function() {

            let indexAttribute = clonedButton[i].getAttribute("index");
            let index = indexAttribute ? parseInt(indexAttribute, 10) : null;
            console.log(index)
            if (index !== null) {
                charButtons[index].click();
              }
        });
    }
}

