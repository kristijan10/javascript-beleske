# Dinamicki opseg vidljivosti

> Podsetnik:
>
> Leksicki opseg vidljivosti je skup pravila koja govore masini JS-a kako treba da trazi, kao i gde kako bi pronasla promenljive
>
> Definisan je tokom pisanja koda, osim ako nije varano sa eval() ili with

```js
function foo() {
  console.log(a); // 2
}

function bar() {
  var a = 3;
  foo();
}

var a = 2;
bar();
```

Leksickim opsegom vidljivosti, nakon pozivanja funkcije _bar()_, imamo referencu _a_ koja se deklarise i poprima vrednost 3. Zatim se poziva funkcija _foo()_. Posto u opsegu vidljivosti funkcije foo nije deklarisana promenljiva a, pretrazuje se u visljem nivou, gde i pronalazi globalnu promenljivu a.

Dinamicki opseg vidljivosti, za razliku od leksickog, definise se tokom izvrsavanja koda. JavaScript ne koristi dinamicki opseg vidljivosti, pa mozemo samo prikazati primer:

```js
function foo() {
  console.log(a); // 3
}

function bar() {
  var a = 3;
  foo();
}

var a = 2;
bar();
```

> Isti primer, ali ovog puta predstavlja kako funkcionise dinamicko odredjivanje opsega vidljivosti.

Kod dinamickog opsega vidljivosti bitno je _gde se funkcija poziva_, dok u leksickom _gde je funkcija deklarisana_.
Kada masina naidje na poziv funkcije bar ona deklarise identifikator a, kojem dodeli vrednost 3. Zatim poziva funkciju foo, koja ovog puta umesto da pretrazuje mesto na kojem je deklarisana pozvana funkcija, masina gleda stablo pozivanja funkcija, vidi da je pre foo pozvana funkcija bar (u kojoj je pozvana funkcija foo) i poretrazuje opseg vidljivosti mesta gde je pozvana funkcija foo. Tu je promenljiva a, sa vrednoscu 3, koja se loguje.

Iako JS ne koristi dinamicki opseg vidljivosti, postoji jedan mehanizam koji je usko povezan sa dinamickim odredjivanjem opsega. To je mehanizam **_this_**.
