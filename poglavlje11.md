# Objekti

## Sintaksa

Objekti se mogu naci u dva oblika:

1. Deklarativnom (literalnom) i
2. Konstruisanom

```js
// Literalni oblik
var obj = {
  key: value,
};

// Konstruisani oblik
var obj = new Object();
obj.key = value;
```

## Tip objekta

Proste primitivne vrednosti (number, string, boolean, null i undefined) nisu tipa object.

> Zanimljiva "greska"
>
> ```js
> typeof null; // "object"
> ```

Iako se ova greska pojavljuje, null je zaseban primitivni tip.<br>
Nije sve u JavaScriptu objekat, kao sto kazu, ali postoje podtipovi objekata (slozeni literali).<br>
U slozene literale spadaju funkcije i nizovi.<br>
Za funkcije se kaze da su objekti prve klase jer su, funkcije, u osnovi samo objekti koji imaju pridodatu semantiku za povezivanje.

### Ugradjeni objekti

Ugradjeni objekti:

- String
- Number
- Boolean
- Object
- Function
- Array
- Date
- RegExp (Regular Expression - regularni izrazi)
- Error

Iako nazivom podseca na tip podataka ili klase, predstavlja ugradjene funkcije, koje sa pozivom uz rezervisanu rec _new_, konstruisu nove objekte.

```js
var primitiveString = "Kristijan";
typeof primitiveString; // "string"
primitveString instanceof String; // false

var stringObject = new String("Kristijan");
typeof stringObject; // "object"
stringObject instanceof String; // true
console.log(stringObject); // String{ "Kristijan" };
```

String "Kristijan" (ili bilo koji drugi) je prost primitivni tip (literal), a da bi nad njim izvrsavali metode kao sto su _lenght()_, _charAt()_ prevodilac inplicitno nas string pretvara u podtip objekta - String odakle uzima reference na definisane funkcije, odnosno metode. To se isto desava i sa drugim prostim vrednostima (number, boolean).<br>
Null i undefined nemaju svoj omotacki oblik tipa object. Suprotno njima objekat Date nema svoj prost tip koji omotava.
Object, Array, Function i RegExp su objekti, bez obzira da li uporebljavamo literalni ili konstruisani oblik deklaracije objekta. Uglavnom se koristi literalni oblik. A ako su potrebne dodatne opcije, koristi se konstruisani oblik.<br>
Error se ne definise toliko cesto eksplicitno, ali se automatski javlja kada se dogodi izuzetak.

## Sadrzaj objekta

Svaki objekat se sastoji od vrednosti (values) koje su smestene na imenovane lokacije koje se zovu svojstva (properies / keys).<br>
Svojstva, kao i vrednosti se ne cuvaju na jednoj lokaciji (kada je to skup podataka, obicno se pomisli da su sve deklarisane promenljive u jednoj zajednickoj adresi u memoriji, ali to nije tako). Masina jezika cuva promenljive, kao i vrednosti povezane sa njima, na random mestima u memoriji. Kada se deklarise objekat na njegovoj adresi se cuvaju lokacije adresa na kojima se nalaze promenljive deklarisane u njegovom opsegu vidljivosti.<br>
Kako bi pristupili vrednosti nekog svojstva objekta koriste se jedna od dve sintakse:

1. obj.a; pristupanje svojstvu
2. obj['a']; pristupanje kljucu

Posto se u sinkaksi pristupanja kljucu (obj['a']) lokacija zadaje u obliku znakovnog tipa, program moze da formira vrednost tog znakovog tipa.

```js
var obj = {
  a: 2,
};

var idx = "a";

console.log(obj[idx]); // 2
```

### Izracunata imena svojstava

Sinktaksa:

```js
var prefix = "foo";

var obj = {
  [prefix + "bar"]: "hello",
  [prefix + "baz"]: "world",
};

obj["foobar"]; // hello
obj["foobaz"]; // world
```

### Svojstva i metode

Programeri vole da naprave razliku kada je deklarisana funkcija kao jedan od svojstava, i onda za tu funkciju kazu da je metoda.<br>
Ali autor knjige ne vidi zasto praviti razliku. Svojstvo funkcije ce vratiti vrednost ma kakvog god tipa da je. A ako kao vrednost dobijemo funkciju, ona na tom mestu, nikakvom carolijom, ne postaje "metoda". Nema niceg posebnog u definisanju funkcije kao vrednost svojstva (jedino sto omogucava je implicitno povezivanje this).

```js
function foo() {
  console.log("foo");
}

var someFoo = foo;

var obj = {
  someFoo: foo,
};

foo; // function foo(){..}
someFoo; // function foo(){..}
obj.someFoo; // function foo(){..}
```

Da je funkcija foo bila definisana sa referencom this, onda bi jedina uocljiva razlika bila to sto se this implicitno povezao sa _obj_.<br>
Nema nikakvog razloga da funkciju u objektu nazivamo "metoda".<br>
Zakljucak: "funkcija" i "metoda" se mogu koristiti kao sinonimi

### Nizovi

Posto su nizovi podtip objekata, znaci da nasledjuju neka ponasanja istih.<br>
Jedan od nasledjenih ponasanja jeste dodavanje svojstva.

```js
var arr = ["foo", 42, "bar"];
arr.baz = "baz";
console.log(arr.baz); // "baz"
console.log(arr); // Array(3) ["foo", 42, "bar"]; nije se promenila duzina niza iako smo dodali baz
```

Objekti se koriste za cuvanje parova kljuc/vrednost, a nizove za cuvanje vrednosti smestenim na numberickim indeksima.<br>
Ako pukusamo da dodelimo svojstvo koje se moze protumaciti kao broj, ono ce se smatrati numerickim indeksom:

```js
arr["3"] = "baz";
console.log(arr); // Array(4) ["foo", 42, "bar", "baz"];
```
