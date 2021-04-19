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

### Dupliranje objekata

```js
function anotherFunction() {
  /* .. */
}
var anotherObj = {
  c: true,
};
var anotherArr = [];
var myObj = {
  a: 2,
  b: anotherObj, // referenca
  c: anotherArr, // referenca
  d: anotherFunction, // referenca
};
anotherArr.push(anotherObj, myObj);
```

Pitanje je da li se radi plitko ili duboko dupliranje.<br>
Ako se radi o plitkom, novi objekat (duplirani) ima kopiju kljuca _a_ i kopiju vrednosti _2_. A sto se tice _b_, _c_ i _d_ dupliranog objekta, predstavljaju samo reference na mesta koje prikazuje i izvorni objekat.<br>
Ako je u pitanju duboka kopija, osim dupliranog myObj, mora se klonirati i anotherObj i anotherArr. A posto anotherArr sadrzi reference iz anotherObj i myObj znaci da i oni moraju da se dupliraju. Nije dobro, jer se javio problem cirkularnog dupliranja.<br>
Jedino delimicno resenje jeste da se bezbedni objekti za konverziju u JSON, pretvore u isti sa komandom

```js
var newObj = JSON.parse(JSON.stringify(someObj));
```

Posto plitka kopija pravi znatno manje problema, ES6 je dodao metodu Object.assign(..); Kao parametre prihvata ciljni objekat, praceno sa jednim ili vise izvornih objekata.

```js
var newObj = Object.assign({}, myObj);
newObj.a; // 2
newObj.b == anotherObject; // true
newObj.c == anotherArr; // true
newObj.d == anotherFunction; // true
```

### Deskriptori svojstava

Pre ES5 nije se moglo upravljati karakteristikama vrednosti svojstava (read-only, read-write...).<br>
Od ES5 sva svojstva se opisuju pomocu **desriptora svojstava** (property descriptor).

```js
var myObj = {
  a: 2,
};

Object.getOwnPropertyDescriptor(myObj, "a");
// {
//  configurable: true
//  enumerable: true
//  value: 2
//  writable: true
// }
```

Svojstvo objekta ne predstavlja samo vrednost 2, vec pored toga i tri karakteristike: _configurable_, _enumerable_ i _writable_.<br>
Ako _configurable: true_ => mozemo menjati karakteristike.<br>

```js
var myObj = {};

Object.defineProperty(myObj, "a", {
  value: 2,
  writable: true,
  configurable: true,
  enumerable: true,
});

myObj.a; // 2
```

Eksplicitni nacin definisanja svojstava, ne koristi se cesto, vec samo kada se menjaju karakteristike.

#### Karakteristika Writable

Kada se postavi na _false_, jednom zadata vrednost se ne moze menjati.

```js
var myObj = {};

Object.defineProperty(myObj, "a", {
  value: 2,
  writable: false,
  configurable: true,
  enumerable: true,
});

myObj.a = 3;
myObj.a; // 2
```

Kada je program u strikton rezimu, izbaci ce TypeError prilikom pokusaja menjanja vrednosti.

```js
var myObj = {};

Object.defineProperty(myObj, "a", {
  value: 2,
  writable: false,
  configurable: true,
  enumerable: true,
});

myObj.a = 3; // TypeError
```

#### Karakteristika Configurable

Kada se configurable prebaci na vrednost _false_ zakljucavaju se vrednosti ostale dve karakteristike (enumeable, writable).

> Izuzetak je writable; kada je true, moze se prebaciti u false, ali se nakon toga ne moze vratiti na true

```js
var myObj = {};
myObj.a = 3;
myObj.a; // 3

Object.defineProperty(myObj, "a", {
  value: 4,
  writable: true,
  configurable: false,
  enumerable: true,
});

myObj.a; // 4
myObj.a = 5;
myObj.a; // 5

Object.defineProperty(myObj, "a", {
  value: 4,
  writable: true,
  configurable: true, // pokusao sam da vratim vrednost na true
  enumerable: true,
});
// TypeError
```

Upozorenje: menjanje _configurable: false_ je jednosmerna akcija koja se ne moze ponistiti!<br>
"Utisava" koriscenje _delete_ nad svojstvima, ako je podeseno _configurable: false_.

```js
var myObj = {
  a: 2,
};
myObj.a; // 2
delete myObj.a;
myObj.a; // undefined

Object.defineProperty(myObj, "a", {
  value: 3,
  writable: true,
  configurable: false,
  enumerable: true,
});

myObj.a; // 3
delete myObj.a;
myObj.a; // 3
```

Funkcija delete se koristi za uklanjanje svojstva samog objekta.<br>
Ukoliko sa funkcijom delete izbrisemo neku referencu na objekat/funkciju, cistac smeca sledecim izvrsavanjem brise reference na taj prethodno povezani objake/funkciju.<br>

#### Karakteristika Enumerable

Ova karakteristika dozvoljava vrednostima svojstava da se pojavljuju u petljama.<br>
Ukoliko podesimo _enumerable: false_ ukidamo mogucnost koriscenja tog svojstva u petljama (npr: for..in petlji). Ali iako podesimo ovu karakteristiku, jos uvek mozemo pristupati vrednosti svojstva.

### Nepromenljivost

Kako bi svojstva nekog objekta ucinili nepromenljivima postoji vise metoda:

1. Objektna konstanta<br>
   Definisemo svojstvo sa metodom defineProperty, u kojem cemo zadati _value:(neka vrednost)_, _writable: false_, _configurable:false_
2. Sprecavanje dopunjavanja objekta<br>
   Metoda preventExtensions(object) sprecava dodavanje novih svojstava.

```js
var obj = {
  a: 2,
};
Object.preventExtensions(obj);
obj.b = 4;
obj.b; // undefined; ako je striktni rezim, rezultuje TypeError
```

3. Zapecacivanje objekta<br>
   Object.seal(object) u sebi poziva funkciju preventExtensions(...) (ne mogu se dodavati svojstva), a karakteristiku _configurable_ postojecih svojstava menja u _false_. Dozvoljava menjanje vrednosti postojecih svojstava.

4. Zamrzavanje objekta<br>
   Najvisi nivo nepromenljivosti objekta. Object.freeze(object) u sebi poziva Object.seal(...) i svojstvima menja karakt _writable_ na _false_.

### Operacija [[Get]]

Operacija [[Get]] je ustvari ugradjena funkcija u svaki objekat. Pomaze prilikom pristupanja vrednosti neke promenljive.

```js
var obj = {
  a: 2,
};
obj.a; // 2
obj.b; // undefined
```

Kada nema identifikatora koji pretrazujemo funkcija [[Get]] vraca _undefined_.

### Operacija [[Put]]

Posto postoji operacija za citanje vrednosti, tako mora postojati operacija i za dodeljivanje tih vrednosti. Funkcija [[Put]] prilikom dodeljivanja vrednosti proverava vise cinilaca:

1. Ako je svojstvo kojem dodeljuje vrednost deskriptor prisutne funkcije poziva se funkcija za dodeljivanje vrednosti (ukoliko postoji)
2. Ako je svojstvo deskriptor podatakagde je _writable: false_ izvrsavanje operacije _put_ se prekida u tisini (ako nije ukljucen striktni rezim), ili vraca TypeError (ako je striktni rezim ukljucen).
3. U ostalim slucajevima vrednost postojeceg svojstva menja se na uobicajan nacin.

Ako svojstvo ne postoji u objektu, onda operacija [[Put]] postaje jos slozenija. (razmatra se u poglavlju 13)

### Ucitavanje i zadavanje vrednosti svojstava

ES5 je uveo nov nacin definisanja svojstva pomocu funkcije za ucitavanje (getter) i funkcije za zadavanje (setter).Ove funkcije pozivaju skrivene funkcije koje ucitavaju / zadaju vrednost. Prilikom definisanja deskriptora svojstva uz pomoc funkcije getter ili setter zanemaruju se deskriptori _value_ i _writable_.

```js
var obj = {
  get a() {
    return 2;
  },
};

Object.defineProperty(obj, "b", {
  // deskriptor svojstva
  get: function () {
    // definicija funkcije za ucitavanje svojstva "b"
    return this.a * 2;
  },
  enumerable: true, // omogucava da "b" bude vidljivo kao svojstvo objekta
});

Object.defineProperty(obj, "c", {
  get: function () {
    return 6;
  },
  enumerable: true,
});

console.log(obj); //Object { a: Getter, b: Getter, c: Getter }
obj.a; // 2
obj.b; // 4
obj.c; // 6
```

```js
var obj = {
  a: 2,
};

Object.defineProperty(obj, "b", {
  get: function () {
    return this.a * 2;
  },
  enumerable: true,
});

console.log(obj); // Object { a: 2, b: Getter };
obj.a; // 2
obj.b; // 4
```

```js
var obj = {
  get a() {
    return 2;
  },
};

obj.a = 3;
obj.a; // 2
```

Svojstvu a je definisana funkcija za ucitavanje,ako pokusamo da joj dodelimo vrednost operacija ce se izvrisiti u tisini.

```js
var obj = {
  // ucitava svojstvo a
  get a() {
    return this._a_;
  },
  // zadaje svojstvo a
  set a(value) {
    this._a_ = value * 2;
  },
};

obj.a = 2;
obj.a; // 4
```

> U fazi razmatranja, jer ne razumem
