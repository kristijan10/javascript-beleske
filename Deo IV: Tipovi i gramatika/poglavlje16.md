# Vrednosti

Nizovi (array), znakovni niz (string, ili po naski niska) i brojevi (number) cine najosnovnije gradivne blokove programa.

## Nizovi

To su samo kontejneri koji mogu sadrzati vrednosti proizvoljnog tipa - od string ili number, do object, pa cak i drugi nizovi (sto je nacin na koji se dobiju visedimenzioni nizovi).

Iako je moguce deklarisati clanove niza a da pritom ostavljamo neka mesta prazna, ali se to ne preporucuje.

```js
var a = [];

a[0] = 1;
a[2] = 3;

a[1]; // undefined
a.length; // 3
```

Jos nesto sto se ne preporucuje je da zadajem index znakovnog tipa, jer bi tada trebao koristiti objekat, ne listu.

```js
var a = [];

a['footbal'] = 2;
a["13"] = 14;

a.legth; // 14
```

### Vrednosti nalik nizovima

Kako bi iskoristili metode lista, slicne iglede array listama mozemo pretvoriti u appray listu.

Jedan od tih slicnih primera je prilikom igranja s DOM-om. Kada biramo vise slicnih elemenata masina nam vraca odgovor u obliku _NodeList_. A drugi primer je koriscenjem rez. reci _arguments_ u opsegu vidljivosti funkcije.

```js
function foo(){
  // slice(..) je metoda kojom pravim listu
  var arr = Array.prototype.slice.call(arguments);
  /*
  // U es6 je olaksano pravljenje liste
  // var arr2 = Array.from(arguments);
  */
  arr.push("bar");
  console.log(arr);
}

foo("baz", "bam"); // ["baz", "bam", "bar"]
```

## Znakovni nizovi

Moglo bi se pomisliti da je znakovni niz (string) samo kopija listi (array). Pristup znakovima na nacin nakoji bi pristupali nekoj vrednosti liste nije preporucljiv.

```js
var a = "foo";
var b = ["f", "o", "o"];

a[1]; // "o"
b[1]; // "o"

// ispravna sintaksa bi bila:
a.charAt(1);
```

Javascriptov objekat _string_ je nepromenljiv, dok je objekat _array_ prilicno promenljiv. Nepromenljiv u smislu da kada radimo nesto nad njim, pravi se nova kopija trenutnog, pa se nad njim izvrsava i kasnije cuva u zadatoj promenljivoj. Nasuprot tome, mnoge metode niza koje menjaju sadrzaj zapravo to rade u samom nizu (ne prave kopije).

Jos jedan primer kako znakovni nizovi i liste nemaju ni zajednicke metode je primer koji se najcesce pojavljuje na razgovoru za posao, obrtanje redosleda stringa.

```js
/*
// undefined je zato sto ne
// postoji to svojstvo za
// vrednosti tipa string
*/
a.reverse; // undefined

b.reverse(); // ["o", "o", "f"]
b; // ["o", "o", "f"]

/*
// jedino resenje je da string
// prebacimo u niz, odradimo reverse
// i vratimo u string
*/

// razvajamo znakove u niz, obrcemo i spajamo u string
var c = a.split("").reverse().join("");

c; // "oof"
```

>Izgleda ruzno sintaksa ovog resnja i nije preporucena

## Brojevi

Sve vrste brojeva u JS-u spadaju pod ovaj tip. Nema razlike da li je decimalan ili celobrojan oba pripadaju tipu _number_.

### Numericka sintaksa

Numericki literali (konstante) se obicno izrazavaju kao decimalni literali sa osnovom 10.

```js
var a = 42;
var b = 42.3;

/*
// ako je vodeci deo decimalne vrednosti 0
// ne mora se ni pisati
*/
var a = 0.42;
var b = .42;

/*
// tako isto i za zavrsni
// mada 42. bi samo pisao da nekoga zbunim
// pre nego da mi nesto olaksa...
*/
var a = 42.0;
var b = 42.;

/*
// vrlo velike ili vrlo male vrednosti
// tipa number se standardno prikazuju u
// eksp. obliku
*/
var a = 5E10;
a; // 50000000000, deset nula
a.toExponential(); // "5e+10"

var b = a*a;
b; // "2.5e+21"

var c = 1/a;
c; // 2e-11

/*
// metoda .toFixed kojoj mogu
// pristupiti vrednosti tipa number
// ogranicava na koliko decimalnih
// mesta zelite da se ono prikazuje
// metoda vraca string, ali ne menja
// prvenstvenu promenljivu
*/
var a = 42.59;

a.toFixed(0); // "43"
a.toFixed(1); // "42.6"
a.toFixed(3); // "42.590"

/*
// metoda .toPrecision odredjuje
// s koliko se znacajnih cifara
// vrednost predstavlja; odnosno
// argument metode govori od
// koliko cifara ce se broj
// sadrzati
*/
var a = 42.59;

a.toPrecision(1); // "4e+1"
a.toPrecision(2); // "43"
a.toPrecision(3); // "42.6"
```

Za pristup ovim metodama nije mi potrebna promenljiva; njih mogu povati i koristeci sam broj nad kojim zelim da je primenim.

```js
(42).toFixed(3); // "42.000"
0.42.toFixed(3); // "0.420"
42..toFixed(3); // "42.000"

42.toFixed(3); // SyntaxError; prva tacka se racuna kao sastavni deo numerickog literala, pa zato fali tacka kojom pristupam metodi
```

<!-- Numericki literali se mogu izrazavati i u drugim osnovama, kao sto su binarni, oktalni i heksadecimalni.

```js
0xf3; // heksadecimalni oblik broja 243
Xf3; // isto kao i prethodna linija

O0363; // oktalni oblik od 243
``` -->

### Male decimalne vrednosti

Posto JavaScript koristi standard IEEE 754 ("pokretni zarez"), posto efekat koriscenja binarnih brojeva s zarezom:

```js
0.1 + 0.2 === 0.3; // false
```

Iako bi ovo trebalo biti tacno, nije zbog nacina na koji standard sabira decimalne brojeve. Zato da bi se izbegla ta greska uveden "masinski epsilon" - vrednost 2e-52. Es6 je ubacio konstantu u objekat _Number_ zvanu _Number.EPSILON_.

```js
function numberCloseEnoughToEqual(n1, n2){
  return Math.abs(n1-n2) < Number.EPSILON;
}

var a = 0.1+0.2;
var b = 0.3;

numberCloseEnoughToEqual(a, b); // true
numberCloseEnoughToEqual(0.0000001, 0.0000002); // false
```

_Number_ objekat takodje sadrzi i najveci (Number.MAX_VALUE, iznosi 1.798e+308) i najmanji (Number.MIN_VALUE, iznosi 5e-324 (nije neg, ali je jako blizu 0)).

### Bezbedni opsezi celobrojnih vrednosti

Najnizi, kao i najvisi bezbedan broj za koristiti je definisan u konstantama Number.MIN_SAFE_INTEGER i Number.MAX_SAFE_INTEGER. Da bi koristio neke matematicke operacije nad velikim brojevim, potrebano je koristiti dodatnu alatku

### Utvrdjivanje celobrojnih vrednosti

To radi ova metoda za nas:

```js
Number.isInteger(42); // true
Number.isinteger(42.000); // true
Number.isInteger(42.59); // false

// polifilovanje
if(!Number.isInteger){
  Number.isInteger = function(num){
    return typeof num === "number" && num % 1 === 0
  }
}
// kada je celobrojan broj % 1 vraca 0, jer nema ostataka
// kada je decimalan % 1, vraca broj iza zareza
```

Postoji metoda i za proveru da li mozemo koristiti odredjeni intidzer:

```js
Number.isSafeInteger(Number.MAX_SAFE_INTEGER); // true
Number.isSafeInteger(Math.pow(2, 53)); // false
Number.isSafeInteger(Math.pow(2, 53) - 1); // true

// polifilovanje
if(Number.isSafeInteger){
  Number.isSafeInteger = function(num){
    return Number.isInteger(num) && Math.abs(num) < Number.MAX_SAFE_INTEGER;
  }
}
```

### 32-bitne celobrojne vrednosti (s predznakom)

Koriscenje odredjene numericke operacije (koriscenje operatora nad bitovima) omoguceno je samo nad 32-bitnim vrednostima. Bezbednosni opseg 32-bitnih brojeva je mnogo manji i raspolaze izmedju -2e+31 i (2e+31)-1.

Da bi pretvorio vrednost tipa number u 32-bitnu celobrojnu vrednost s predznakom zadaj _a | 0_.

## Specijalne vrednosti

### Vrednosti koje to nisu

Vrednosti _null_ i _undefined_ su i tipovi i vrednosti koji jednoznacno oznacavaju sebe. _null_ je rez. rec koja se ne moze postaviti kao ime promenljive, ali _undefined_ moze da se iskoristi.

### Identifikator undefined

```js
function foo(){
  'use strict'
  var undefined = 2;
  console.log(undefined);
}

foo(); // 2
```

#### Operator void

Nacin na koji znam da cu sigurno dobiti vrednost _undefined_ je upotreba _void_ operatora.

```js
var a = 42;

console.log(void a); // undefined
console.log(a); // 42
```

Ako postoji mesto gde postoji vrednost (od nekog izraza) a uvidim da je korisnije da umesto te vrednosti bude _undefined_, upotrebicu operator _void_.

### Specijalni brojevi

#### Broj koji nije broj

Rezultat svake matematicke operacije u kojoj jedan ili oba operanada nisu tipa _number_ jeste vrednost koja nije ispravan broj, nego vrednost **NaN**.

NaN - Not a Number (nije broj)

Opis te vrednosti je jako zbunjujuc. Bolje bi bilo zamisliti vrednost _NaN_ kao "neispravan broj" / "neuspeo broj".

```js
var a = 8 / "foo"; // NaN

typeof a === "number" // true
```

NaN je broj? Tip necega sto nije broj je broj?

NaN je samo masinin nacin da ti kaze da si uradio matematicku operaciju nad operandima od kojih neki nije tipa _number_.

Nacin da proverimo da li je broj NaN: _isNun(a)_

Globalna metoda _isNun(..)_ ima jedan problem (resen je u ES6):

```js
var a = 8 / "foo";
var b = "foo";

isNuN(a); // true
isNuN(b); // true
```

_isNun(..)_ proverava da li je prosledjen argument tipa _number_ ili nije. Zato je ES6 uveo resenje:

```js
var a = 8 / "foo";
var b = "foo";

Number.isNaN(a); // true
Number.isNaN(b); // false
```

Polifil za ES6 _Number.isNaN(..)_:

```js
if(!Number.isNaN){
  Number.isNaN = function(n){
    return typeof n === "number" && isNaN(n);
  }
}
```

_NaN_ je jedina vrednost koja nije jednaka samoj sebi, i to se moze iskoritit za polifil:

```js
NaN !== NaN; // true
NaN === NaN; // false

if(!Number.isNaN){
  Number.isNaN = function(n){
    return n !== n;
  }
}
```

#### Beskonacnosti

U JS-u je definisano deljenje nulom:

```js
var a = 1 / 0; // Infinity
var b = -1 / 0; // -Infinity
```

Ako je rezultat dobijen koriscenjem nekih od matematickih operacija prevelik za prikazivanje standardom IEEE 754 on se zaokruzuje na najvecu pozitivnu / negativnu definisanu vrednost ili na +/-Infinity.

```js
var a = Number.MAX_VALUE;

a + a; // Infinity
a + Math.pow(2, 970); // Infinity
a + Math.pow(2, 969); // a (vrednost, nisam mogao da pisem)
```

Infinity / Infinity nije razreseno ni u matematici, a ni u JavaScript-u.

Pozitivan konacan broj / Infinity = 0;

Negativan konaca broj / Infinity = _nastavi citat dalje_;

#### Nule

U JS-u postoje obicna 0 (+0) i negativna 0 (-0). -0 vrednost se moze dobiti samo koristeci operacije mnozenja i deljenja.

```js
var a = 0 / -3; // -0
var b = 0 * (-3); // -0
```

Kada se iz tipa _number_ -0 prebacuje u _string_, JS pokusava da nas zbuni:

```js
a; // -0
a.toString(); // "0"
a + ""; // "0";
String(a); // "0"
JSON.stringify(a); // "0"

/*
// zanimljivo sto obrnuto radi normalno
*/

+"-0"; // -0
Number("-0"); // -0
JSON.parse("-0"); // -0
```

Zato moram da vodim racuna o razlici izmedju pozitivne i negativne 0?

Aplikacije koje npr. prikazuju animacije. Broj se koristi za oznacavanje dokle je objekat koji se animira stigao a predznak u kom se pravcu kretao. -0 znaci da je isao iz negativnog smera i stigao do pocetka...
