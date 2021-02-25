# Opseg vidljivosti funkcije i bloka

## Opseg vidljivosti definisan funkcijom

Svaka funkcija pravi svoj mehur - opseg vidljivosti. Identifikatori deklarisani u funkciji se mogu koristiti u celom kodu te funkcije, a mogu ih nasladiti / videti i ugnjezdene funkcije nizeg nivoa.

## Skrivanje unutar opsega vidljivosti

Promenljive i funkcije se mogu sakriti ako ih obglimo viticastim zagradam - funkcijom, sto stvara novi blok vidljivosti.
Princip najmanje privilegije je nacin pisanja koda kojim ostavljamo javnim samo minimalan, neophodan deo koda, dok se sav ostali kod "sakriva".<br>
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

Druga mogucnost za izbegavanje sukoba je _modularni pristup_, pomocu neke od alatki koje ne dozvoljavaju da se kod iz neke biblioteke ubacuju u globalni opseg vidljovsti, nego te alatke nekim mehanizmima uvoze kod u poseban opseg vidljivosti. <br>
Resenje je pisati "defanzivan" kod i tako postignemo iste rezultate kao sto ta alatka i cini. Vise reci ce biti u poglavlju 8.
