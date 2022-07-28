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
