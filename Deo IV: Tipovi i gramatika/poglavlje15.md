# Tipovi

**Tip (engl. _type_)** - ugradjeni skup karakteristika koji jednoznacno identifikuje ponasanje date vrednosti i cini je razlicitom od drugih vrednosti.

## Tip pod bilo kojim drugim imenom

Kako bi bili sigurni u to da smo sigurno obavili konverziju iz jednog u drugi tip treba nam detaljno razumevanje kako do njih dolazi, kao i o opstim stvarima u vezi tipova i vrednosti

## Ugradjeni tipovi

Postoji sedam ugradjenih tipova:

1. undefinde
2. null
3. boolean
4. number
5. string
6. object
7. symbol

Prilikom ispitivanja kojeg je tipa _null_ JS vraca gresku, prikazuje ga kao _objekat_.

```js
typeof null === "object"; // true
```

Svi ostali tipovi prikazuju svoje odgovarajuce znakovne vrednosti.

Ako zelim da proverim da li je vrednost promenljive null, potreban mi je kombinovan uslov:

```js
var a = null;
!a && typeof a === "object"; // true
```

_null_ je jedina primitivna vrednost koja se ponasa kao _false_ a koja vraca rezultat _object_ kada se ispituje pomocu operatora _typeof_.

_typeof_ moze da vrati jednu od sedam znakovnih vrednosti: object, string, number, symbol, undefined, boolean, function

```js
typeof function a() {
  /*...*/
} === "function"; // true
```

Smatra se da je funkcija - objekat koji se poziva. On ima interno svojstvo [[Call]] koje mu omogucava da se poziva.

Duzina funkcije - koliko parametara funkcija prima.

```js
function a(b, c) {
  // ...
}

a.length; // 2
```

## Vrednosti kao tipovi

U JS-u promenljive nemaju tipove, vec su vrednosti te koje namecu kojeg tipa je promenljiva. Kada koristimo operator _typeof_ ispitujemo tip vrednosti te promenljive, ne ispitujemo tip promenljive.

### Razlike izmedju nedefinisane i nedeklarisane promenljive

Promenljive koje ne sadrze nikakvu vrednost zapravo sadrze vrednost tipa _undefined_.

```js
var a;

typeof a; // undefined
```

Nedefinisano ili nedeklarisano?

**Nedefinisano** - promenljiva je deklarisana u tekucem opsegu vidljivosti, ali joj nije zadata nikakva vrednost

**Nedeklarisano** - promenljiva ne postoji u tekucem opsegu vidljivosti.

```js
var a;

a; // undefined
b; // RefferenceError: b is not defined
```

E, al ono sto mozda i najvise dovodi programere u zbrku izmedju ta dva termina je:

```js
var a;

typeof a; // undefined
typeof b; // undefined
```

Iako promenljiva _b_ nije deklarisana u opsegu, operator _typeof_ vraca _undefined_. To je ugradjena zastita za operator; mogli su makar da razvoje slucaj kada promenljiva nema vrednost i kada ona uopste nije deklarisana.

### Operator _typeof_ i nedeklarisana promenljiva

Receno je da je ova greska namerno ubacena da se koristi kao zastita. Primer koriscenja bi bio npr. imam globalnu promenljivu koja mi je potrebna za pokretanje funkcija. Samim pozivom funkcije, u okruzenju gde se ne bi napravila globalna promenljiva, program bi izbacio gresku. Ali, ako proverimo da li ona postoji, i ako postoji da li je definisana kako bi mogli da je koristimo u pozivu, mozemo korisiti bas tu sigurnost:

```js
/*
// Ako je ovo undefine, ili ako ne postoji,
// ne bi se ni pokrenulo
*/
if (DEBUG) {
  console.log("Ukljuceno otkrivanje gresaka");
}

// bezbednost na prvom mestu! :)
if (typeof DEBUG !== "undefined") {
  console.log("Ukljuceno otkrivanje gresaka");
}
```

Ova vrsta provere korisna je i ako zelimo da proverimo da li postoji/definisana neko svojstvo/metoda:

```js
if(typeof atos === "undefined"){
  atos = function(){....}
}
```

```js
function doSomething(){
  var helper =
    (typeof FeatureXYZ === "undefined") ?
    FeatureXYZ : 
    function () {...};

  /*
  // postoji i drugacija sintaksa 
  // za isti ovaj pristup
  // takozvani "umetanje zavisnosti"
  // (engl. dependency injection)
  */
  var helper = FeatureXYZ || function() {...};
}
```

## Sazetak poglavlja

JavaScript ima vise ugradjenih tipova: null, undefined, object, number, string, boolean, symbol

Promenljive nemaju tipove, ali ih imaju vrednosti u promenljivima. Ti tipovi definisu ponasanja koja su svojstvena vrednostima. (koje metode se mogu koristiti nad tim vrednostima)

Mnogi programeri pretpostavljaju da su "nedefinisana" i "nedeklarisana" promenljiva otprilike isto, ali u JavaScriptu, to su dve sasvim razlicite stvari. Promenljiva koja nema vrednost zapravo ima vrednost _undefined_, a nedeklarisana promenljiva je ona promenljiva koja ne postoji u lokalnom opsegu vidljivosti.

Zbrci doprinosti to JavaScript na neki nacin brka ta dva pojma; za nedeklarisane promenljive izbacuje gresku "_ReferenceError: a is not defined_", kao i u vrednosima koje vraca prilikom ispitivanja operatorom _typeof_ (u oba slucaja vraca _undefined_).

Medjutim, zastitna uloga operatora _typeof_ moze biti od koristi.
