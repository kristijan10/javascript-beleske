# Leksicki opseg vidljivosti

Postoje dve vrste opsega vidljivosti, a to su:

1. leksicki
2. dinamicki

JavaScript koristi leksicki opseg vidljivosti, dok neki jezici kao sto su Perl i jezici za ljudski Bash.

## Vreme za lekseme

Prva faza kompajliranja koda jeste razlaganje na tokene (lekseme). Ta faza je razlog zbog kojeg je ova vrsta opsega vidljivosti dobila ime.

Naime, leksicki opseg vidljivosti je onaj koji se utvrdi leksickom analizom (odnosno, fazom razlaganja na tokene). Zavisi od mesta na kojem smo postavili promenljive i definisali blokove opsega vidljivosti.

```js
funcion foo(a){
    var b = a * 2;
    function bar(c){
        console.log(a, b, c);
    }
    bar(b * 3);
}
foo(2); // 2, 4, 12
```

> Postoje tri opsega vidljivosti
>
> Jedan okruzuje funkciju bar, i sadrzi promenljivu c
>
> Drugi (vislji) okruzuje funkciju foo, sadrzi promenljive a, b, bar
>
> Treci, i poslednji, globalni opseg, sadrzi promenljivu foo

### Pretrazivanje opsega vidljivosti

U prethodnom primeru koda, masina izvrsava console.log(..) i trazi tri promenljive a, b, c. Pretragu krece od najnizeg opsega vidljivosti (funkcije bar) gde ne nalazi referencu a. Krece prema visljem nivou, sto je opseg vidljivosti funkcije foo, gde nalazi promenljivu a. Tako isto i za b i c. Da je postojala deklarisana promenljiva c i u opsegu vidljivosti funkcije bar(..) a i u opsegu funkcije foo(..), uvek bi koristila vrednost definisane promenljive iz opsega vidljivosti funkcije bar(..).

_Zaklanjanje_ (shadowing):

```js
var a = 2;
function foo() {
  var a = 3; // <- zaklanjanje
  console.log(a);
}
foo(); // 3
```

Leksicki opseg vidljivosti se formira fiksno tamo gde je funkcija deklarisana, bez obzira na kom mestu je pozvana.

## Varanje sa leksickim opsegom

Postoje dva mehanizma koja omogucavaju menjanje leksickom opsega vidljivosti tokom izvrsavanja koda. Ne preporucuje se koriscenje ovih mehanizama jer usporavaju izvrsavanje koda, sto dovodi do slabijih performansi.

### Funkcija eval

Obradjuje niz znakova koji su joj prosledjeni kao parametar.

```js
function foo(str, a){
  eval(str); // <- Na ovo mesto se ubacuje kod koji se napise kao parametar tipa string (bas kao da pises js kod)
  console.log(a, b);
}

var b = 2;
foo("var b = 3", 1); // 1 3
foo("function bar(){console.log("Radi i ovo")};bar()", 1); // Radi i ovo /n 1 2 (2 se prikazuje jer ima globalna promenljiva b)
```

Ono sto eval radi zapravo je sledece:

Kada postavimo kljucno rec eval, kao parametar mu prosledjujemo kod koji bi pisali na tom mestu. Ako ti treba funkcija, neka nova promenljiva samo to napises kao parametar funkcije eval i ona ce utisnuti taj kod u vec napisan kod. Uglavnom se koristi za izvrsavanje dinamicki generisanog koda, jer dinamicko izvrsavanje statickog koda (kao sto je ovde primer var b = 3) nema nikakve prednosti nego da smo napisali taj kod bez funkcije eval.

Kada definisemo neku promenljivu funkcijom eval mi menjamo opseg vidljivosti tekuce funkcije u kojoj se eval nalazi.

> Kada se funkcija eval koristi u striktom rezimu ona pravi svoj sopstveni opseg vidljivosti, pa ne utice na opseg okruzujuce funkcije
>
> ```js
> function foo(str) {
>   "use strict";
>   eval(str);
>   console.log(a); // ReferenceError: a is not defined
> }
> foo("var a = 2;");
> ```
>
> Slicno ponasanje funkciji eval moze se pronaci u funkcijama setTimeout i SetInterval, koje kao prvi argument mogu prihvatiti niz znakova, koji obradjuju na nacin na koji eval to radi.

```js
setTimeout("var a = 10;", 0);

console.log(a); // 10
```

**Preporuka je da se funkcija eval(..) ne upotrebljava u kodu**, iako ima opravdanog razloga za upotrebu sa dinamicki generisanim kodom, ali posto je ona izuzetno mala, najbolje je ne latiti se tog posla.

### Rezervisana rec with

Olaksava unosenje reference i njene vrednosti u promenljive tipa object.

```js
var obj = {
  a: 1,
  b: 2,
  c: 3,
};
obj.a = 2;
obj.b = 3;
obj.c = 4;
// "laksi" nacin
with (obj) {
  a = 2;
  b = 3;
  c = 4;
}
```

```js
function foo(obj){
  with(obj){
    a = 2;
  }
}

var o1 = {
  a: 3;
}

var o2 = {
  b: 1;
}

foo(o1);
console.log(o1.a); // 2

foo(o2);
console.log(o2.a); // undefined
console.log(a); // 2
```

> Napravljena je globalna promenljiva a.
>
> Razlog tome je sto u objektu o2 ne postoji definisana promenljiva a koju bi with mogla da promeni, trazi u visljem opsegu (funkcije foo), gde je isto ne nalazi, pa stize do globalnog opsega gde isto ne nalazi promenljivu a.
>
> Posto je nije nasao, striktni rezim nije ukljucen, pravi se nova, globalna promenljiva a = 2.

### Performanse

Funkcija eval i with menjaju leksicki opseg vidljivosti u toku izvrsavanja koda tako sto definisu nov ili menjaju vec postojeci opseg vidljivosti.
Posto u masini JS-a postoje vise optimizacija, a jedna od njih jeste pronalazenje definisanih promenljivih i funkcija jer je tokom izvsavanja koda potrebno manje napora da pronadje vrednosti istih promenljivih. Ali kada masina naidje na eval ili with, moze da pretpostavi da sve sto je saznala o trenutim promenljivima moze biti netacno, iz razloga sto se sa eval i with menjaju opsezi vidljivosti i dodaju nove promenljive u toku izvrsavanja koda, pa se kod ne moze bas dobro optimizovati, sto trpi na performansama. Masina u ovom slucaju ne vrsi optimizacu koda, jer gubi svrhu.

## Sazetak poglavlja

Leksicki opseg vidljivosti znaci da je opseg vidljivosti definisan u vreme pisanja koda na osnovu odluka autora u vezi s deklaracijama funkcija. Leksicka analiza tokom faze kompajliranja koda uglavnom moze da odredi gde su i kako definisani svi identifikatori u programu, pa zato i da predvidi kako ce se oni traziti tokom izvrsavanja koda.

Dva mehanizma u JavaScript-u mogu da omoguce "varanje" sa leksickim opsegom vidljivosti:

- _eval(..)_
- _with_

_eval(..)_ moze da (u vreme izvrsavanja koda) izmeni postojeci leksicki opseg vidljivosti tako sto izvrsava "kod" zadat u obliku niza znakova koji sadrze jednu ili vise deklaracija.

_with_ pravi novi opseg vidljivosti (u toku izvrsavanja koda) tako sto referencu na objekat tretira kao da je opseg vidljivosti a svojstva objekta kao identifikatore unutar tog opsega.

Losa strana tih mehanizama je sto onemogucava masini jezika da tokom kompajliranja koda optimizuje pretrazivanje opsega vidljivosti. Posledica je da ce kod raditi sporije. Zato ih nemoj koristiti!
