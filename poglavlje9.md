# Ovo ili ono?

This je mehanizam koji zbunjuje mnoge programere. To je specijalan identifikator koji se automatski definise u opsegu vidljivosti svake funkcije.

## Cemu sluzi this?

```js
function identify(){
  return this.name;
}

function speak(){
  var greeting = "Hi, I'm " + identify.call(this);
  console.log(greeting);
}

var me = {
  name: "kristijan";
}

speak(me);
```

Mehanizam this pruza elegantan nacin da imlicitno prosledino referencu na odredjeni objekat.<br>
Poredjenje sa:

```js
function identify(context) {
  return context.name;
}

function speak(context) {
  var greeting = "Hi, I'm " + identify(context);
  console.log(greeting);
}

speak(me); // Hi, I'm kristijan
```

## Zbrka zbog this

Dva najcesce shvacena, ali pogresna, nacina povezivanja this na koje programeri shvataju:

### this predstavlja samu funkciju

```js
function foo(num) {
  console.log("foo: " + num);
  this.count++; // this ne moze da referencira na identifikator unutar same funkcije, zato se i desila greska
}

foo.count = 0;

for (var i = 0; i < 10; i++) {
  if (i > 5) foo(i);
  /* foo: 6
   * foo: 7
   * foo: 8
   * foo: 9
   */
}

console.log(foo.count); // 0; funkcija foo, kao sto mozemo videti je pozvana 4 puta, ali se count (brojac) nije promenio
```

> Ono sto se dogodilo je sledece:<br>
> posto this u funkciji upucuje na globalni window objekat, u kojem masina nije mogla da nadje promenljivu count, ona ga je sama napravila, posto nije ukljucen striktni rezum<br>
> napravila ga je, a za vrednost stavila NaN iz razloga sto nije postavljena vrednost, nego je _nesto_ inkrementirano

Mnogi programeri, kako bi resili problem uradili bi sledece:

```js
function foo(num) {
  console.log("foo: " + num);
  data.count++;
}

var data = {
  count: 0,
};

for (var i = 0; i < 10; i++) {
  if (i > 5) foo(i);
}

console.log(data.count); // 4
```

Ali ono sto rade je to da zaobilaze mnogo veci problem nerazumavanja this mehanizma.<br>
Ili bi umesto this referencirali samu funkciju:

```js
function foo(num) {
  console.log("foo: " + num);
  foo.count++;
}

foo.count = 0;

for (var i = 0; i < 10; i++) {
  if (i > 5) foo(i);
}

console.log(foo.count); // 4
```

Ali opet, zaobilazimo mehanizam this i koristimo se sa onim sto nam je poznato - leksicki opseg vidljivosti.<br>
Jos jedno moguce resenje je da podesimo this da referencira na funkciju foo (sa foo.call());

```js
function foo(num) {
  console.log("foo: " + num);
  this.count++;
}

foo.count = 0;

for (var i = 0; i < 10; i++) {
  if (i > 5) foo.call(foo, i); //
}

console.log(foo.count); // 4
```

### opseg vidljivosti na koji se odnosi this

this ni na koji nacin ne moze da referencira opseg vidljivosti funkcije.<br>
Iako je opseg vidljivosti jedan vid objekta, ali on je dostupan samo masini jezika, ne kodu.

```js
function foo(
  var a = 2;
  this.bar();
)

function bar(){
  console.log(a);
}

foo(); // ReferenceError: a nije definisano
```

Povezivanje opsega vidljivosti funkcija bar i foo nije moguc. Ne postoji most. I nemoguce ga je napraviti sa identifikatorom this.

## Sta je this?

This se povezuje prilikom izvrsavanja programa, ne tokom njegovog pisanja. funkcinise na nacin dinamickog opsega vidljivosti.<br>
Nije mu bitno gde je deklarisana funkcija vec kako je pozvana.<br>
Prilikom pozivanja funkcije stvara se stablo pozivanja. U tom stablu sadrze se informacije o tome kako je funkcija pozvana, a i informacija o tome na sta this ukazuje.
