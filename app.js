
/* paramètres */
var niveau = 4;
var paramValue;
var lancementChrono;
var timerChrono;
var delaiTime;
var alerteTimer;
var chrono;
let numberOfTries = 0;

const timer = document.querySelector(".timer")
const conseil = document.querySelector(".conseil");

var randomChoiceImage = [];

var valeurCookieBestScoreAdulte = cookieBestScoreExists("cookieBestScoreAdulte")
var valeurCookiePrenomBestScoreAdulte = cookieBestScoreExists("cookiePrenomBestScoreAdulte")
var valeurCookieChronoBestScoreAdulte = cookieBestScoreExists("cookieChronoBestScoreAdulte")


var valeurCookieBestScoreEnfant = cookieBestScoreExists("cookieBestScoreEnfant")
var valeurCookiePrenomBestScoreEnfant = cookieBestScoreExists("cookiePrenomBestScoreEnfant")
var valeurCookieChronoBestScoreEnfant = cookieBestScoreExists("cookieChronoBestScoreEnfant")

const listeImages = [
  { nomImage: 'affiche_festival.jpg', nomAttribut: 'affiche_festival' },
  { nomImage: 'chevreuil.jpg', nomAttribut: 'chevreuil' },
  { nomImage: 'chamois.jpg', nomAttribut: 'chamois' },
  { nomImage: 'ecureuil.jpg', nomAttribut: 'ecureuil' },
  { nomImage: 'lynx.jpg', nomAttribut: 'lynx' },
  { nomImage: 'renardeaux.jpg', nomAttribut: 'renardeaux' },
  { nomImage: 'martin_pecheur.jpg', nomAttribut: 'martin_pecheur' },
  { nomImage: 'mesange-bleue.jpg', nomAttribut: 'mesange-bleue' }
];

const btnNiveau = document.querySelectorAll('.btnNiveau');

/*------------------------------------------------*/

document.addEventListener('DOMContentLoaded', function () {

  const containerBestScore = document.getElementById("containerBestScore")
  containerBestScore.style.display ="none"

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  paramValue = urlParams.get('niveau');

  if(paramValue == null) {
    //niveau = paramValue;
    btnNiveau[1].style.backgroundColor="orange"
    document.getElementById("rappelBestScore").style.display ="none";
  }

  if(paramValue == 8) {
    niveau = paramValue;
    containerBestScore.style.display ="flex";
    document.getElementById("valueBestScore").textContent = valeurCookieBestScoreAdulte;
    document.getElementById("prenomBestScore").textContent = valeurCookiePrenomBestScoreAdulte;
    document.getElementById("chronoBestScore").textContent = valeurCookieChronoBestScoreAdulte;
    document.getElementById("bravoBestScore").style.visibility = "hidden";
    delaiTime = 60;
    alerteTimer = 15;
    timer.textContent = `Timer : ${delaiTime} sec`
    btnNiveau[3].style.backgroundColor="orange"
  }
  else if(paramValue == 6) {
    niveau = paramValue;
    containerBestScore.style.display ="flex";
    document.getElementById("valueBestScore").textContent = valeurCookieBestScoreEnfant;
    document.getElementById("prenomBestScore").textContent = valeurCookiePrenomBestScoreEnfant;
    document.getElementById("chronoBestScore").textContent = valeurCookieChronoBestScoreEnfant;
    document.getElementById("bravoBestScore").style.visibility = "hidden";
    delaiTime = 45;
    alerteTimer = 10;
    timer.textContent = `Timer : ${delaiTime} sec`
    btnNiveau[2].style.backgroundColor="orange"
  }
  else if(paramValue == 4) {
    niveau = paramValue;
    containerBestScore.style.display ="none";
    document.getElementById("rappelBestScore").style.display ="none";
    delaiTime = 20;
    alerteTimer = 8;
    timer.textContent = `Timer : ${delaiTime} sec`
    btnNiveau[1].style.backgroundColor="orange"
  }
  else if(paramValue == 2){
    niveau = paramValue;
    containerBestScore.style.display ="none";
    document.getElementById("rappelBestScore").style.display ="none";
    delaiTime = 10;
    alerteTimer = 4;
    timer.textContent = `Timer : ${delaiTime} sec`
    btnNiveau[0].style.backgroundColor="orange"
  }

  const uniqueRandomDigits = generateUniqueRandomDigitsArray();

  const nbPaire = uniqueRandomDigits.length
  const repertoireImage ="ressources/img"
  const containerGrid = document.querySelector(".grid")

  for(i=0;i<nbPaire; i++) {

    var numImage = uniqueRandomDigits[i]

    var nomImage = (listeImages[numImage].nomImage)
    var nomAttribut = (listeImages[numImage].nomAttribut)

    for(c=0; c<=1; c++) {


      let card = document.createElement('div');
      card.className = 'card';
      card.setAttribute('data-attr', nomAttribut);

      let doubleFace = document.createElement('div');
      doubleFace.className = 'double-face';

      let face = document.createElement('div');
      face.className = 'face';

      let imgFace = document.createElement('img');
      imgFace.src = repertoireImage + '/' + nomImage;
      imgFace.alt = nomAttribut;

      let back = document.createElement('div');
      back.className = 'back';

      let imgBack = document.createElement('img');
      imgBack.src = repertoireImage + '/arriere_carte.png';

      // Ajouter les images aux conteneurs
      face.appendChild(imgFace);
      back.appendChild(imgBack);

      // Ajouter les conteneurs à doubleFace
      doubleFace.appendChild(face);
      doubleFace.appendChild(back);

      // Ajouter doubleFace à la carte
      card.appendChild(doubleFace);

      // Ajouter la carte au body
      containerGrid.appendChild(card);
    }
  }

  const cards = document.querySelectorAll(".card")

  function shuffleCards(){
    cards.forEach(card => {
      const randomPos = Math.trunc(Math.random() * 8)
      card.style.order = randomPos;
    })
  }
  shuffleCards()

  timerChrono = delaiTime; //instanciation du chrono,
  let firstCard = false; // repère pour activer le chrono

  cards.forEach(card => card.addEventListener("click", flipACard))

  let lockedCards = false;
  let cardsPicked = []
  function flipACard(e){

      // on finit la partie si le chrono a été atteint
    if(timerChrono <= 0) {
      const cards = document.querySelectorAll(".card")
      cards.forEach(card => card.removeEventListener("click", flipACard, true))
      return;
    }

    // lanement du timer
    if (firstCard == false) {
      lancementChrono = window.setInterval(executionTimer, 1000);
      firstCard = true;
    } 

    if(lockedCards) return;
  
    saveCard(e.target.children[0], e.target.getAttribute("data-attr"))

    if(cardsPicked.length === 2) result()
  }

  function saveCard(el, value) {
    if(el === cardsPicked[0]?.el) return;

    el.classList.add("active");
    cardsPicked.push({el,value})
  }

  function result(){
    saveNumberOftries()

    if(cardsPicked[0].value === cardsPicked[1].value){
      cardsPicked[0].el.parentElement.removeEventListener("click", flipACard)
      cardsPicked[1].el.parentElement.removeEventListener("click", flipACard)
      cardsPicked = [];
      return;
    }

    lockedCards = true;
    setTimeout(() => {
      cardsPicked[0].el.classList.remove("active");
      cardsPicked[1].el.classList.remove("active");
      cardsPicked = [];
      lockedCards = false;
    }, 700) // delai avant que les cartes se retournent
  }

  const innerCards = [...document.querySelectorAll(".double-face")];
  const score = document.querySelector(".score")

  function saveNumberOftries(){
    numberOfTries++;
    const checkForEnd = innerCards.filter(card => !card.classList.contains("active"))
    if(!checkForEnd.length) {

      window.clearTimeout(lancementChrono); // on arrête le chronomètre

      if(paramValue == 8 && numberOfTries < parseInt(valeurCookieBestScoreAdulte)) {

        chrono =  delaiTime - timerChrono

        if(chrono < parseInt(valeurCookieChronoBestScoreAdulte)) {
        document.getElementById("bravoBestScore").style.visibility = "visible"
        }
      }
      else if (paramValue == 6 && numberOfTries < parseInt(valeurCookieBestScoreEnfant)) {

        chrono =  delaiTime - timerChrono

        if(chrono < parseInt(valeurCookieChronoBestScoreEnfant)) {
        document.getElementById("bravoBestScore").style.visibility = "visible"
        }
      }

      formBestScore = document.getElementById("formBestScore")
      formBestScore.addEventListener("submit", function(e) {
          e.preventDefault();
          validationChampsBestScores();
          document.getElementById("valueBestScore").textContent = numberOfTries
      });

      conseil.textContent = `Bravo ! Appuyez sur "espace" pour relancer une partie.`
      score.textContent = `Votre score final : ${numberOfTries}`
      return;
    }
    score.textContent = `Nombre de coups : ${numberOfTries}`
  }

  window.addEventListener("keydown", handleRestart)

  let shuffleLock = false;
  function handleRestart(e) {
    //e.preventDefault()
    if(e.keyCode === 32) {
      innerCards.forEach(card => card.classList.remove("active"))

      document.getElementById("bravoBestScore").style.visibility = "hidden";

      conseil.textContent = `Tentez de gagner avec le moins d'essais possible.`
      score.textContent = `Nombre de coups : 0`
      
      window.clearTimeout(lancementChrono);
      timerChrono = delaiTime;
      firstCard = false;

      cardsPicked = [];

      timer.textContent = `Timer : ${delaiTime} sec`
      numberOfTries = 0;
      conseil.style.color= ""
      timer.style.color= ""

      cards.forEach(card => card.addEventListener("click", flipACard))

      if(shuffleLock) return;
      shuffleLock = true;
      setTimeout(() => {
        shuffleCards()
        shuffleLock = false;
      }, 600)
    }
  }
})

document.getElementById("btnNouvellePartie").addEventListener("click", ()=>
{
  var parametres = {
    'nbPaire': niveau,
  };

  var url = document.location.pathname; 

  document.location.href = url +"?niveau=" + niveau

})

document.getElementById("btnDebutant").addEventListener("click", ()=>
  {
    var url = document.location.pathname; 
    document.location.href = url +"?niveau=" + 2
  }
)

document.getElementById("btnFacile").addEventListener("click", ()=>
  {
    var url = document.location.pathname; 
    document.location.href = url +"?niveau=" + 4
  }
)

document.getElementById("btnMoyen").addEventListener("click", ()=>
  {
    var url = document.location.pathname; 
    document.location.href = url +"?niveau=" + 6
  }
)

document.getElementById("btnDifficile").addEventListener("click", ()=>
  {
    var url = document.location.pathname; 
    document.location.href = url +"?niveau=" + 8
  }
)

// génération des valeurs aléatoires de cartes

function generateRandomDigit() {

const nbImage = listeImages.length

  return Math.floor(Math.random() * nbImage);
}

// Générer un tableau de 4 chiffres uniques aléatoires entre 0 et 5
function generateUniqueRandomDigitsArray() {
  const uniqueRandomDigits = new Set();

  // l'instanciation set ci-dessus permet d'éviter les doublons
  while (uniqueRandomDigits.size < niveau) {
      uniqueRandomDigits.add(generateRandomDigit());
  }
  return Array.from(uniqueRandomDigits);
}

function cookieBestScoreExists(cookieName) {

  // Vérifie si le nom du cookie est présent dans la chaîne
  // Si l'index est -1, cela signifie que le cookie n'existe pas
      var tablecookie = document.cookie.split(';');
      var nomcookie = cookieName + "=";
      var valeurcookie = "";
      for (i=0;i<tablecookie.length;i++){
              if(tablecookie[i].indexOf(nomcookie) != -1){
                  valeurcookie = tablecookie[i].substring(nomcookie.length + tablecookie[i].indexOf(nomcookie), tablecookie[i].length);
                  return valeurcookie;
              }
      }
      return "999";
  }

// création du cookie BestScore
function setCookie(name, value, days) {
  // Définit la date d'expiration du cookie
  let expires = "";
  if (days) {
      let date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
  }

  value = encodeURIComponent(value);

  // Crée le cookie en ajoutant le nom, la valeur et la date d'expiration
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function validationChampsBestScores() {

  var inputPrenom = document.getElementById("inputPrenom").value
  //var inputEmail = document.getElementById("inputEmail").value

  if(paramValue == 6 ) {
    setCookie('cookiePrenomBestScoreEnfant', inputPrenom, 7);
    //setCookie('cookieEmailBestScoreEnfant', inputEmail, 7);
    setCookie('cookieChronoBestScoreEnfant', chrono, 7);
    setCookie('cookieBestScoreEnfant', numberOfTries, 7);
  }
  else if(paramValue == 8 )  {
    setCookie('cookiePrenomBestScoreAdulte', inputPrenom, 7);
    //setCookie('cookieEmailBestScoreAdulte', inputEmail, 7);
    setCookie('cookieChronoBestScoreAdulte', chrono, 7);
    setCookie('cookieBestScoreAdulte', numberOfTries, 7);
  }

  document.getElementById("prenomBestScore").textContent = inputPrenom
  document.getElementById("chronoBestScore").textContent = chrono

  inputPrenom ="";
  inputEmail = "";

  document.getElementById("bravoBestScore").style.visibility = "hidden";


}

function executionTimer() {

  timerChrono --;
  timer.textContent = `Timer : ${timerChrono} sec`

  if(timerChrono <= alerteTimer)
    timer.style.color="orange"

  if(timerChrono <= 0) {
    timer.textContent = `Temps écoulé`
    timer.style.color="red"
    conseil.textContent = `Perdu ! Appuyez sur "espace" pour relancer une partie.`
    conseil.style.color="red"
  }
 
}




