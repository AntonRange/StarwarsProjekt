"use strict";
//  const input = document.getElementById("searchInput") as HTMLInputElement;
//  const allCharacters = "https:swapi.dev/api/people/";
//  const pElement = document.querySelector("p") as HTMLParagraphElement;
//  const inputContainer = document.querySelector("#InputContainer") as HTMLDivElement;
//  const suggestions = document.getElementById("suggestions") as HTMLDivElement;
//  const favorites = document.getElementById("favourites") as HTMLDivElement;
//  const selectedCharCards = document.querySelector("#selectedCharCards") as HTMLDivElement;
//  let charList: any = {};
//  let pages: any = {};
//  for (let i = 0; i <= 9; i++) {
//    if (i === 0) {
//      pages[i] = allCharacters;
//    } else {
//      pages[i] = `${allCharacters}?page=${i}`;
//    }
//  }
//  let listOfCharacters: any = [];
//  let test: any = [];
//  async function characters() {
//    for (let i = 1; i <= 9; i++) {
//      console.log(pages[i])
//      listOfCharacters = await fetch(pages[i]);
//      console.log(`Loading page ${i}`);
//      let list = await listOfCharacters.json();
//      test.push(list.results);
//    }
//    createPerson()
//  }
//  characters()
//  class Person {
//      name: string;
//      birth_year: string;
//      homeWorld: string;
//      constructor(name: string, birth_year: string, homeWorld: string) {
//        this.name = name;
//        this.birth_year = birth_year;
//        this.homeWorld = homeWorld
//      }
//    }
//  let persons: Person[] = [];
//  async function createPerson() {
//    for (let i = 0; i < test.length; i++) {
//      for (let j = 0; j < test[i].length; j++) {
//          let homeworld = await fetch(test[i][j].homeworld);
//        let planet = await homeworld.json();
//        let newPerson = new Person(test[i][j].name, test[i][j].birth_year, planet.name);
//        persons.push(newPerson);
//      }
//  }
//  console.log("done loading");
//      selectCharacters();
//  buttonMaker()
//  charCards()
//  }
//   //skapar buttons för alla personer som vi skapat och lägger till namnet på person innuti
//  function buttonMaker() {
//      for (let i = 0; i < persons.length; i++) {
//        let newbuttons = document.createElement("button") as HTMLButtonElement;
//        newbuttons.classList.add("charButtons", "hidden");
//        newbuttons.textContent = persons[i].name;
//        suggestions.appendChild(newbuttons);
//      }
//    }
//    // skapar "Cards" för varje person. En sektion och två p taggar. Ska uppdateras med mer! TESTVERSION
//    function charCards() {
//      for (let i = 0; i < persons.length; i++) {
//        let newCard = document.createElement("div") as HTMLDivElement;
//        let newCardName = document.createElement("p") as HTMLParagraphElement;
//        newCardName.innerHTML = persons[i].name;
//        let newCardBirthYear = document.createElement("p") as HTMLParagraphElement;
//        newCardBirthYear.innerHTML = persons[i].birth_year;
//        newCard.appendChild(newCardName);
//        newCard.appendChild(newCardBirthYear);
//        newCard.classList.add("charCards", "hidden")
//        selectedCharCards.appendChild(newCard)
//      }
//    }
// //   lyssnar på inputfielden på knapptryck. För varje knapp som trycks så jämför den inputvärdet med knapparnas textcontent. Tex om du skriver "lu" så kommer den hitta alla som har "lu" i knappens innertext.
//    input.addEventListener("keyup", function(event) {
//      const buttons = document.querySelectorAll(".charButtons") as NodeListOf<HTMLButtonElement>;
//      if (!input.value) {
//        for (let i = 0; i < buttons.length; i++) {
//          buttons[i].classList.add("hidden");
//        }
//      } else {
//        for (let i = 0; i < buttons.length; i++) {
//         //   här sker jämförelsen
//          if (buttons[i].textContent && buttons[i].textContent?.toLowerCase().includes(input.value.toLowerCase())) {
//             //  så om if satsen hittar matching så tar den bort klassen hidden från knappen så att den visas i suggestions sectionen. Om en knapp inte matchar texten man skrivit in i inputfielden så får den hidden klassen
//            buttons[i].classList.remove("hidden");
//          } else {
//            buttons[i].classList.add("hidden");
//          }
//        }
//      }
//    });
//    let lastClickedButton: HTMLButtonElement;
//   //Här leter vi efter rätt person att visa. Med hjälp av .find!! .find 
//    function selectCharacters() {
//     console.log("hej")
//      const charButtons = document.querySelectorAll(".charButtons") as NodeListOf<HTMLButtonElement>;
//      const charCards = document.querySelectorAll(".charCards") as NodeListOf<HTMLDivElement>;
//      charButtons.forEach((button) => {
//         console.log("buttons");
//        button.addEventListener("click", () => {
//         console.log("hej")
//          console.log(button)
//         //   här letar den efter rätt person. om p.name är samma som innerText på knappen som trycks så tilldelas den variablen person
//          const person = persons.find((p) => p.name === button.innerText);
//             //   Denna ifsatsen körs om person hittas. Då börjar den med att rensa input.value och sedan kör en foreach loop för visa rätt card. Den gör det med en jämförelse. Eftersom första paragraphen på varje card är namnet på person så gör den en jämförelse på den. Så om namnet innuti kortet stämmer överense med person.name då tar den bort klassen hidden och visar upp kortet! Första saken foreach loopen gör är att lägga till hidden på alla så att inte något gammalt ska synas utan bara det senaste!
//          if (person) { 
//            input.value = "";
//            charCards.forEach((card) => {
//              card.classList.add("hidden");
//              const cardName = card.querySelector("p:first-child") as HTMLParagraphElement;
//              if (cardName.innerText === person.name) {
//                card.classList.remove("hidden");
//              }
//            });
//          }
//        });
//      });
//    }
// //   TESTA SENARE 
// //   const favoritKnapp = document.querySelector("#favoritKnapp") as HTMLButtonElement;
// //   favoritKnapp.onclick = function() {
// //       console.log("hej");
// //       const favorites = document.getElementById("favourites") as HTMLDivElement;
// //       if (lastClickedButton) {
// //           const copyButton = lastClickedButton.cloneNode(true) as HTMLButtonElement;
// //           copyButton.classList.remove("charButtons", "hidden");
// //           copyButton.classList.add("favCharacters");
// //           if (lastClickedButton.onclick) {
// //               copyButton.addEventListener("click", lastClickedButton.onclick);
// //           }
// //           favorites.appendChild(copyButton);
// //       }
// //   }
// //  ----------------------------------------------------------------------------------------------------------
