const input = document.getElementById("searchInput") as HTMLInputElement;
const allCharacters = "https://swapi.dev/api/people/";
const pElement = document.querySelector("p") as HTMLParagraphElement;
const inputContainer = document.querySelector("#InputContainer") as HTMLDivElement;



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
}
// skapar buttons för alla personer som vi skapat och lägger till namnet på person innuti
function buttonMaker() {
    for (let i = 0; i < persons.length; i++) {
      let newbuttons = document.createElement("button") as HTMLButtonElement;
      newbuttons.classList.add("hidden", "charButtons");
      newbuttons.textContent = persons[i].name;
      inputContainer.appendChild(newbuttons);
    }
  }


  input.addEventListener("keyup", function(event) {
    const buttons = document.querySelectorAll("button") as NodeListOf<HTMLButtonElement>;
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


 