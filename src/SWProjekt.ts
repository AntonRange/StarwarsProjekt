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
const favoriteCharButtonContainer = document.querySelector("#favoriteCharButtonContainer") as HTMLButtonElement;
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
      loadingPtag.innerHTML = `Loading page ${i} / ${9}`
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
    let newCardHomeworld = document.createElement("p");
    let newCardFilms = document.createElement("ul");
    newCardName.innerHTML = `Name: ${persons[i].name}`;
    newCardBirthYear.innerHTML = `Birth Year: ${persons[i].birth_year}`;
    newCardFilms.innerHTML = `Featured in: `;
    newCardHomeworld.innerHTML = `Homeworld: ${persons[i].homeWorld[1]}`;
    for (let c = 0; c < persons[i].films.length; c++){
      const liElement = document.createElement("li")
      liElement.innerHTML = persons[i].films[c];
      newCardFilms.appendChild(liElement);
    }
    
    newCard.appendChild(newCardName);
    newCard.appendChild(newCardBirthYear);
    newCard.appendChild(newCardHomeworld)
    newCard.appendChild(newCardFilms);
    newCard.classList.add("charCards", "hidden");
    selectedCharCards.appendChild(newCard);
  }
}



let pressedButtons: number[] = []
input.addEventListener("click", function() {
    
    const charButtons = document.querySelectorAll(".charButtons") as NodeListOf<HTMLButtonElement>;
    for (let i = 0; i < pressedButtons.length; i++) {
      suggestions.classList.remove("hidden")
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

  // clonedButtons funktionen är bara så att den tar indexvärdet som vi sparat i attributet index på nyskapade knapparna. Dem sparades som string så fick använda mig av parseint för att få ut stringen så att de blev en siffra.
function clonedButtons() {
    const clonedButton = document.querySelectorAll(".Cloned") as NodeListOf<HTMLButtonElement>;
    const charButtons = document.querySelectorAll(".charButtons") as NodeListOf<HTMLButtonElement>;
    for (let i = 0; i < clonedButton.length; i++) {
        clonedButton[i].onclick = function() {

            let indexAttribute = clonedButton[i].getAttribute("index");
            let index = indexAttribute ? parseInt(indexAttribute, 10) : null;
            console.log(index)
            // den klagade på att index kanske va null så satte dit en ifsats för att få bort mitt error. Den gör bara en jämförelse. Om index inte är null så kommer den göra ett click på charButtons[index]. Den fungerar precis som om att man klickade på den riktiga charButtons 
            
            if (index !== null) {
                charButtons[index].click();
                console.log(clonedButton)
              }
        };
    }
}

let starClicked: number[] = []
const clonedButtonIndex: number[] = [];


// Här är min stora funktion som gör allt! Ser lite stökig ut! Men denna functionen displayer rätt kort på rätt plats. Man kan hitta rätt kort oavsett om man har favoriserat den, sökt på den eller helt enkelt tryckt på pilen tills man hittat den! Anledningen att jag har allt i samma är för att den ville aldrig hitta rätt kort. Koderna fungerade separat, tex min selectCharacter funktion fungerade med changeCard men så fort jag började pilla på pilarna för att bläddra lite så försvann kort osv. Det hade med räknaren att göra.
function changeChar() {
let CurrentIndex = 0;
    const charButtons = document.querySelectorAll(".charButtons") as NodeListOf<HTMLButtonElement>;
    for (let i = 0; i < charButtons.length; i++) {
        charButtons[i].onclick = function() {
          suggestions.classList.add("hidden")
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
        
        // ett smidigt sätt att få knappen att inte fungera om man redan har tryckt på den innan! Denna lilla kodsnutten fungerar på så sätt att om clonedButtonIndex arrayen innehåller currentIndex så stoppar den onclick funktionen från att köra på!
        if (clonedButtonIndex.includes(CurrentIndex)) {
          return;
        }
        if (clonedButtonIndex.length === 7) {
          console.log(clonedButtonIndex)
          return;
        }
        favoriteButton.src = "../images/clickedStar.png";
        let l = CurrentIndex
        starClicked.push(l)
        //här skapar vi bara en knapp som har samma namn som de kortet som visades med hjälp av index som vi sedan använder för att hitta rätt namn i persons!
        const clonedButton = document.createElement("button") as HTMLButtonElement;
        clonedButton.innerText = persons[CurrentIndex].name
        clonedButton.setAttribute("index", CurrentIndex.toString());
        clonedButton.classList.add("Cloned")
        favoriteCharButtonContainer.appendChild(clonedButton)
        
        clonedButtonIndex.push(CurrentIndex);
        clonedButtons()
      }
    const nextbtn = document.querySelector("#nextButton") as HTMLButtonElement;
    const prevbtn = document.querySelector("#prevButton") as HTMLButtonElement;
    const charCards = document.querySelectorAll(".charCards") as NodeListOf<HTMLDivElement>;
    nextbtn.onclick = function() {
        CurrentIndex++;

        // här är enkla "if satser" 
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
      // samma som ovanför, här byter vi bara bild så att sjärnar är ifylld med fin gul färg för att illustrera att den redan är favoriserad!
      if (starClicked.includes(CurrentIndex)) {
        favoriteButton.src = "../images/clickedStar.png";
      } else {
        favoriteButton.src = "../images/1828970.png";
      }
        prevbtn.disabled = CurrentIndex === 0;
        const currentChar = CurrentIndex;
        let nextChar = CurrentIndex + 1;
        let prevChar = CurrentIndex - 1;
        for (let c = 0; c < persons.length; c++) {

            charCards[c].classList.add("hidden");
        }
        // några if satser för att hindra changeChard från att försöka appenda saker som inte går, tex om currentindex va på 0! För då hade prevChar försökt appenda charCards[-1] vilket hade spottat ut en massa fel!
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
  // const allCharButton = document.querySelector("#allCharButton") as HTMLButtonElement;

  // allCharButton.onclick = function() {
  //   const charButtons = document.querySelectorAll(".charButtons") as NodeListOf<HTMLButtonElement>;
  //   for (let i = 0; i < charButtons.length; i++){
  //   let buttons = charButtons[i].innerText
  //   console.log(charButtons)
  // }
  // }



