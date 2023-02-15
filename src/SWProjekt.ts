const input = document.getElementById("searchInput") as HTMLInputElement;
const allCharacters = "https://swapi.dev/api/people/";
const pElement = document.querySelector("p") as HTMLParagraphElement;
const inputContainer = document.querySelector("#InputContainer") as HTMLDivElement;
const suggestions = document.getElementById("suggestions") as HTMLDivElement;
const prevCharSection = document.getElementById("prevChar") as HTMLDivElement;
const nextCharSection = document.getElementById("nextChar") as HTMLDivElement;
const selectedCharCards = document.querySelector("#selectedCharCards") as HTMLDivElement;
const favoriteButton = document.querySelector("#FavImage") as HTMLImageElement;
const favoriteChars = document.querySelector("#favoriteChars") as HTMLDivElement;
const loadingPtag = document.getElementById("loadingPtag") as HTMLParagraphElement;
const overlay = document.querySelector('.overlay') as HTMLDivElement;

let pages: {[pageNumber: number]: string} = {}
for (let i = 0; i <= 9; i++) {
  pages[i] = `${allCharacters}?page=${i}`;
}

interface Character {
  name: string;
  birth_year: string;
  homeworld: string[]
  films: string[];
}



let characters: Character[] = [];
async function apiFetch() {
    for (let i = 1; i <= 9; i++) {
      // loadingPtag.innerHTML = `Loading page ${i}`
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
    // overlay.style.display = 'none';
    createPerson()

  }
  apiFetch()


  class Person {
    name: string;
    birth_year: string;
    homeWorld: string[];
    films: string[];
  
    constructor(name: string,birth_year: string, homeWorld: string[], films: string[]) {
      this.name = name;
      this.birth_year = birth_year;
      this.homeWorld = homeWorld;
      this.films = films;
    }
  }
  
  let persons: Person[] = [];
  
  function createPerson() {
    for (const character of characters) {
      const newPerson = new Person(character.name, character.birth_year, character.homeworld,character.films);
      persons.push(newPerson);
    }
    buttonMaker();
    
    SelectedcharCards();
    changeChar();
    clonedButtons()
  }

function buttonMaker() {
    for (let i = 0; i < persons.length; i++) {
      let newbuttons = document.createElement("button") as HTMLButtonElement;
      newbuttons.classList.add("charButtons", "hidden");
      newbuttons.textContent = persons[i].name;
      suggestions.appendChild(newbuttons);
    }
  }


 function SelectedcharCards() {
  for (let i = 0; i < persons.length; i++) {
    let newCard = document.createElement("div");
    let newCardName = document.createElement("p");
    let newCardBirthYear = document.createElement("p");
    let newCardFilms = document.createElement("ul");
    newCardName.innerHTML = `Name: ${persons[i].name}`;
    newCardBirthYear.innerHTML = `Birth Year: ${persons[i].birth_year}`;
    newCardFilms.innerHTML = `Featured in: `;
    for (let c = 0; c < persons[i].films.length; c++){
      const liElement = document.createElement("li")
      liElement.innerHTML = persons[i].films[c];
      newCardFilms.appendChild(liElement);
    }
    newCard.appendChild(newCardName);
    newCard.appendChild(newCardBirthYear);
    newCard.appendChild(newCardFilms);
    newCard.classList.add("charCards", "hidden");
    selectedCharCards.appendChild(newCard);
  }
}



let pressedButtons: number[] = []
input.addEventListener("click", function() {
    
    const charButtons = document.querySelectorAll(".charButtons") as NodeListOf<HTMLButtonElement>;
    for (let i = 0; i < pressedButtons.length; i++) {
        let number = pressedButtons[i];
        charButtons[number].classList.remove("hidden")
        console.log(pressedButtons)
        
    }
  });
// lyssnar på inputfielden på knapptryck. För varje knapp som trycks så jämför den inputvärdet med knapparnas textcontent. Tex om du skriver "lu" så kommer den hitta alla som har "lu" i knappens innertext.
  input.addEventListener("keyup", function() {
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

function clonedButtons() {
    const clonedButton = document.querySelectorAll(".Cloned") as NodeListOf<HTMLButtonElement>;
    const charButtons = document.querySelectorAll(".charButtons") as NodeListOf<HTMLButtonElement>;
    for (let i = 0; i < clonedButton.length; i++) {
        clonedButton[i].onclick = function() {

            let indexAttribute = clonedButton[i].getAttribute("index");
            let index = indexAttribute ? parseInt(indexAttribute, 10) : null;
            console.log(index)
            if (index !== null) {
                charButtons[index].click();
                console.log(clonedButton)
              }
        };
    }
}

const clonedButtonIndex: number[] = [];
function changeChar() {
let CurrentIndex = 0;
    const charButtons = document.querySelectorAll(".charButtons") as NodeListOf<HTMLButtonElement>;
    for (let i = 0; i < charButtons.length; i++) {
        charButtons[i].onclick = function() {
          
          favoriteButton.src = "../images/1828970.png";
          CurrentIndex = i;
          input.value = "";
          pressedButtons.push(i)
        
          updateCards();
          for (let k = 0; k < charButtons.length; k++) {
            charButtons[k].classList.add("hidden");
          }
        };
      }
      
      favoriteButton.onclick = function() {
        if (clonedButtonIndex.includes(CurrentIndex)) {
          return;
        }
        const clonedButton = document.createElement("button") as HTMLButtonElement;
        clonedButton.innerText = persons[CurrentIndex].name
        clonedButton.setAttribute("index", CurrentIndex.toString());
        clonedButton.classList.remove("charButtons", "hidden")
        clonedButton.classList.add("Cloned")
        favoriteChars.appendChild(clonedButton)
        
        clonedButtonIndex.push(CurrentIndex);
        clonedButtons()
      }
    const nextbtn = document.querySelector("#nextButton") as HTMLButtonElement;
    const prevbtn = document.querySelector("#prevButton") as HTMLButtonElement;
    const charCards = document.querySelectorAll(".charCards") as NodeListOf<HTMLDivElement>;
   
    
    
    nextbtn.onclick = function() {
        CurrentIndex++;

      prevbtn.disabled = CurrentIndex === 0;
      nextbtn.disabled = CurrentIndex === persons.length - 1;
      updateCards();
    };
  
    prevbtn.onclick = function() {
        CurrentIndex--;
      prevbtn.disabled = CurrentIndex === 0;
      nextbtn.disabled = CurrentIndex === persons.length - 3;
      updateCards();
    };
  
    function updateCards() {
        prevbtn.disabled = CurrentIndex === 0;
        const currentChar = CurrentIndex;
        let nextChar = CurrentIndex + 1;
        let prevChar = CurrentIndex - 1;
        for (let c = 0; c < persons.length; c++) {

            charCards[c].classList.add("hidden");
        }
        if (prevChar >= 0) {
            charCards[prevChar].classList.remove("hidden");
            prevCharSection.appendChild(charCards[CurrentIndex - 1]);
        }
        if (currentChar >= 0) {
            charCards[currentChar].classList.remove("hidden");
            selectedCharCards.appendChild(charCards[CurrentIndex]);
        }
        if (nextChar >= 0 && nextChar < persons.length) {
            charCards[nextChar].classList.remove("hidden");
            nextCharSection.appendChild(charCards[CurrentIndex + 1]);
        }
    }
    updateCards()
  }
  



