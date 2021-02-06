# Uvod u JavaScript

## Vrednosti i tipovi
JavaScript ima ukupno 7 tipova:
1. string
2. number
3. boolean
4. null 
5. undefined
6. object
7. symbol (novina u ES6)

U JS-u samo vrednosti imaju definisan tip, dok su promenljive samo kontejneri za te vrednosti.
> U C jeziku promenljive imaju definisane tipove, dok vrednosti nemaju.

```js
// Zanimljiva greska u JS
typeof(null); // "object"
```

### Objekti
Slozena vrednosti kojoj se moze zadavati vrednost na imenovane lokacije (svojstva), koja imaju svako svoju vrednost datog tipa.<br>
Svojstvima se pristupa pomocu notacije s tackom (obj.a) i notacije sa uglastim zagradama (obj["a"]).
> Notacija sa tackom se cesce koristi jer je prostija i razumljivija.<br>
> Notacija sa zagradama se koristi kada je 'kljuc' (imenovana lokacija) tipa string. Ova notacija (sa zagradama) zahteva promenljivu ili vrednost tipa string.

```js
var obj = {
    a: "hello world",
    "broj": 42
}

var b = "a";

obj.a // "hello world"
obj["broj"]; // 42
obj[b]; // "hello world"
```

#### Nizovi
Nemaju zaseban tip vrednosti array ili nizovi, vec su pripojeni tipu _object_. Ono pocemu se razliku je objecta jeste to sto nema imenovana svojstva vec se vrednosti indeksiraju numerickim vrednostima.
```js
var a = [0, 1, 2, 3, 4];
// Prva vrednost ima index 0, druga vrednost ima index 1
a[0]; // 0
a[1]; // 1
a[2]; // 2
```

#### Funkcije
Isto kao i nizovi, funkcije nemaju zaseban tip vrednosti vec pripadaju podskupu _object_.
```js
function foo(){
    return 42;
}

foo.bar = "hello world";
// ^ Moze se koristiti kao objekat, ali se to retko radi.

typeof(foo); // "function"
typeof(foo()); // "number"
typeof(foo.bar) // "string"
```

### Ugradjene metode tipova

U _window_ objektu, koji je roditelj svih objekata, u sebi sadrzi omotacke objekte kao sto su String, Number i Boolean. A u njima su definisane metode koje su nama na usluzi.
```js
//Neke od metoda su:<br>
a.lenght // broj karaktera u zadatom izrazu
a.toUpperCase(); // menja sve slovne karaktere u velika slova
a.toFixed(); // zaokruzuje broj na decimalu koja se zada kao parametar
```
Taj omotacki objekat je povezan sa odredjenim tipom vrednosti (Number sa "number"; String sa "string"; Boolean sa "boolean").

### Poredjenje vrednosti

Rezultat svake operacije poredjenja je tipa boolean (true || false), nebitno koje tipove vrednosti poredimo.

#### Konverzije tipova vrednosti

Do konverzije moze doci eksplicitnim i implicitnim nacinom.<br>
**Eksplicitna** konverzija je kada u kodu mozemo videti da ce se jedan tip vrednosti konvertovati u drugi (parseInt(b); String(a); Number(a); parseFloat(a)...).<br>
```js
var a = "42"
var b = Number(a);

a; // "42" - string
b; // 42 - number
```
**Implicitna** konverzija se moze javiti kao uzrok neadekvatnog koriscenja operacija na nekim vrednostima.
```js
var a = "42;
var b = a * 1; // ovde je doslo do implicitne konverzije

a; // "42" - string
b; // 42 - number
```

#### Istinito i neistinito
| Neistinito | Istinito |
| ---------- | -------- |
| "" (prazan znakovni niz) | "hello"|
| 0, -0, NaN | 42 |
| null, undefined | true |
| false | [], [1, 2, "3"] (nizovi) |
|       | {}, {a: 42} (objekti) |
|       | function foo(){...} |
> Ova tablica predstavlja kojim tipom vrednosti ce se petlja izvrsiti.<br>
> Ako se kao parametar, implicitnom konverzijom, zadesi neka neistinita vrednost, petlja se nece izvrsiti

#### Jednakost

Razlika izmedju == i === je u strogoci ispitivanja vrednosti. == ispituje jednakost vrednosti (uz dozvoljenu implicitnu konverziju). === ispituje jednakost vrednosti ali i tip vrednosti (bez konverzije).
```js
"32" == 32 // true
"32" === 32 // false
```
> string "32" se pretvara u number 32, kako bi se poredile te dve vrednosti

* Ako jedna od vrednosti koje poredimo moze biti tipa _boolean_ onda koristi ===
* Ako nesto poredimo sa [] || "" || 0, koristi ===
* Za sve ostale slucajeve moze da se koristi ==

> Ovo sve vazi i za poredjenje sa != && !==

```js
var a = [1, 2, 3];
var b = [1, 2, 3];
var c = "1, 2, 3";

a == c //true
b == c // true
a == b // false
```

#### Nejednakost

Poredjenje vrednosti sa <, >, <= i >=.
```js
var a = 42;
var b = "43";
var c = "44";

a < b // true
b < c // true
```
Ovde se isto desava implicitna konverzija. Nema operatora kojim mozemo izvristi striktno poredjenje.<br>
Posto se prva vrednost, x, uzima kao [true](https://262.ecma-international.org/5.1/#sec-11.8.5) vrednost sa desne strane se konvertuje u tip vrednosti sa leve strane.

```js
var a = 42;
var b = "foo";

a < b // false
a > b // false
a == b // false
```
Ponovo, x se uzima kao true (vrednost number se uzima kao true), pa desnu stranu (string) implicitno konvertuje u number, gde dobija _NaN_. Poredjenje _number_ sa _NaN_ vraca _false_. 42 == NaN - false

## Promenljive