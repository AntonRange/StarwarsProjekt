const input = document.getElementById("searchInput") as HTMLInputElement;
const allCharacters = "https://swapi.dev/api/people/";
const pElement = document.querySelector("p") as HTMLParagraphElement;
const inputContainer = document.querySelector("#InputContainer") as HTMLDivElement;
const suggestions = document.getElementById("suggestions") as HTMLDivElement;
const favorites = document.getElementById("favourites") as HTMLDivElement;
const selectedCharCards = document.querySelector("#selectedCharCards") as HTMLDivElement;

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
    console.log(pages[i])
    listOfCharacters = await fetch(pages[i]);
    console.log(`Loading page ${i}`);
    let list = await listOfCharacters.json();
    test.push(list.results);
  }
  createPerson()
  selectCharacters()
  
}
characters()

class Person {
    name: string;
    birth_year: string;
  
    constructor(name: string, birth_year: string) {
      this.name = name;
      this.birth_year = birth_year;
    }
  }
let persons: Person[] = [];
function createPerson() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < test[i].length; j++) {
      let newPerson = new Person(test[i][j].name, test[i][j].birth_year);
      persons.push(newPerson);
        
        
    }
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
  function charCards() {
    for (let i = 0; i < persons.length; i++) {
      let newCard = document.createElement("div") as HTMLDivElement;
      let newCardName = document.createElement("p") as HTMLParagraphElement;
      newCardName.innerHTML = persons[i].name;
      let newCardBirthYear = document.createElement("p") as HTMLParagraphElement;
      newCardBirthYear.innerHTML = persons[i].birth_year;
      newCard.appendChild(newCardName);
      newCard.appendChild(newCardBirthYear);
      newCard.classList.add("charCards", "hidden")
      selectedCharCards.appendChild(newCard)
    }
  }

  input.addEventListener("keyup", function(event) {
    const buttons = document.querySelectorAll(".charButtons") as NodeListOf<HTMLButtonElement>;
    if (!input.value) {
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.add("hidden");
      }
    } else {
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].textContent && buttons[i].textContent?.toLowerCase().includes(input.value.toLowerCase())) {
            
          buttons[i].classList.remove("hidden");
        } else {
          buttons[i].classList.add("hidden");
        }
      }
    }
  });




  let lastClickedButton: HTMLButtonElement;

  function selectCharacters() {
    const charButtons = document.querySelectorAll(".charButtons") as NodeListOf<HTMLButtonElement>;
    const charCards = document.querySelectorAll(".charCards") as NodeListOf<HTMLDivElement>;
    charButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const person = persons.find((p) => p.name === button.innerText);
  
        if (person) {
          input.value = "";
            
          charCards.forEach((card) => {
            card.classList.add("hidden");
            const cardName = card.querySelector("p:first-child") as HTMLParagraphElement;
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






