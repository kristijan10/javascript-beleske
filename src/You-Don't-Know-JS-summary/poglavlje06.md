# Opseg vidljivosti funkcije i bloka

## Opseg vidljivosti definisan funkcijom

Svaka funkcija pravi svoj mehur - opseg vidljivosti. Identifikatori deklarisani u funkciji se mogu koristiti u celom kodu te funkcije, a mogu ih nasladiti / videti i ugnjezdene funkcije nizeg nivoa.

## Skrivanje unutar opsega vidljivosti

Promenljive i funkcije se mogu sakriti ako ih obglimo viticastim zagradam - funkcijom, sto stvara novi blok vidljivosti.
Princip najmanje privilegije je nacin pisanja koda kojim ostavljamo javnim samo minimalan, neophodan deo koda, dok se sav ostali kod "sakriva".

Razlog skrivanja promenljivih i funkcija jeste kako se ne bi dogodila greska, namernim ili nenamernim putem, sto moze da dovede to promene krajnjeg proizvoda.

```js
function doSomething(a) {
  b = a + doSomethingElse(a * 2);
  console.log(b * 3);
}
function doSomethingElse(a) {
  return a - 1;
}
var b;
doSomething(2); // 15

// Sakriven kod. Problem gornjeg koda je taj sto su b i doSomethingElse bile izlozene globalnom opsegu vidljivosti, pa se mogu menjati

function doSomething(a) {
  function doSomethingElse(a) {
    return a - 1;
  }
  var b;
  b = a + doSomethingElse(a * 2);
  console.log(b * 3);
}
doSomething(2); // 15
```

### Izbegavanje sukoba

Druga korist skrivanja koda jeste izbegavanje problema zbog dva razlicita identifikatora sa istim imenom, a razlicitim namenama.

```js
function foo() {
  function bar(a) {
    i = 3; // menja identifikator i u for petlji, moze da se resi tako sto se napise var i = 3;
    console.log(a + i);
  }
  for (var i = 0; i < 10; i++) {
    bar(i * 2); // 3<10 => stvara se beskonacna petlja
  }
}
foo();
```

#### Globalni imenski prostor

_Imenski prostor_ (namespace) je naziv za biblioteke koje su napisane tako da u nas globalni opseg vidljivosti "umetnu" samo jedan objekat sa svim svojim funkcijama i identifikatorima, kako bi bili skriveni i da bi doslo do greske sa istim promenljivam.

```js
var myReallyCoolLibrary = {
  awesome: "stuff",
  doSomething: function () {
    // ...
  },
  doSomethingElse: function () {
    // ...
  },
};
```

#### Upravljanje modulima

Druga mogucnost za izbegavanje sukoba je _modularni pristup_, pomocu neke od alatki koje ne dozvoljavaju da se kod iz neke biblioteke ubacuju u globalni opseg vidljovsti, nego te alatke nekim mehanizmima uvoze kod u poseban opseg vidljivosti.

Resenje je pisati "defanzivan" kod i tako postignemo iste rezultate kao sto ta alatka i cini. Vise reci ce biti u poglavlju 8.

## Funkcije kao opsezi vidljivosti

Problem kod obmotavanja (skrivanja promenljivih) funkcijom jeste sto moramo da deklarise funkciju, sto "zagadjuje" spoljasni opseg vidljivosti, a problem je taj i sto moramo pozvati tu funkciju. Resenje toga su IIFE (Immediately Invoked Function Expression).

```js
(function foo() {
  var a = 2;
  console.log(a);
})(); // <- odmah se i poziva
```

Sada masina prilikom izvrsavanja ovaj blok koda tretira kao funkcijski izraz, ne deklaracija.
Ono sto je prednost funkcijsog izraza za razliku od samo definicije, pa pozivanja, je ta sto ime funkcije nije dostupno u spoljasnjem opsegu vidljivosti u kojem se nalazi. Poziv po imenu moze da radi samo iz bloka koda funkcije foo().

```js
(function foo() {
  var a = 2;
  console.log(a);
  foo(); // iako smo napravili infinitiv loop, ovde poziv radi
});
foo(); // ReferenceError: foo is not defined
```

### Anonimne i imenovane funkcije

```js
setTimeout(function () {
  // funkcija nema ime, anonimna je
  console.log("Sacekao sam 1 sekund");
}, 1000);
```

Nedostaci anonimnih funkcija:

1. Nemaju ime koje bi se prikazalo na stablu pozivanja funkcija, sto bi moglo da oteza otkrivanje gresaka
2. U slucaju da je potrebno pozvati rekurzijom, nema ime koje bi se referenciralo
3. Manjak citljivosti koda, jer nema ime koje bi opisivalo zasta je ta funkcija

Resenje tih nedostataka bilo bi dodati ime funkciji. Zadavanje imena funkcijom izrazu je preporucljivo.

```js
setTimeout(function timeoutHandler() {
  console.log("Sacekao sam 1 sekund");
}, 1000);
```

### Trenutno izvrsavanje funkcijskih izraza (IIFE)

```js
var a = 2;
(function foo() {
  var a = 3;
  console.log(a); // 3
})();
console.log(a); // 2
```

> Prvi par zagrada od funkcije pravi izraz, dok drugi izvrsava

Obicno se IIFE-ovima ne zadaju imena, ali zbog resenja nedostataka preporucljivo je zadati joj ime.

Jos jedna varijacija poivanja IIFE unkcijog izraza izgleda: (function foo(){...}());

Kako bi uporedili sa vec koristenim, i uobicajnim izrazom: (function foo(){...})();

IIFE-ima moze proslediti i neke reference iz spoljasnje opsega vidljivosti pomocu parametara:

```js
var b = 2;
(function foo(num) {
  var a = 3;
  console.log(a + num); // 5
})(b); // <- ovo je parametar
```

```js
(function iife(undefined) {
  var a;
  if (a === undefined) console.log("Ovde je bezbedan");
})(); // Ovde je bezbedan
```

> Ako funkciji definisemo kao parametar rezervisanu rec undefined, a ne proledimo joj nista, idenifikator undefuned je tip undefined u tom bloku koda

```js
var a = 2;
(function IIFE(def) {
  def(window);
})(function def(global) {
  var a = 3;
  console.log(a); // 3
  console.log(global.a); // 2
});
```

Izgleda opsirnije ali evo sta radi:
Definisemo funkcijski izraz imena IIFE, koji ima identifikator _def_ kao parametar. U bloku koda tog IIFE-a pozivamo parametar kao funkciju i dodeljujemo joj parametar _window_. Kao parametar prilikom izvrsavanja funkcije (u posledji par zagrada koji je odgovoran za izvrsavanje funkcijskog izraza) definisemo funkciju def, koja ima promenljive u sebi.

```js
var a = 2;

function IIFE(def) {
  def(window);
}

function def(global) {
  var a = 3;
  console.log(a);
  console.log(global.a);
}

IIFE(def);
```

## Blokovi kao opsezi vidljivosti

```js
for(var i = 0; i<10; i++){
  console.log(i);
)
```

> Cilj je da promenljive koje koristimo deklarisemo sto blize funkciji u kojoj cemo ih koristiti.
>
> Takav je slucaj i ovde, ali posto var predstavlja globalnu promenljivu, bilo gde da je deklarisemo, ona ce se pojaviti u globalnom opsegu vidljivosti

Ogranicavanje odredjenih promenljivih na blok omogucice nam da izbegnemo greske promene vrednosti odredjenih promenljivih u daljem kodu - otklanja mogucnost pojavljivanja greske.

### Struktura try / catch

```js
try {
  undefined();
} catch (err) {
  console.log(err); // TypeError: undefined is not a function
}
console.log(err); // ReferenceError: err is not defined
```

_catch_ ogranicava svoj kod na opseg vidljivosti bloka. Samo on moze da vidi err.

> Optimizatori koda se nekada bune ako koristimo vise try/catch struktura i kada parametrima damo isto ime err
>
> Iako je svaki catch ogranicen na blok, sto znaci da se nece dogoditi nikakva greska sa mesanjem promenljivih
>
> Ali kako bi to resili, samo dodaj broj greske (err1, err2)...

### Rezervisana rec let

_let_ je novina ubacena u ES6 verziju koja je omogucila da se deklarisu promenljive na opseg vidljivosti bloka.

```js
var foo = true;
if (foo) {
  let bar = foo * 2;
  bar = something(bar);
  console.log(bar);
}
console.log(bar); // ReferenceError: bar is not defined
```

Ne postoje sve dok se ne deklarisu, ne dizu se promenljive na vrh opsega kao sto se to radi sa _var_ promenljivima

```js
console.log(a); // ReferenceError
let a = 2;
```

#### Sakupljanje smeca

```js
function process(data){
  // radi nesto zanimljivo
}

// Sve sto je deklarisano u ovom eksplicitnom bloku koda
// moze da se oslobodi iza njega
{
  let reallyBigData = {..}
  process(reallyBigData);
}
var btn=document.getElementById('my_btn');
btn.addEventListener('click', function click(evt){
  console.log("pritisnuo je dugme");
}, /*capturingPhase=*/false);
```

> Kada se izvrsi funkcija process, _sakupljac smeca_ (gabage collection) moze da oslobodi tu strukturu podataka koja zauzima mnogo memorije

#### Deklarisanje let u petljama

```js
for (let i = 0; i < 10; i++) {
  console.log(i);
}
console.log(i); // ReferenceError
```

```js
var foo = true,
  baz = 10;
if (foo) {
  let bar = 3;

  if (baz > bar) {
    console.log(baz);
  }
}
console.log(bar, baz); // ReferenceError: bar is not defined
```

### Rezervisana rec const

_const_, kao i let definise promenljivu u opsegu vidljivosti bloka, jedino po cemu se razlikuju je to sto promenljive definisane sa const ne mogu menjati svoju vrednost.

```js
var foo = true;
if (foo) {
  var a = 2;
  const b = 3;

  a = 3; // okej
  b = 4; // ne moze!
}
console.log(a); // 3
console.log(b); // ReferenceError
```

## Sazetak poglavlja

Promenljive i funkcije koje deklarisem unutar druge funkcije skrivene su za sve spoljasnje opsege vidljivosti, sto je nameran cilj principa dobrog dizajna softvera.

Opseg vidljivosti velicine bloka odrazava ideju da promenljive i funkcije mogu pripadati i proizvodljo odredjenom bloku koda (obicno oivicen parom {} zagrada).
