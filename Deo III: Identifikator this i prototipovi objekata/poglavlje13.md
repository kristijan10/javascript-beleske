# Prototipovi

## Svojstvo [[Prototype]]

Svi objekti imaju interno svojstvo [[Prototype]] i cija vrednost je obicna referenca na neki drugi objekat.

```js
var myObj = {
  a: 2
}

myObj.a; // 2
```

Operacija [[Get]], koja se izvrsava kada referenciramo neko svojstvo objekta, kao sto je _myObj.a_.
Prvi korak je utvrdjivanje da li objekat sadrzi trazeno svojstvo, ako ga ima to se i koristi.
A ako [[Get]] operacija ne nadje trazeno svojstvo, ono nastavlja da sledi [[Prototype]] vezu ka drugom objektu.

```js
var anotherObj = {
  a: 2;
}

// pravi objekat povezan sa objektom 'anotherObj'
var myObj = Object.create(anotherObj);

myObj.a; // 2
```

Ovim postupkom dobijamo objekat _myObj_ koji je kroz svoje svojstvo [[Prototype]] povezans objektom _anotherObj_

**Ako _anotherObj_ ne bi imao svojstvo _a_, koje trazimo, [[Get]] operator bi trazio dalje kroz [[Prototype]] lanac** povezanih objekata da li se negde nalazi trazeno svojstvo.

Ako operator [[Get]] prodje ceo [[Protoype]] lanac, a **ne nadje trazeno svojstvo, operator vraca vrednost _undefined_**.

Slicna pretraga se dogadja kada petljom _for..in_ prolazimo kroz objekat.

```js
var anotherObj = {a:2};

var myObj = Object.create(anotherObj);

for(var k in myObj){
  console.log("ima svojstvo: " + k);
};
// ima svojstvo: a

("a" in myObj); // true
```

Kada trazim imena svojstava, bez obzira na oblik kojim to izvodim, uvek se pretrazuje [[Prototype]] lanac, veza po veza. Pretraga se prekida kada se nadje svojstvo ili ako se lanac zavrsi.

### Objekat Object.prototype

Pocetak svakog normalnog [[Prototype]] lanca je ugradjeni objekat _Object.prototype_. On sadrzi vise raznih funkcija koje se koriste u celom JS-u, zato sto svi _normalni objekti_ (oni ugradjeni, ne spoljasnji specifinci za radno okruzenje) poticu od _Object.prototype_ objekta.

### Zadavanje i zaklanjanje svojstava

```js
myObj.foo = "bar";
```

Ako objekat _myObj_ vec sadrzi svojstvo pod imenom _foo_, ova linija koda ce samo izmeniti vrednost tog svojstva.

Ako svojstvo _foo_ ne postoji u objektu _myObj_, a daljim ispitivanjem ni u [[Prototype]] lancu, svojstvo _foo_ sa vrednoscu se direktno dodaje u objekat _myObj_.

**Zaklanjanje** - ako svojstvo istog imena postoji i u samom objektu a i u visim nivoima [[Prototype]] lanca.

>Svojsto _foo_, koje postoji u objektu _myObj_, zaklanja svaku drugu definicu istog tog svojstva u visim nivoima lanca

Kada masina stigne do linije koda napisane u primeru, ako objekat direktno ne sadrzi svojstvo _foo_, vec se ono pojavljuje u lancu, tada:

1) Ako u lancu postoji svojstvo za pristupanje podacima koje se zove _foo_ i nije podeseno kao svojstvo samo za citanje (_writable: true_), objektu _myObj_ se direktno dodaje novo svojstvo _foo_, sto rezultuje zaklanjanju.
2) Ako u lancu postoji svojstvo _foo_ ali je oznaceno kao svojstvo samo za citanje (_writable: false_), onda se ne moze ni napraviti novo svojstvo direktno u objektu _myObj_, a niti se moze redefinisati postojece svojstvo. Ako kod radi u striktnom rezimu, generise se greska, u suprotnom greska se zanemaruje u tisini.
3) Ako svojstvo _foo_ postoji u lancu i pridruzena mu je samo funkcija za dodeljivanje vrednosti, ta funkcija se uvek poziva. Objektu _myObj_ se ne dodaje svojstvo _foo_ niti se redefinise funkcija _foo_ za zadavanje vrednosti svojstava.

>Nisam razumeo na sta se misli kao svojstvo za pristupanje podacima, ali sam otkrio da je to _[[Get]]_
>
>A kao funkcija za dodeljivanje vrednosti _[[Put]]_

Zaklanjanje vec postojeceg svojstva u objektu je, linijom koda u primeru, moguce samo u slucaju 1).

Ako bi zeleli da zaklonimo svojstvo ako smo u situaciji opisanoj u 2) i 3), tada mozemo da to uraditi samo rucnim dodavanjem svojstva objektu.

>Object.defineProperty(...);

Zaklanjanje je suvise slozeno, pa bi ga trebalo izbegavati.

Primer implicitnog zaklanjanja:

```js
var anotherObj = {
  a: 2
};

var myObj = Object.create(anotherObj);

anotherObj.a; // 2
myObj.a; // 2

anotherObj.hasOwnProperty("a"); // true
myObj.hasOwnProperty("a"); // false

myObj.a++; // implicitno zaklanjanje

anotherObj.a; // 2
myObj.a; // 3

myObj.hasOwnProperty("a"); // true
```

Operacija ++ ekvivalenta je operaciji _myObj.a = myObj.a + 1_. Rezultat je pretraga operacije [[Get]] za svojstvom _a_, koje pronalazi u lancu, a zatim je ovo primer 1), inkrementira se nadjena vrednost svojstva i operacija [[Put]] postavlja vrednost direktno u objekat _myObj_, sto dovodi do zaklanjanja.

## "Klasa"

JavaScript nema apstraktne modele koji se zovu klase, on ima samo objekte.

U JS-u ne mogu opisati sta jedan objekat moze da radi, jer on sam definise sopstveno ponasanje.
