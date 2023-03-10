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
// lyssnar p?? inputfielden p?? knapptryck. F??r varje knapp som trycks s?? j??mf??r den inputv??rdet med knapparnas textcontent. Tex om du skriver "lu" s?? kommer den hitta alla som har "lu" i knappens innertext.
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
        // h??r sker j??mf??relsen
        if (buttons[i].textContent && buttons[i].textContent?.toLowerCase().includes(input.value.toLowerCase())) {
            //s?? om if satsen hittar matching s?? tar den bort klassen hidden fr??n knappen s?? att den visas i suggestions sectionen. Om en knapp inte matchar texten man skrivit in i inputfielden s?? f??r den hidden klassen
          buttons[i].classList.remove("hidden");
        } else {
          buttons[i].classList.add("hidden");
        }
      }
    }
  });

  // clonedButtons funktionen ??r bara s?? att den tar indexv??rdet som vi sparat i attributet index p?? nyskapade knapparna. Dem sparades som string s?? fick anv??nda mig av parseint f??r att f?? ut stringen s?? att de blev en siffra.
function clonedButtons() {
    const clonedButton = document.querySelectorAll(".Cloned") as NodeListOf<HTMLButtonElement>;
    const charButtons = document.querySelectorAll(".charButtons") as NodeListOf<HTMLButtonElement>;
    for (let i = 0; i < clonedButton.length; i++) {
        clonedButton[i].onclick = function() {

            let indexAttribute = clonedButton[i].getAttribute("index");
            let index = indexAttribute ? parseInt(indexAttribute, 10) : null;
            console.log(index)
            // den klagade p?? att index kanske va null s?? satte dit en ifsats f??r att f?? bort mitt error. Den g??r bara en j??mf??relse. Om index inte ??r null s?? kommer den g??ra ett click p?? charButtons[index]. Den fungerar precis som om att man klickade p?? den riktiga charButtons 
            
            if (index !== null) {
                charButtons[index].click();
                console.log(clonedButton)
              }
        };
    }
}

let starClicked: number[] = []
const clonedButtonIndex: number[] = [];


// H??r ??r min stora funktion som g??r allt! Ser lite st??kig ut! Men denna functionen displayer r??tt kort p?? r??tt plats. Man kan hitta r??tt kort oavsett om man har favoriserat den, s??kt p?? den eller helt enkelt tryckt p?? pilen tills man hittat den! Anledningen att jag har allt i samma ??r f??r att den ville aldrig hitta r??tt kort. Koderna fungerade separat, tex min selectCharacter funktion fungerade med changeCard men s?? fort jag b??rjade pilla p?? pilarna f??r att bl??ddra lite s?? f??rsvann kort osv. Det hade med r??knaren att g??ra.
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
        
        // ett smidigt s??tt att f?? knappen att inte fungera om man redan har tryckt p?? den innan! Denna lilla kodsnutten fungerar p?? s?? s??tt att om clonedButtonIndex arrayen inneh??ller currentIndex s?? stoppar den onclick funktionen fr??n att k??ra p??!
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
        //h??r skapar vi bara en knapp som har samma namn som de kortet som visades med hj??lp av index som vi sedan anv??nder f??r att hitta r??tt namn i persons!
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

        // h??r ??r enkla "if satser" 
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
      // samma som ovanf??r, h??r byter vi bara bild s?? att sj??rnar ??r ifylld med fin gul f??rg f??r att illustrera att den redan ??r favoriserad!
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
        // n??gra if satser f??r att hindra changeChard fr??n att f??rs??ka appenda saker som inte g??r, tex om currentindex va p?? 0! F??r d?? hade prevChar f??rs??kt appenda charCards[-1] vilket hade spottat ut en massa fel!
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



