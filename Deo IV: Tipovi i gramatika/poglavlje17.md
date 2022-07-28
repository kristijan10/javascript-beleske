# Izvorni objekti

Odnosno ugradjeni objekti:

- Number()
- String()
- Boolean()
- Array()
- Object()
- Function()
- RegExp()
- Date()
- Error()
- Symbol()

Ako citac dolazi sa prethodnim znanjem iz nekog od OOP jezika pretpostivice da se ovi objekti (sto su zapravo funkcije) mogu koristiti kao konstruktorski poziv za pravljenje promenljivih cija je vrednost pozvani konstruktor.

Ali to nije tako.

```js
var a = new String('abc');

typeof a; // "object"
console.log(a); // String { "abc" }
console.log(a.toString()); // "abc"
```

Rezultat generisanja vrednosti pomocu konstruktora (_new String('abc')_) je objektni omotac u koji je upakovana primitivna vrednost ('abc').

## Interno svojstvo [[Class]]

Svojstvo [[Class]] je nenabrojivo niti ga mozemo menjati. Sluzi za dalje objasnjenje kojeg je podtipa objekat koji ispitujemo.

Za slozene (objekatske) vrednosti to je:

```js
Object.prototype.toString.call([1, 2, 3]);
// "[object Array]"

Object.prototype.toString.call(/regex-literal/i);
// "[object RegExp]"
```

Kada su primitivne vrednosti u pitanju, radi i na tome:

```js
Object.prototype.toString.call(null);
// "[object Null]"

Object.prototype.toString.call(undefined);
// "[object Undefined]"
```

A sto se tice ostalih primitivnih vrednosti, pozivanje ispitivanja [[Class]] svojstva "pakuje" pozvanu vrednost u objekat i tada ispituje kojeg je tipa vrednost:

```js
Object.prototype.toString.call("abc");
// "[object String]"

Object.prototype.toString.call(123);
// "[object Number]"

Object.prototype.toString.call(true);
// "[object Boolean]"
```

## Pakovanje primitiva u objektne omotace

Ovo automatski radi masina jezika kada pozivamo meko svojstvo nad primitivnim vrednostima.

```js
var a = "abc";

/*
// da bi ove metode mogle biti pozvane
// js masina "pakuje" primitivnu vrednost
// u omotacki objekat koji omogucava
// koriscenje globalnih metoda nad prostim
// tipovima
*/
a.length; // 3
a.toUpperCase(); // "ABC"
```

### Zamke upotrebe objektnih omotaca

```js
var a = new Boolean(false);

if(!a) console.log("Ups"); // ovo se nikada nece izvrsiti
/*
// razlog tome je sto promenljiva a
// ima vrednost object sto ce uvek 
// biti tacno
*/
```

## Raspakivanje

Ono sto je masina proveravala u prethodnom primeru koda je da li je vrednost promenljive _a_ true ili false. Posto je vrednost razlicita od 0 i false, to znaci da je true. Ja sam svo vreme proveravao vrednost promenljive a, a ne sta se nalazi u tom omotackom objektu... To se moze postici metodom _valueOf()_.

```js
var a = new String("abc");
var b = new Number(42);

a.valueOf(); // "abc"
b.valueOf(); // 42
```

Raspakivanje iz omotackog objekta se takodje moze postici i namernim implicitnim putem:

```js
var a = new String("abc");
var b = a + '';

typeof a; // "object"
typeof b; // "string"
```

## Izvorne funkcije kao konstruktori

```js
var a = new Array(3);

a.length; // 3
a; // Chrome: [empty x 3]
a; // Firefox: [<3 empty slots>]
```

```js
var a = new Array(3);
var b = [undefined, undefined, undefined];
var c = [];
c.length = 3;

console.log(a); // [<3 empty slots>]
console.log(b); // [undefined, undefined, undefined]
console.log(c); // [<3 empty slots>]

delete b[1];
console.log(b); // [undefined, <1 empty slot>, undefined]
```

Ako bas zelis da napravis niz u kojem imas nedefinisane vrednosti to se moze postici:

```js
var a = Array.apply(null, {length: 3});
a; // [undefined, undefined, undefined]
```

Metoda _apply(..)_ je dostupna svim funkcijama i razlicito se ponasa pozivanjem uz drugacije okruzenje. U ovom primeru metoda je pozvana nad objektom _Array_. Prvi argument predstavlja na sta ce this da upucuje, a posto nam ne treba zadajemo da this ne upucuje ni na sta. Drugi argument bi trebao da bude niz (ili objekat nalik nizu), a njeni clanovi se prosledjuju kao argumenti funkciji koja se poziva.

Ono sto se ustvari desava je: _Array.apply(..)_ poziva funckiju _Array(..)_ kojoj kao argumente prosledjuje raspodeljene vrednosti (iz objektne vrednosti {length: 3}).

I to ustvari izgleda ovako: _Array.apply(undefined, undefined, undefined)_

Savet: nemoj se igrati s **praznim nizovima**

### Konstruktori Object(..), Function(..) i RegExp(..)

Da skratim pricu, nema potrebe koristiti ih u konstruktorskom obliku.

>Ne znam sta je RegExp
>
>Update: ako sam dobro shvatio, RegExp je koriscen za pretrazivanje odredjenog izraza u zadatom izrazu. Pretpostavljam da se to desava iza Find and Replace komande u aplikacijama/browserima...
>
>TODO: [Nauciti RegExp](https://www.sitepoint.com/learn-regex/)

### Konstruktori Date(..) i Error(..)

Ovo su jedini korisni konstruktori od ovih sto sam do sada nabrojao, jer su ovo jedini objekti koji nemaju literalni oblik definisanja.

Konstruktor _Error(..)_ se obicno definise pomocu operatora _throw_:

```js
function foo(x){
  if(!x) throw new Error("x nije zadat");
}

foo(); // Uncaught Error: x nije zadat
```

### Konstruktor Symbol(..)

Promenljiva tipa "symbol" se pravi bez koriscenja rez. reci _new_.

```js
var mysym = Symbol("moj prvi simbol");

var a = {};
a[mysym] = "foobar";

console.log(a); // {Symbol(moj prvi simbol): 'footbar'}
```

Koristi se za imenovanje privatnih svojstava.

#### Izvorni prototipovi

Svaki tip ima ugradjeni _prototype_ objakat koji sadrzi svojstva i metode specificne za taj tip.

On je taj koji nam omogucava koriscenje metoda _.toUpperCase(), indexOf(..), toString()_ nad vrednostima tipa string...

##### Prototipovi kao podrazumevane vrednosti

```js
function foo(vals, fn, rx){
  vals = vals || Array.prototype;
  fn = fn || Function.prototype;
  rx = rx || RegExp.prototype;
}
```

_Array.prototype_ je prazna array lista.

_Function.prototype_ je prazna funkcija.

_RegExp.prototype_ je prazan regularni izraz.

Treba samo voditi racuna da se te zadate vrednosti mogu samo citati, treba ih izbegavati menjati.

## Sazetak poglavlja

JavaScript stavlja na raspolaganje objektne omotace za primitivne vrednosti, koji su poznati kao izvorni objekti (String, Number, Boolean itd.). Ti objektni omotaci omogucavaju da vrednosti pistupaju metodama i svojstvima odgovarajucih objektnih podtipova (String#trim() i Array#concat(..)).

Ako imate jednostavnu skalarnu primitivnu vrenodst, kao sto "abc" i zelite da pristupite njenom svojstvu length ili nekoj metodi objekta String.prototype, JS automatski "pakuje" tu vrednost (umece je u odgovarajuci objektni omotac) da bi se moglo pristupati svojstvu/metodi.
