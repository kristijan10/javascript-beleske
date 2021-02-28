# Podizanje deklaracija

## Sta je starije, koka ili jaje?

Nekada pomisao da se kod u JavaScriptu kompajlira red po red, odozgo nadole, i nije tacna. Naime, razmotri sledeci primer:

```js
a = 2;
var a;
console.log(a); // 2;
```

> Masina nailazi na LHS referencu a, var a je nacin deklaracije, pa je to podignuto, sto znaci da moze da se doda vrednost 2 identifikatoru a

Mozda ce se isto desiti i sa ovim kodom?

```js
console.log(a); // undefined
var a = 2;
```

> Razlog zasto nije izpisan ReferenceError jeste taj sto se promenljiva podigla, ali ne i njena vrednost.<br>
> Promenljiva postoji, definisana je u programu, samo sto nije stigla masina da joj dodeli vrednost 2

Mozemo zakljuciti da je jaje starije od koke. Odnosno, prvo ide deklaracija pa onda dodeljivanje vrednosti.

## Kompajler uzvraca udarac

Prilikom kompajliranja prvo sto se dogadja jeste to da se obradjuju sve deklaracije - promenljivih i funkcija, a zatim se izvrsava ostatak koda.<br>
Kada masina naidje na iskaz _var a = 2;_, iako izgledao kao jedan iskaz, za JS su to dva: _var a_ i _a = 2;_.<br>
Prvi blok koda, pod naslovom _Sta je starije, koka ili jaje?_, moze se zamisliti:

```js
var a;
a = 2;
console.log(a); // 2
```

Dok se drugi moze zamisliti:

```js
var a;
console.log(a); // undefined
a = 2;
```

```js
foo();
function foo() {
  console.log(a); // undefined
  var a = 2;
}
```

> Funkcije se takodje podizu, sto omogucava da pozovemo izvrsavanje pre njene deklaracije.<br>
> Takodje se promenljive u opsegu vidljivosti funkcije foo, podizu.

```js
function foo() {
  var a;
  console.log(a); // undefined
  a = 2;
}
foo();
```

Deklaracije funkcije se podizu, dok funkcijski izrazi to ne cine.

```js
foo(); // TypeError
var foo = function bar() {
  // ...
};
```

> var foo se podigne na pocetak programa, pa pozivanje moze da se izvrsi, ali posto dodeljivanje vrednosti promenljivoj foo sledi posle pozivanje, a to se ne podize, vraca gresku
> masina ne dozvoljava da se izvrsi neka funkcija koja je undefined

## Prvo funkcije

```js
foo(); // 1
bar(); // TypeError; ja sam ovo dodao
var bar;
function foo() {
  console.log(1);
}
bar = function () {
  console.log(2);
};
```

Moze se zamisliti kao

```js
function foo(){..}
var bar;
foo();
bar(); // da se stavio poziv nakon dodeljivanja vrednosti, logovao bi vrednost 2; ja sam ovo dodao
bar = function(){..}
```

Deklaracija funkcije se podize pre deklaracije promenljivih<br>
Ukoliko imamo vise dupiranih funkcija istog imena, izvrsi ce se posljednje deklarisana

```js
foo(); // Dupliran
function foo() {
  console.log("Ja sam prvi");
}
function foo() {
  console.log("Dupliran");
}
```
