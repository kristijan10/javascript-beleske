# Ogradjivanje opsega vidljivosti

## Prosvetljenje

U JavaScriptu ograde su ono nas,treba samo da ih prepoznamo i prihvatimo.<br>
Nastaju kao rezultat pisanja koda koji se zasniva na leksickom opsegu. Jednostavno se stvaraju bez ikakvih naznaka. Na nama je da ih prepoznamo i prihvatimo.<br>

## Osnovne cinjenice

Ogradjujuca funkcija je ona koja je u stanju da zapamti svoj leksicki opseg vidljivosti i da mu pristupa cak i kada se izvrsava izvan njega.<br>

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

> Pozivom foo funkcije mi dobijamo referencu na unutrasnju funkciju.<br>
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

**Bez obzira na nacin na koji transportujemo unutrasnju funkciju izvan njenog leksickog opsega vidljivosti, ona ce zadrzati referencu na svoj opseg vidljivosti u kojem je bila izvorno deklarasana**

## Sada jasno vidim

```js
function wait(message) {
  setTimeout(function timer() {
    console.log(message);
  }, 1000);
}
wait("Ovo ogradjujem");
```

Primer ograde. Unutrasnja funkcija _timer_, nalazi se u funkciji _setTimeout_. Funkcija _timer_ koristi parametar koji prosledimo ogradjujucoj funkciji _wait_.<br>

Iako se prica da je IIFE primer ograda, autor se sa time ne slaze. IIFE funkcije prave zaseban, sopstveni opseg vidljivosti, ali se izvrsavaju u opsegu vidljivosti u kojem su i napisane. One su pozevane sa ogradama, ali ih ne formiraju.

## Petlje i ograde

```js
for (var i = 0; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i); // 6 *5
  }, i * 1000);
}
```

Dogodila se greska. Umesto ocekivanog 1, 2, ...5 dobili smo 6. Razlog je taj sto pretlja vrti sve dok i nije <=5. Prekida se kada je i = 6. Rezultat odrzava posledju vrednost i nakon prestanka pretlje.<br>
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

Promenljiva definisana sa let ce se svakom iteracijom menjati, za razliku od proemnljive definisane sa var, koja se podize. U svakoj iteraciji i ce poprimiti vrednost koju je imala na kraju prethodne iteracije.
