# Ogradjivanje opsega vidljivosti

## Prosvetljenje

U JavaScriptu ograde su ono nas,treba samo da ih prepoznamo i prihvatimo.

Nastaju kao rezultat pisanja koda koji se zasniva na leksickom opsegu. Jednostavno se stvaraju bez ikakvih naznaka. Na nama je da ih prepoznamo i prihvatimo.

## Osnovne cinjenice

Ogradjujuca funkcija je ona koja je u stanju da zapamti svoj leksicki opseg vidljivosti i da mu pristupa cak i kada se izvrsava izvan njega.

```js
function foo() {
  var a = 2;

  function bar() {
    console.log(a);
  }

  return bar;
}

foo(); // > function bar(){...}
var baz = foo();
baz();
```

> Pozivom foo funkcije mi dobijamo referencu na unutrasnju funkciju.
>
> Ali posto smo taj poziv funkcije foo dodelili nekoj promenljivoj, funkcijskim pozivom te promenljive ustvari mi izvrsavamo unutrasnju funkciju bar

Svaki od mnogobrojnih nacina na koje se funkcije mogu prosledjivati drugim funkcijama kao vrednost, a zatim njihovo pozivanje na drugim mestima je upotreba / formiranje ograda.

```js
function foo() {
  var a = 2;

  function baz() {
    console.log(a);
  }

  bar(baz);
}

function bar(fn) {
  fn();
}

foo(); // 2
```

Bez obzira na nacin na koji transportujemo unutrasnju funkciju izvan njenog leksickog opsega vidljivosti, ona ce zadrzati referencu na svoj opseg vidljivosti u kojem je bila izvorno deklarasana.

## Sada jasno vidim

```js
function wait(message) {
  setTimeout(function timer() {
    console.log(message);
  }, 1000);
}
wait("Ovo ogradjujem");
```

Primer ograde. Unutrasnja funkcija _timer_, nalazi se u funkciji _setTimeout_. Funkcija _timer_ koristi parametar koji prosledimo ogradjujucoj funkciji _wait_.

Iako se prica da je IIFE primer ograda, autor se sa time ne slaze. IIFE funkcije prave zaseban, sopstveni opseg vidljivosti, ali se izvrsavaju u opsegu vidljivosti u kojem su i napisane. One su pozevane sa ogradama, ali ih ne formiraju.

## Petlje i ograde

```js
for (var i = 0; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i); // 6 *5
  }, i * 1000);
}
```

Dogodila se greska. Umesto ocekivanog 1, 2, ...5 dobili smo 6. Razlog je taj sto pretlja vrti sve dok i nije <=5. Prekida se kada je i = 6. Rezultat odrzava posledju vrednost i nakon prestanka pretlje.

Kako bi ispravili to, potreban nam je zaseban opseg vidljivosti, koji ce sadrzati referencu na parametar i, koji ce se menjati, pa i dodati identifikatoru u unutrasnjem opsegu vidljivosti, koji cemo naprviti uz pomoc IIFE funkcije.

```js
for (var i = 1; i <= 5; i++) {
  (function () {
    var j = i;
    setTimeout(function timer() {
      console.log(j);
    }, j * 1000);
  })();
}
```

### Ponovo o opsegu vidljivosti velicine bloka

Videli smo da je prethodnom primeru potreban zaseban opseg vidljivosti, koji smo postigli IIFE funkcijom. Bolje i krace resenje bi bilo upotrebom opsega vidljivosti velicine bloka, koje se postize rezervisanom recju _let_.

```js
for (let i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, i * 1000);
}
```

Promenljiva definisana sa let ce se svakom iteracijom menjati, za razliku od promenljive definisane sa var, koja se podize. U svakoj iteraciji i ce poprimiti vrednost koju je imala na kraju prethodne iteracije.

## Moduli

```js
function module() {
  var something = "cool";
  var another = [1, 2, 3];

  function doSomething() {
    console.log(something);
  }

  function doAnother() {
    console.log(another.join(" ! "));
  }
  return {
    doSomething: doSomething,
    doAnother: doAnother,
  };
}
var foo = module();
foo.doSomething(); // cool
foo.doAnother(); // 1 ! 2 ! 3
module().doSomething(); // cool
```

> Pozivanjem funkcije module pravimo instancu modula, kako bi mogli da pristupimo vrednostima vracenog objekta

Kako bi nesto bilo modul mora ispuniti sledece:

1. Mora postojati spoljasnja, okruzujuca, funkcija koja se poziva makar jedanput (svaki poziv pravi novu instancu modula)
2. Ta okruzujuca mora vracati barem jednu internu funkciju, koja ogradjuje unutrasnji privatni opseg vidljivosti i moze da pristupa tom privatnom stanju modula i/ili da ga menja

Objekat koji stavlja na raspolaganje samo funkciju za pristupanje odredjenom svojstvu nije modul. Objekat koji vraca funkciju nakon pozivanja i koji ima samo svojstva koja predstavljaju podatke ali ne i interne ogradjujuce funkcije, nije modul.

Gore naveden primer mozes pozivati bezbroj puta, i svaki put se pravi nova instanca. Ali ako ti treba unikatan modul, onda se to postize na sledeci nacin:

```js
var foo = (function module() {
  var something = "cool";
  var another = [1, 2, 3];

  function doSomething() {
    console.log(something);
  }

  function doAnother() {
    console.log(another.join(" ! "));
  }

  return {
    doSomething: doSomething,
    doAnother: doAnother,
  };
})();

foo.doSomething(); // cool
foo.doAnother(); // 1 ! 2 ! 3
```

Posto su moduli obicne funkcije, mogu imati parametre:

```js
function module(id) {
  function identify() {
    console.log(id);
  }

  return {
    identify: identify,
  };
}
var foo1 = module("foo1");
var foo2 = module("foo2");

foo1.identify(); // foo1
foo2.identify(); // foo2
```

Mocna varijanta koja se moze postici jeste da imenujemo objekat koji vracamo:

```js
var foo = (function module(id) {
  function identify1() {
    console.log(id);
  }
  function identify2() {
    console.log(id.toUpperCase());
  }
  function change() {
    // ovo sam ja izmenio kako bi moglo vise puta da se 'change'-uje
    if (publicAPI.identify == identify1) publicAPI.identify = identify2;
    else publicAPI.identify = identify1;
  }

  var publicAPI = {
    identify: identify1,
    change: change,
  };

  return publicAPI;
})("foo module");

foo.identify(); // foo module
foo.change();
foo.identify(); // FOO MODULE
foo.change(); //  ovo sam ja dodao, a i ovo ispod
foo.identify(); // foo module
```

### Savremeni moduli

```js
var myModules = (function Manager() {
  var modules = {};
  function define(name, deps, impl) {
    for (var i = 0; i < deps.lenght; i++) {
      deps[i] = modules[deps[i]];
    }
    modules[name] = impl.apply(impl, deps);
  }

  function get(name) {
    return modules[name];
  }

  return {
    define: define,
    get: get,
  };
})();

myModules.define("bar", [], function () {
  function hello(who) {
    return "Let me introduce: " + who;
  }

  return {
    hello: hello,
  };
});

myModules.define("foo", [bar], function (bar) {
  var hungry = "hippo";

  function awesome() {
    console.log(bar.hello(hungry).toUpperCase());
  }

  return {
    awesome: awesome,
  };
});

var bar = myModules.get("bar");
var foo = myModules.get("foo");
console.log(bar.hello("hippo")); // Let me introduce: hippo
foo.awesome(); // LET ME INTRODUCE: HIPPO
```

### Buduci moduli

ES6 je dodao sintaksnu podrsku konceptu modula. Jedna datoteka - jedan modul. Svaki modul moze da uvozi kompletne druge module ili pojedine clanove API-ja, kao i da izvozi svoje javne clanove API-ja.

```js
// bar.js
function hello(who){
  return "Let me introduce: " + who;
}

export hello;

// foo.js
import hello from 'bar'; // uvozi samo funkciju

var hungry = "hippo";

function awesome(){
  console.log(hello(hungry).toUpperCase());
}

export awesome;

// baz.js
module bar from 'bar'; // uvozi kompletne module (ceo kod);
module foo from 'foo';

console.log(bar.hello('rhino'));
foo.awesome();
```

_Import_ uvozi jedan ili vise clanova API-ja modula u opseg vidljivosti vezan za promenljivu (hello, awesome).

Operator _module_ uvozi ceo API modula i vezuje ga za promenljivu (bar, foo).

_Export_ izvozi zadati identifikator (promenljiva ili funkcija) iz javnog API-ja tekuceg modula.

## Sazetak poglavlja

Ogradjivanje nastaje kada je funkcija u stanju da zapamti svoj leksicki opseg vidljivosti i moze mu pristupiti cak i kada je pozvana izvan njega.

Za koriscenje modula. potrebne su nam dve kljucne karakteristike:

1) pozivanje spoljne okruzujuce funkcije, koja formira okruzujuci opseg vidljivosti
2) povratna vrednost te okruzujuce funkcije mora sadrzati referencu na barem jednu internu funkciju koja ogradjuje privatni unutrasnji opseg vidljivosti definisan okruzujucom funkcijom
