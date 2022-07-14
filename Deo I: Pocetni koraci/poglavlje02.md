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

Slozena vrednosti kojoj se moze zadavati vrednost na imenovane lokacije (svojstva), koja imaju svako svoju vrednost datog tipa.

Svojstvima se pristupa pomocu notacije s tackom (obj.a) i notacije sa uglastim zagradama (obj["a"]).
> Notacija sa tackom se cesce koristi jer je prostija i razumljivija.
>
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

Nemaju zaseban tip vrednosti array ili nizovi, vec su pripojeni tipu _object_. Ono po cemu se razlikuje od objecta jeste to sto nema imenovana svojstva vec se vrednosti indeksiraju numerickim vrednostima.

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
//Neke od metoda su:
a.lenght // broj karaktera u zadatom izrazu
a.toUpperCase(); // menja sve slovne karaktere u velika slova
a.toFixed(); // zaokruzuje broj na decimalu koja se zada kao parametar
```

Taj omotacki objekat je povezan sa odredjenim tipom vrednosti (Number sa "number"; String sa "string"; Boolean sa "boolean").

### Poredjenje vrednosti

Rezultat svake operacije poredjenja je tipa boolean (true || false), nebitno koje tipove vrednosti poredimo.

#### Konverzije tipova vrednosti

Do konverzije moze doci eksplicitnim i implicitnim nacinom.

**Eksplicitna** konverzija je kada u kodu mozemo videti da ce se jedan tip vrednosti konvertovati u drugi (parseInt(b); String(a); Number(a); parseFloat(a)...).

```js
var a = "42"
var b = Number(a);

a; // "42" - string
b; // 42 - number
```

**Implicitna** konverzija se moze javiti kao uzrok neadekvatnog koriscenja operacija na nekim vrednostima.

```js
var a = "42";
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
> Ova tablica predstavlja kojim tipom vrednosti ce se petlja izvrsiti.
>
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

Ovde se isto desava implicitna konverzija. Nema operatora kojim mozemo izvristi striktno poredjenje.

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

Ime promenljive mora poceti znacima **a-z, A-Z, $** i **_**. Nakon prvog znaka moze se koristiti 0-9. Kao ime promenljive ne mogu se koristiti rezervisane reci (for, if, switch) kao i undefined, null, true, false.

### Opsezi vidljivosti

Sa rezervisanom recju _var_ deklarisemo promenljivu koja pripada opsegu vidljivosti nekog bloka koda, a ako je kedlarisemo u najvisem nivou, onda pripada globalnom opsegu vidljivosti.

#### Podizanje

Prilikom prevodjenja prevodilac podize ('hoisting') promenljive na vrh bloka koda. Sto znaci da deklaracija promenljive moze da se nadje i na kraju bloka, a njen poziv na pocetku bloka i radi ce. Nije bas u primeni jer moze da dodje do gresaka, vec se preporucuje da se deklaracija obavi na pocetku bloka koda. Ono sto mozemo iskorisiti za hoisting jesu funkcije. Praksa je da se one prvo pozovu, pa tek onda deklarisu, ispod samog poziva.

```js
var a = 2;

foo(); // evo ga i ovde hoisting

function foo(){
    a = 3;
    console.log(a); // 3
    var a; // ovde se desava hoisting; podize se na pocetak bloka koda
}

console.log(a); // 2
```

#### Ugnjezdeni opsezi vidljivosti

```js
function foo(){
    var a = 1;

    function bar(){
        var b = 2;

        function baz(){
            var c = 3;
            console.log(a, b, c); // 1 2 3
        }

        baz();
        console.log(a, b); // 1 2 ReferenceError
    }

 bar();
    console.log(a); // 1 ReferenceError ReferenceError
}

foo();
```

Ukoliko pokusam da dodelim vrednost nekoj nepostojecoj promenljivoj automatksi pravim promenljivu u globalnom opsegu vidljivosti.

```js
function foo(){
    a = 1;
}
foo();
a; // 1; napravljena globalna promenljiva
```

Kako bi izbegli pravljenje globalnih promenljivih u ES6 je ubacena rezervisana rec _let_ koja deklarise promenljivu, koja je dostupna samo u tom bloku vidljivosti.

```js
function foo(){
    let a = 2;
}
foo();
a; // ReferenceError: a is not defined
```

Ogranicavanje promenljivih na opseg vidljivosti bloka koda olaksava odrzavanje koda na duze staze.

## Uslovni iskazi

Umesto pukog ponavljanja _if..else_ bloka mozemo iskoristiti _switch_.

```js
switch(a){
    case 2:
        console.log("a je 2");
        break;
    default:
        console.log("a je neki broj");
}
```

> U slucaju da je parametar a = 2, izvrsi predstojeci blok koda, kada vidis break - stani.
> "Bezuslovi prolaz" je kada za neki slucaj ne stavimo break, izvrsi ce se blok koda za slucaj ispod.

```js
let a = 2;
switch(a){
    case 2:
    console.log("Ispisao sam");
    case 10:
        console.log("Prosao sam i sa 2");
        break;
}
Ispisao sam
Prosao sam i sa 2
```

**Uslovni operator** je drugi oblik iskaza za uslovno izvrsavanje.

```js
let a = 41;
var b = (a>40) ? "hello" : "world";

// Isto je kao i
/*
if(a>40){
    b = "hello";
} else{
    b = "world";
}
*/
```

## Striktni rezim rada

U ES5 verziji dodat je "striktni rezim rada" koji uvodi stroza pravila za odredjena ponasanja. Njihova svrha je da se pise bezbedniji kod koji nece neocekivano implicitno pretvoriti neku vaznu promenljivu. Takodje, striktni rezim rada olaksava kompajleru da optimizuje kod. Moze se ukljuciti samo za pojedinacnu funkciju ili za ceo dokument.

```js
function foo(){
    "use strict";

    // za ovaj blok vazi striktni rezim

    function bar(){
        // za ovaj blok vazi striktni rezim
    }
}

// za ovaj blok NE vazi striktni rezim
```

Strikni rezim rada ne dozvoljava automatsko deklarisanje globalnih promenljivih

```js
function foo(){
    "use strict";
    a = 1;
}
foo();
a; // ReferenceError
```

U slucaju da nesto ne radi tokom striktog rezima, nemoj ga iskljucivati / brisati. To je znak na nesto u programu ne valja, sto ce se mozda bez striktong rezima popraviti nekom implicitnom konverzijom...
Preporucuje se da striktni rezim rada koristis u svakom programu.

## Funkcije kao vrednosti

```js
var foo = function(){
    // blok koda
}

var x = function bar(){
    // blok koda
}
```

Prvi funkcijski izraz se zove anonimni funkcijski izraz jer nema ime.

Drugi je imenovani funkcijski izraz. Bolje resenje za koriscenje.

### Funkcijski izrazi za trenutno izvrsavanje

_IIFE_ (Immediately Invoked Function Expression), funkcijski izraz za trenutno izvrsavanje.

```js
(function IIFE(){
    console.log("Hello");
})()
// "Hello"
```

> Prvi par zagrada je tu vise kao gramaticka deklaracija da kaze prevodiocu da to nije obicna deklaracija izraza.
>
> Drugi par zagrada je taj koji poziva funkciju

```js
/* foo je referenca na neku promenljivu / funkciju, koja se izvrsava parom zagrada */
foo();

/* (function IIFE(){}) je funkcijski izraz, koji se izvrsava parom zagrada */
(function IIFE(){})();
```

IIFE pravi svoj opseg vidljivosti promenljive koje nece uticati na spoljasnji opseg.

```js
var a = 42;

(function IIFE(){
    var a = 10; // a = 10 bi vratilo vrednost na globalni opseg vidljivosti i onda bi
    console.log(a); // 10
})();

console.log(a); // 42 // i ovde bilo 10
```

### Ograde

Ograde (closure) je nacin da zapamtimo opseg vidljivosti vec izvrsene funkcije.

```js
function dodajx(x){
    function dodajy(y){
        return x + y;
    }
    return dodajy;
}

var dodajJedan = dodajx(1);
var dodajDeset = dodajx(10);

dodajJedan(4); // 5
```

Funkcija dodajx pamti x koji je prosledjen u trenutku izvrsavanja te iste funkcije.
Ta funkcija se moze pozvati i sa:

```js
dodajx(1)(4);
```

Sto onda svodi na to da se moze krace napisati kao:

```js
var dodaj = x => y => x + y;
dodaj(1)(4); // 5

// ako zelim mogu da uvedem promenljivu za x
var promX = dodaj(1);
promX(4); // 5;
// ali je isto kao sto sam pozvao i gornju dodaj funkciju
```

#### Moduli

Omogucavaju da deklarisemo privatne promenljive, funkcije koje su skrivene od spoljasnjeg sveta, kao i javni API koji je dostupan spoljasnjem svetu i koji koristi te skrivene funkcije, promenljive.

```js
function User(){
    var username, password;

    function login(user, pass){
        username = user;
        password = pass;
    }

    var publicAPI = {
        login: login
    };

    return publicAPI;
}
var fred = User();
fred.login("fred", "12Battery34!");
```

## Indentifikator this

Rezervisana rec _this_ obicno upucuje na vrednost tipa _object_. Na koji to objekat upucuje zavisi od nacina pozivanja funkcije. _This_ nije referenca na funkciju u kojoj se nalazi, sto je cesto shvaceno uzevsi u obzir rec **this**.

```js
function foo(){
    console.log(this.bar);
}

var bar = "global";
var obj1 = {
    bar: "obj1",
    foo: foo
}
var obj2 = {
    bar: "obj2"
}

foo(); // "global"
obj1.foo(); // "obj1"
foo.call(obj2); // "obj2"
new foo(); // undefined
```

Postoje cetiri pravila koja odredjuju koji objekat prikazuje _this_:

1. Ako striktni rezim nije ukljicen, _this_ ukazuje na globalni opseg vidljivosti. To se u gore navedenom primeru moze videti. A ako je striktni rezim rada ukljucen, da smo na onakav primer pozvali _this.bar_ vratio bi nam _undefined_.
2. obj1.foo() podesava this na objekat obj1
3. foo.call(obj2) podesava this na objekat obj2
4. new foo() pravi nov prazan objekat i zato sto nema definisane promenljive bar u tom foo objektu, vraca undefined.

## Prototipovi

To je nacin povezivanja dva opsega vidljivosti dva objekta.

```js
var foo = {
    a: 42
}

var bar = Object.create(foo);
bar.b = "hello world";

bar.b // "hello world"
bar.a // 42
```

>objekat _bar_ nema referencu a, ali posto je isti povezan sa objektom foo, kao svojim prototipom, JS prevodilac automatski trazi svojstvo a u objektu foo.

```js
foo
 -------------------
 |      a: 4       |
 -------------------
       ^
       | prototipska veza
bar    |
 -------------------
 | b: "hello world"|
 -------------------
```

Najuobicaniji nacin da se iskoristi ova povezanost opsega vidljivosti jeste za oponasanje "klasa" koje omogucavaju "nasledjivanje".

Jos jedna korisna primena prototipova jeste upotreba sablona imena "delegiranje ponasanja" gde se objekti projektuju tako da jedan drugome zadaju potrebna ponasanja.

## Staro i novo

Kako bi iskoristili najnovije mogucnosti _JS_ na starijim web browserima postoje mogucnosti **polifilovanje** i **transpajliranje**. Oni noviju sintaksu prebacuju u oblik poznat starijim citacima veba.

### Polifilovanje

Uzeti definicije novijih mogucnosti i napisati blok koda koji omogucava ekvivalentno ponasanje bez obzira na kojoj verziji ES-a korisnik pretrazuje veb.

Alatke za polifilovanje:

* [ES5-Shim](https://github.com/es-shims/es5-shim)
* [ES6-Shim](https://github.com/es-shims/es6-shim)

### Transpajliranje

Ime je nastalo od dve reci: transformacija + kompajliranje. Radi na nacin da mi pisemo js dokument najnovijom sintaksom, a da citacu veba saljemo transpajliran dokument. To se postize alatkom za transpajliranje.

Prednost transpajliranja koda:

* Kako bi dokument bio organizovanji pise se novijom sintaksom. Lakse je za citanje i razumevanje, a takodje i za dalje odrzavanje.
* Ako transpajlirane js fajlove koristite samo na starijim citacima veba, a za moderne koristite fajlove sa novom sintaksom, omogucavate proizvodjacima veb citaca da koriste real-world primere. Takodje prednost novije sintakse jeste optimizacija js fajla prilikom citanja.

Primer transpajliranja koda. ES6 je uveo mogucnost "podrazumevana vrednost parametra".

```js
function foo(a = 2){
    console.log(a);
}

foo(); // 2
foo(42); // 42
```

Kako bi stariji citaci veba mogli ovo da postignu moramo izvrsiti transpajliranje, koje ce izgledati nesto ovako:

```js
function foo(){
    var a = arguments[0] !== (void 0) ? arguments[0] : 2;
    console.log(a);
}
```

Funkcija utvrdju da li arguments[0] ima vrednost (void 0) tj. undefined i zadaje podrazumevanu vrednost 2. U ostalim slucajevima, zadaje vrednost prosledjenu parametrom.
Citanje transpajliranog koda omogucava nam da bolje razumemo nacim postizanja zadatog cilja.

Alatke za transpajliranje koda:

* [Babel](https://babeljs.io)
* [Traceur](https://github.com/google/traceur-compiler)

## Rad u okruzenju koji nije JavaScript

Neke funkcije koje svakodnevno koristimo nisu definisane u masini JS programskog jezika. Vec se koristi DOM metoda koja je ugradjena u sve citace veba pomocu programskog jezika nalik na C / C++. Neke od metoda koje koristimo su alert(), console.log(), document.getElementBy...().. To su sve funkcije koje su ugradjene u web browser. Ne u masini JS jezika.

## Sazetak poglavlja

Prvi korak pri ucenju JavaScript varijante programiranja jeste sticanje osnovnog razumevanja mehanizama koji cine srz jezika, kao sto su vrednosti, tipovi, ograde, identifikator this i prototipovi.
