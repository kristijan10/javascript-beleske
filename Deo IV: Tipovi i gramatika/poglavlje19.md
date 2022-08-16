# Gramatika

Gramatika JS-a je struktuisan nacin opisivanja kako se elementi sintakse medjusovno uklapaju u pravilno formatirane i ispravne programe.

## Iskazi i izrazi

Izraz moze biti iskaz, ali obrnuto ne moze.

Prost primer da bi razlikovao:

3\*5 - izraz

var a = 3\*5; - iskaz (deklaracioni; 3\*5 je izraz)

var b = a; - iskaz (a je ovde izraz)

### Zavrsne vrednosti iskaza

Prilikom izvrsavanja iskaza u konzoli citaca veba bice vracena neka vrendnost.

```js
var a = 42;
// undefined
```

Taj undefined koji se vraca je povratna vrednost koja se vraca iz algoritma koji se koristi za "postavljanje" te promenljive.

> Taj algoritam ustvari vraca znakovni niz s imenom deklarisane vrednosti

Zavrsna vrednost svakog standardnom bloka { .. } je vrednost poslednjeg iskaza/izraza koji taj blok sadrzi.

```js
var b;

if (true) b = 42;
// 42
```

Konzola ce ispisati vracenu vrednost - 42.

~~Pomisao je da se ta vrednost moze zadati nekoj drugoj promenljivoj.~~

```js
var a, b

a = if(true) b = 42; // ovaj izraz ce u konzoli ispisati 42, ali je nece dodeliti kao vrednost

// ISPRAVLJENO JE, SADA PRIJAVLJUJE SINTAKSNU GRESKU!!!!!!!!
```

### Sporedni efekti izraza

Uglavnom prilikom deklarisanja promenljivih izrazi nemaju nekih sporednih efekata.

```js
var a = 42;
var b = a + 3;
```

Ali se ti sporedni efekti pocnu pojavljivati ako ih ne koristimo kako treba prilikom pozivanja funkcija.

```js
function foo() {
 a = a + 1;
}

var a = 2;
foo(); // undefined, sporedni efekat promenjeno a (3)
```

Medjutim, postoje i drugi izrazi sa sporednim efektima:

```js
var a = 42;
var b = a++; // 42, sporedan efekat promenjeno a (43)
```

Unarni operatori ++ i -- se mogu zadati na **postfiksnom (iza)** ili na **prefiksnom (ispred)** polozaju.

```js
a++; // 42
a; // 43

++a; // 44
a; // 44
```

Kada se ++ zada na prefiksnom (++a) polozaju njegov sporedni efekat (inkrementiranje) se izvrsava pre nego sto se vrednost vrati iz izraza. U slucaju kada je ++ na postfiksnom (a++) polozaju tada se prvo vraca vrednost u izraz pa se izvrsava inkrementacija.

Postoji i mogucnost nadovezivanja vise iskaza u jedan:

```js
var a = 42;
var b = (a++, a);

a; // 43
b; // 43
```

### Kontekstno zavisna pravila

#### Viticaste zagrade

Objektni literal:

```js
var a = {
 foo: bar(),
};
```

Ovo je objektni literal zato sto je par {..} vrednost koja se dodeljuje promenljivoj a.

#### Oznaceni iskazi

Ako uklonim levi deo iskaza _var a =_ dobijam obican blok koda:

```js
{
 foo: bar();
}
```

Posto JS nema goto komandu, umesto nje se moze koristiti _continue/break_.

```js
foo: for (var i = 0; i < 4; i++)
 for (var j = 0; j < 4; j++) {
  // prelazimo u sledecu iteraciju
  if (j == i) continue foo;

  // preskace neparne proizvode
  if ((j * i) % 2 == 1) continue;

  console.log(i, j);
 }

// 1 0
// 2 0
// 2 1
// 3 0
// 3 2
```

_break_ za razliku od _continue_ izlazi iz cele petlje i nastavlja da izvrsava dalji kod.

```js
foo: for (var i = 0; i < 4; i++)
 for (var j = 0; j < 4; j++) {
  if (i * j <= 3) {
   console.log("Prekidam", i, j);
   break foo;
  }
  console.log(i, j);
 }

// 0 0
// 0 1
// 0 2
// 0 3
// 1 0
// 1 1
// 1 2
// Prekidam 1 3
```

Ako koristis neke skokove (za sta bi oni bili korisni je da pronadjes vrednost neke promenljive na drugom mestu) dokumentuj veoma dobro jer ces i ti zaboraviti a i drugi koji budu radili na tvom kodu ce biti zbunjeni.

#### Blokovi

```js
[] + {}; // [object Object]
{
}
+[]; // 0
```

Implicitna konverzija u prvom izrazu na operand s leve strane pretvara u "" (prazan string) pa se zato i {} objekat pretvara u string sto daje [object Object].

U drugom izrazu JS masina vidi da ima objekat s leve strane (prazan blok koda) pa [] pretvara u broj - 0.

#### Destrukturiranje objekata

```js
function getData() {
 // ...
 // ...
 return {
  a: 42,
  b: "foo",
 };
}

var { a, b } = getData();

console.log(a, b); // 42 "foo"
```

Destruktuiranje objekata pomocu para {..} se moze iskoristiti i za zadavanje vrednosti imenovanim argumentima funkcije.

```js
function foo({a, b, c}){
   // nema potrebe za ovim oblikom
   // var a = obj.a, b = obj.b, c = obj.c;

   console.log(a, b, c);
}

foo({
   b: "foo"
   c: [1, 2, 3],
   a: 42,
});

// 42 "foo" [1, 2, 3]
```

#### Blokovi else if i opcioni blokovi

Ne postoji else if iskaz kao takav. Ono se ustvari tretira kao:

```js
if (a) doSomething();
else {
 if (b) doSomethingDifferent();
 else doThird();
}

// skraceno:
if (a) doSomething();
else if (b) doSomethingDifferent();
else doThird();
```

Skrivena karakteristika JS-a kaze da ako u bloku iza if ili else ima samo jedan iskaz, moze se izostaviti par viticastih zagrada. Po ovom principu je dodata else if grana...

## Prioritet operatora

Ukratko, svaki jezik ima neki prioritet kojim se odredjuje koji operator ima prednost kada je u pitanju chain-ovanje operatora.

MDN ima listu na kojoj je tabela svih operatora i JS-ov prioritet nad njima.

### Kratko spajanje operatora

Odredjeni operatori poseduju "kratkospojnu" mogucnost.

Primer mogu biti operatori && i ||. Ako je operand s leve strane dovoljan da se odredi ishod cele operacije, onda se izracunavanje desnog operanda preskace i tu se zavrsava operacija.

To se dosta koristi u ispitivanju uslova:

```js
if (opts && opts.cool) {
 /*..*/
}
// ako postoji objekat opts proverava da li postoji i njegovo svojstvo cool, u suprotnom (ako ne postoji objekat) prekida se ispitivanje i izlazi iz uslova

if (opts.cache || primeCache()) {
 /*..*/
}
// ako postoji metoda cache u objektu opts, on se primenjuje, u suprotnom poziva se f-ja primeCache
```

### Jace vezivanje operatora

&& i || "jace vezuju" za razliku od ? : (ternarnog operatora).

```js
a && b || c ? c || b ? a : c && b : a
// to je slicno
((a && b) || c) ? ((c || b) ? a : (c && b)) : a
```

### Asocijativnost

Asocijativnost je nacin na koji JS masina gleda ko od operatora ima prednost u izracunavanju kada se nadoveze vise operatora.

```js
a ? b : c ? d : e;
// masina bi to podelila na sledeci nacin:
a ? b : (c ? d : e);

a && b && c;
// masina bi to podelila na sledeci nacin:
(a && b) && c;

// operacija dodeljivanja vrednosti ima desnu asocijativnost bas kao i ternarni operator
var a, b, c;
a = b = c = 42;
a = (b = (c = 42));
```

### Otklanjanje nedoumica

Da skratim pricu, rucnu (eksplicitnu) asocijativnost koristi tamo gde ce ona doprineti do lakseg razumevanja koda, a implicitnu asocijativnost postavljaj kako bi smanjio i "ocistio" kod.

## Automatsko umetanje znaka ';'

ASI (Automatic Semicolon Insertation) odvija se kada JS podrazumeva znak **;** na nekim mestima u kodu uprkost tome sto ga nisam tamo izricito stavio.

Znak **;** i **,** umece samo tamo gde vidi da je kraj reda i da ima belina (prelazak u sledeci red), nikada to ne radi u sred reda.

Znak **;** se ocekuje nakon do..while bloka, sto vecina ne stavlja, pa zato ASI preuzima ulogu i dodaje je na kraj bloka. If i while blokovi ga ne zahtevaju, pa tu ne dodaje.

A sto se tice rez. reci _break, return, continue i yield(ES6)_ ako nisi naglasio da li se nesto vraca (tako sto stavis ili u zagradu, ako se radi o vise stvari, ili samu vrednost nakon rez. reci ASI algoritam ce shvatiti to kao samo nacin da izadjes iz petlje pa ce staviti **;** na kraj (to samo ako nakon rez. reci ima belina - prelazak u sledeci red)).

```js
function foo(a){
   if(!a) return
   a *= 2;
}

// ovo bi ASI algoritam video:
function foo(a){
   if(!a) return;
   a *= 2;
}

// a ako bas taj izraz zelis da vratis, moras naglasiti
function foo(a){
   if(!a) return a *= 2;
}
```

### Ispravljanje gresaka

Neki JS programeri misle da je pisanje ; obavezno i da se ne treba oslanjati na ASI, dok oni drugi misle da treba da pistu kod bez ; pa da ga ASI stavi tamo gde prevodilac pokaze kao sintaksnu gresku.

Autorovo misljenje je da znak **;** treba stavljati svuda, jer on nicemu ne skodi, a tebi (i drugim koji budu radili s tvojim kodo) opet pomaze da shvatis gde se zavrsava dati izraz.

## Greske

Osim do sada pomenutih gresaka (TypeError, ReferenceError, SyntaxError...) postoje i greske koje se otkrivaju u toku kompajliranja koda.

```js
var a = /+foo/; // SyntaxError

var b;
42 = b; // SyntaxError

function foo(a, b, a){/*..*/} // ispravno
function foo(a, b, a){"use strict"} // SytaxError
```

### Prerana upotreba promenljivih

Zona nazvana TDZ (Temporal Dead Zone) je zona u kojoj promenljiva jos uvek nije deklarisana a i ne moze se pristupiti.

```js
a = 2;
let a; // greska
```

Pomocu operatora _typeof_ mogu da proverim da li promenljiva postoji ili je samo koristim u TDZ-u.

```js
typeof a; // undefined (nema je deklarisane)
typeof b; // ReferenceError (TDZ)
let b;
```
