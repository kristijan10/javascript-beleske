# Leksicki opseg vidljivosti

Postoje dve vrste opsega vidljivosti, a to su:

1. leksicki
2. dinamicki

JavaScript koristi leksicki opseg vidljivosti, dok neki jezici kao sto su Perl i jezici za ljudski Bash.

## Vreme za lekseme

Prva faza kompajliranja koda jeste razlaganje na tokene (lekseme). Ta faza je razlog zbog kojeg je ova vrsta opsega vidljivosti dobila ime.<br>
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

> Postoje tri opsega vidljivosti<br>
> Jedan okruzuje funkciju bar, i sadrzi promenljivu c<br>
> Drugi (vislji) okruzuje funkciju foo, sadrzi promenljive a, b, bar<br>
> Treci, i poslednji, globalni opseg, sadrzi promenljivu foo

### Pretrazivanje opsega vidljivosti

U prethodnom primeru koda, masina izvrsava console.log(..) i trazi tri promenljive a, b, c. Pretragu krece od najnizeg opsega vidljivosti (funkcije bar) gde ne nalazi referencu a. Krece prema visljem nivou, sto je opseg vidljivosti funkcije foo, gde nalazi promenljivu a. Tako isto i za b i c. Da je postojala deklarisana promenljiva c i u opsegu vidljivosti funkcije bar(..) a i u opsegu funkcije foo(..), uvek bi koristila vrednost definisane promenljive iz opsega vidljivosti funkcije bar(..).<br>
_*Zaklanjanje*_ (shadowing):

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
