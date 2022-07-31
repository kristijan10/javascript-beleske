# Konverzija (engl. coersion)

Iako konverzija iz jednog u drugi tip izgleda kao zamka ili greska u jeziku, ono sto ne razumemo valja nauciti, pa tek onda kritikovati.

## Konverzija vrednost

Konverzija iz jednog u drugi tip se naziva **pretvaranje tipa** dok je **konverzija** kada se radi implicitno konvertovanje.

Autor se vodi mislju i pravi razliku samo izmedju "eksplicitne" i "implicitne" konverzije tipa.

## Apstraktne operacije s vrednostima

Pre istrazivanja o razlici sta se to desava prilikom implicitne/eksplicitne konverzije, moramo videti kako to vrednosti postaju tipa _number, string ili boolean_.

### Operacija toString

Kada operaciju _toString_ pozivam nad obicnim objektom, ako ona nije redefinisana u lokalnom opsegu tog objekta, ona vraca interno svojstvo [[Class]] svojstva objekta, a to je obicno "[object Object]"

Nizovi imaju redefinisanu metodu _toString()_ koja vraca string ciji je sadrzaj sadrzaj tog niza odvojen , (zarezima):

```js
var a = [1, 2, 3];

a.toString(); // "1,2,3"
```

#### Pretvaranje u JSON znakovne nizove

Metoda _JSON.stringify(..)_ serijalizuje odredjenu vrednost u znakovni oblik u JSON formatu.

>Ne smatra se isto kao konverzija!

Za proste vrednosti, rezultat pretvaranja u JSON format je isto kao i konverzija pomocu metode _toString()_.

```js
JSON.stringify(42); // "42"
JSON.stringify("42"); // ""42""
JSON.stringify(null); // "null"
JSON.stringify(true); // "true"
```

JSON bezbedne vrednosti se mogu koristiti kao argumenti metode _JSON.stringify(..)_.

>JSON bezbedne vrednosti su sve osim _function, undefined, symbol i objekata koji sadrze cirkularnu referencu (gde referenciranje svojstva u strukturi jednog objekta formira neprekidan ciklus s jednog svojstva na drugo)_
>
>Te vrednosti su neprihvatljive JSON-u iz razloga sto nisu prenosive u druge jezike koji rade s JSON vrednostima

Kada JSON naidje na nebezbedne vrednosti on ih zanemaruje, a ako koristim metodu _stringify()_ nad slozenom vrednoscu (objekat ili niz) JSON ce sva ponavljanja tipova _undefined, function i symbol_ zameniti s _null_:

```js
JSON.stringify(undefined); // undefined
JSON.stringify(function f(){}); // undefined

JSON.stringify([1, undefined, function(){}, 4]); // "[1, null, null, 4]"
JSON.stringify({a: 2, b:function(){}}); // "{"a": 2}"
```

Ako pomocu _JSON.stringify(..)_ metode pokusam da pretvorim u JSON format objekat s cirkularnim vrednostima, masina izbacuje gresku.

Ako zelim da objekat koji sadrzi neprihvatljive JSON vrednosti pretvorim u JSON format, onda treba da definisem metodu _toJSON()_ koja vraca JSON bezbednu verziju objekta.

```js
var o = {};

var a = {
  b: 42,
  c: o,
  d: function(){}
}

o.e = a; // pravi cirkularnu referencu unutar 'a'

// Pozivanjem metode sada bi prouzrokovalo gresku
// JSON.stringify(a);

// definisem namenski nacin JSON serijalizovanja vrednosti
a.toJSON = function(){
  // serijalizuje se samo svojstvo 'b'
  return {b: this.b}
}

JSON.stringify(a); // "{"b":42}"
```

Namenska metoda _toJSON()_ je napravljena kao pomocna metoda koja bi omogucila da i ako imamo neprihvatljive vrednosti u objektu, opet mogu da pretvorim u JSON format ono sto se moze pretvoriti.

Treba je zamisliti kao "pretvara u JSON bezbednu vrednost koja je pogodna za dalje pretvaranje u JSON format".

```js
var a = {
  var: [1,2,3],

  // verovatno ispravno jer vraca
  // vrednost podtipa array
  toJSON: function(){
    return this.val.slice(1);
  }
}

var b = {
  val: [1,2,3],

  // verovatno neispravno posto vec vraca
  // vrednost tipa string
  toJSON: function(){
    return "[" + this.val.slice(1).join() + "]";
  }
}

JSON.stringify(a); // "[2, 3]"
JSON.stringify(b); // ""[2, 3]""
```

_JSON.stringify(..)_ metoda prima i drugi, opcioni, argument koji se jos naziva i zamena (engl. replacer). Taj argument moze biti niz ili funkcija, a svrha mu je da filtrira koja se svojstva ukljucuju u proces pretvaranja u JSON format.

U slucaju ako je drugi argument niz, on mora sadrzati vrednosti tipa string, a koje predstavljaju imena svojstava objekta koji pokusavamo da pretvorimo u JSON oblik. Ime svojstva koje nije navedeno u tom drugom argumentu se izostavlja iz prebacivanja.

Ako je zadata funckija, ona se poziva jednom za zadat objekat, a i jednom za svako svojstvo tog objekta. Funkciji prilikom poziva nad svojstvima se prosledjuju dva armuneta: _kljuc_ i _vrednost_. Da bi se iz procesa izostavio odredjeni _kljuc_ funkcija za njegovu vrednost treba da vrati _undefined_.

```js
var a = {
  b: 42,
  c: "42",
  d: [1,2,3]
}

JSON.stringify(a, ["b", "c"]); // "{"b":42,"c":"42"}"
JSON.stringify(a, function(k, v){
  if(k !== "c") return v;
}); // "{"b":42,"d":[1,2,3]}"
```

Metoda _JSON.stringify(..)_ ima i treci opcioni argument, koji predstavlja sta ce biti umetnuto umesto razmaka (kako bi format bio citljiviji):

```js
var a = {
  b: 42,
  c: "42",
  d: [1,2,3]
}

JSON.stringify(a, null, 3);
/*
//"{
//   "b": 42,
//   "c": "42",
//   "d": [
//      1,
//      2,
//      3
//   ]
//}"
*/

JSON.stringify(a, null, "-----");
/*
//"{
//-----"b": 42,
//-----"c": "42",
//-----"d": [
//----------1,
//----------1,
//----------1,
//-----]
//}"
*/
```

Vrednosti tipa _number, boolean, string i null_ pretvaraju se u JSON format kao kada bi iskoristio _toString()_ metodu.

Dok, ako _JSON.stringify(..)_ metodi prosledim vrendnost tipa _object_, a taj objekat ima definisanu metodu _toJSON()_, ta metoda se poziva automatski zbog "konverzije" tipa te vrednosti u JSON bezbedan oblik pre pretvaranja u JSON znakovni oblik.

### Operacija toNumber

Ako konverzija tipa _string_ u tip _number_ nije izvodljiva, operacija ce vratitit _NaN_ vrednost.

Ako koristim neku vrednost koja nije broj uz matematicku operaciju, masina ce tu vrednost pretvoriti u numbericku alternativu.

>true postaje 1; false postaje 0; undefined postaje NaN; null (neobjasnjivo) postaje 0

Ako pokusavam da konvertujem slozen tip vrednosti (objekat/array) _toNumber_ metoda ce potraziti da li u internom opsegu tog objekta ima definisana metoda _toString()_ ili _valueOf()_.

```js
var a = {
  valueOf: function(){
    return "42";
  }
}

var b = {
  toString: function(){
    return "42";
  }
}

var c = [4, 2];
c.toString = function(){
  return this.join(""); // "42"
}

Number(a); // 42
Number(b); // 42
Number(c); // 42
Number(""); // 0
Number("42"); // 42
Number("3e"); // NaN
Number([]); // 0
Number(["abc"]); // NaN
Number(undefined); // NaN
```

### Operacija toBoolean

Cesto pogresno misljenje vlada medju programerima da su numericke vrednosti _1_ i _0_ jednake vrednostima _true_ i _false_. Numericke vrednosti su numericke vrednosti, a logicke su logickke vrednosti. Ako bi se izvrsila konverzija tada bi _1_ mogao da postane _true_ (i obrnuto; a tako i za _0_ i _false_).

#### Vrednosti koje se ponasaju kao false

Prilikom konverzije tipova u boolean tip moze se suziti na:

1) tipovi koji se pretvaraju u _false_
2) svi ostali, odnosno, oni koji se pretvaraju u _true_

Vrednosti koje se pretvaraju u _false_:

- undefined
- null
- false
- +0, -0, NaN
- ""

Sve ostale vrednosti koje postoje u JS-u se smatraju kao _true_.

#### Objekti koji se ponasaju kao false

Jedan primer koji je autor naveo je objekat _document.all_. Taj objekat je isti kao i svi drugi objketi u JS-u. Smatra se zastarelim ali autor nije naveo zbog cega je odluceno da se taj obican objekat prikazuje kao _false_.

```js
if(document.all) console.log("prosao sam");
else console.log("nisam prosao");

// "nisam prosao"
```

#### Vrednosti koje se ponasaju kao true

Da skratim, sve sto se NE nalazi na listi vrednosti koje se konverzijom u _boolean_ smatraju kao _false_, ponasa se kao _true_. Ta lista je prilicno dugacka, zato se ne treba ni truditi pisati je, vec je mnogo mudrije proveriti da li se vrednost koju ispitujemo nalazi na listi za _false_, i ako se nalazi - vrednost ce implicitno/eksplicitno biti konvertovan u _false_, a u suprotnom _true_.

## Eksplicitna konverzija

### Eksplicitno: znakovni niz <--> brojevi

Najcesca konverzija (iz stringa u broj).

```js
var a = 42;
var b = String(a); // "42"

var c = "3.14";
var d = Number(c); // 3.14
```

Ovo je najocigledniji tip eksplicitnog konvertovanja. Slicna ideja je i u jezicima gde je staticko odredjivanje tipova.

>U C/C++ bi se pretvaranje vrsilo na nacin: int(x) (mada postoji i drugi zapis - (int)x (kasting tipa, engl. type casting))
>
>Sto je mnogo slicno JS nacinu: Number(x)

A postoje i mnogo drugih nacina:

```js
var a = 42;
var b = a.toString(); // "42"

var c = "3.14";
var d = +c; // 3.14
```

Metoda _toString()_ radi malo drugacije nego sto sam zamisljao. Nisam uopste razmisljao o tome kako radi, tako da nije ni to lose receno xD

Da bi iskoristio metodu nad primitivnom vrednoscu moram da je "upakujem" u okruzujuci objekat. Makar to nije nesto o cemu moram da razmisljam jer JS masina to radi umesto mene. Ovo je primer "eksplicitno implicitnog" konvertovanja.

+c je vec opste prihvacen oblik eksplicitnog nacina konvertovanja prihvacen u zajednici za otvoren JS kod.
Ali ovaj oblik takodje moze lako i da zbuni.

```js
var a = "3.14";
var b = 5 + +a; // 8.14

/*
// palo mi je napamet zasto nije samo stavio 5 + a
// var c = 5 + a; // 53.14
// var d = a + 5; // 3.145
*/
```

Kako moze sa +, tako moze i sa -. Samo sto prilikom koriscenja s operacijom -, menja se znak broja.

```js
var a = "3.14"
var b = -a; // -3.14

/*
// da bi ponovo prebacio
// u pozitivnu stranu
// mogu iskoristit jos jedan minus:
// var b = - -a; // 3.14
*/
```

#### Konverzija datuma u broj

Jos jedan cest oblik upotrebe unarnog operatora + je prilikom konverzije datumskog objekta u tip _number_.

```js
var d = new Date();

+d; // broj u milisekundama koji je protekao od 1. januara 1970. godine
```

Najbolji nacin da dobijem informaciju o vremenu je koriscenjem nove metode _now_ u _Date_ objektu:

```js
var a = Date.now();

// polifil
if(!Date.now){
  Date.now = function(){
    return +new Date();
  }
}
```

**Preporuka**: nemoj koristiti oblik konverzije datuma, vec koristi metodu _Date.now()_ ako ti je potrebno trenutno vreme, a u suprotnom _new Date(..).getTime()_

#### Neobican slucaj operatora ~

Spada u opseg eksplicitnog konvertovanja.

Ono sto se desava je da on prvo konvertuje u 32-bitni broj, a zatim negira sve bitove tog broja (obrce paritet svakog bita)

-1 se obicno naziva kontrolna vrednost (engl. _sentinel_). Kada funcija vrati bilo koji vrednost >=0, to se tumaci kao uspeh, dok ako vrati -1 neuspeh. Jedan primer njene primene je metoda _indexOf(..)_. Ako ne nadje postring u stringu f-ja vraca -1, a ako nadje, vraca indeks >=0.

```js
var a = "Zdravo svete"

if(a.indexOf("sv") >= 0){
  // nasao sam ga
}

if(a.indexOf("sv") != -1){
  // nasao sam ga
}

if(a.indexOf("vs") < 0){
  // nisam ga nasao
}

if(a.indexOf("vs") == -1){
  // nisam ga nasao
}
```

Problem sa ovakvim kodom je taj sto se moze videti da zavisim od kontrolne vrednosti (-1), a vise bih voleo da se to ne primeti. Zato tu stupa operator ~ (**tilda**).

```js
var a = "Zdravo svete"

~a.indexOf("sv"); // -7 <- ponasa se kao true

if(~a.indexOf("sv")){
  // nasao sam
}

~a.indexOf("vs"); // 0 <- ponasa se kao false
!~a.indexOf("vs"); // true

if(!~a.indexOf("vs")){
  // nisam ga nasao
}
```

#### Odsecanje bitova

Tilda se takodje moze korisititi i za odsecanje decimalnih delova broja.

```js
~~-49.6; // -49
Math.floor(-49.6); // -50;
```

Prva tilda pretvara u 32-bitnu alternativu i obrce vrednosti bitova, a druga zatim opet obrce vrednosti bitova sto ih vraca u prvobitno stanje.

Ali to sto se moze postici sa duplom tildom, moze i s operatorom | (OR).

```js
~~1E20 / 10; // 166199296
1E20 | 0 / 10; // 1661992960 <-razlicito od gornjeg
(1E20 | 0) / 10 // 166199296
```
