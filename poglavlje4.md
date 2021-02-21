# Sta je opseg vidljivosti

Mogucnost cuvanja i modifikacija vrednosti promenljivih je ono sto odredjuje tekuce stanje programa.<br>
**Opseg vidljivosti (scope)** je skup pravila kojim se odreduje na kom mestu ce se sacuvati vrednost promenljive, kao i kasnije pronalazenje istih.<br>
Prilikom kompajliranja koda prolazi kroz tri koraka pre nego sto se taj isti kod izvrsi:

- Razlaganje na tokene / leksicka analiza

  - deljenje grupe znakova na celine koje imaju znacenje
  - ```js
    var a = 2;
    // tokeni su: var, a, =, 2, ; (pet tokena)
    ```

- Rasclanjivanje

  - rasporedjivanje tokena na stablo sa ugnjezdenim elementima
  - 'AST' (Abstract Syntax Tree), stablo sa ugnjezdenim elementima
  - Stablo za primer _var a = 2_ krece od najviseg nivoa, _VariableDeclaration_, koji ima dete _Identifier_ u koje se upisuje _*a*_, zatim on ima potomka _AssignmentExpression_ koji ima svog potomka _NumericLiteral_ kojem je vrednost _*2*_.

- Generisanje koda
  - Postupak pretvaranja AST-a u masinski kod.
  - Za AST vec navedenog primera _var a = 2_, se pretvara u masinski kod kojem je cilj da napravi promenljivu, da za nju rezervise mesto u memoriji i da zatim smesti zadatu vrednost toj istoj promenljivoj.

Kompajler JS-a nema dovoljno vremena ostavljenog kao neki drugi kompajlirani jezici. Kompajlira se u sekundama (milisekundama) pre njegovog izvrsavanja.

# Opis opsega vidljivosti

Dijalog koji opisu nacin funkcionisanja opsega vidljivosti:

### Uloge

- Masina jezika
  - odgovorna je za kompajliranje i izvrsavanje koda
- Kompajler
  - izvrsava rasclanjivanje i generise masinski kod
- Opseg vidljivosti
  - odrzava listu svih deklarisanih promenljivih i stara se da se postuju striktna pravila koja odredjuju koje promenljive su dostupne kojem delu izvrsnog koda

> Kako bi razumeli nacin rada JavaScripta moramo poceti razmisljati kao Masina i njeni prijatelji<br>
> Moramo postavljati ista pitanja i davati iste odgovore kao sto to Masina radi

### Ja tebi, ti meni

Na vec pomenuti primer var a = 2; Masina gleda kao dva iskaza. Jedan iskaz je onaj koji Kompajler obradjuje tokom kompaliranja, a drugi izraz koji Masina izvrsava.
<br>
**Tok pristupa izvrsavanju programa var a = 2;**<br>
Kompajler obavlja leksicku analizu u potrazi za tokenima, koje ce rascaliniti i podeliti na stablo.<br>
Prilikom generisanja koda Kompajler radi sledece:

1. Kada naidje na deklaraciju _var a_ pita Opseg vidljivosti da li na svojoj listi promenljivih ima identifikator a. Ako ima, Kompajler zanemaruje deklaraciju i nastavlja dalje. U suprotnom, Kompajler od Opsega vidljivosti zahteva da na svoju listu deklarise novu promenljivu cije je ime a.
2. Kompajler generise kod koji ce Masina kasnije izvrsiti. Kada Masina krene da izvrsava kod, prvo ce sebe upitati da li na svom listingu opsega vidljivosti postoji promenljiva imena a. Ako postoji, Masina nastavlja dalje izvrsavanje koda koristeci pronadjenu promenljivu. A ukoliko ne nadje, trazi ga na drugom mestu (ugnjezdeni opseg vidljivosti).

Ako Masina na kraju pronadje promenljivu a dodaje joj vrednost 2, u suprotnom, prijavljuje gresku.

**Ukratko**

- pri dodeljivanju vrednosti promenljivoj odvijaju se dve akcije:
  - Kompajler deklarise promenljivu (ako vec nije deklarisana) u tekucem Opsegu vidljivosti
  - pri izvrsavanju koda Masina prazi promenljivu unutar Opsega vidljivosti i dodeljuje joj vrednost, ako je nadje

## Terminologija kompajlera

LHS - lefthand side
RHS - righthand side

> Strane operacije dodeljivanja vrednosti promenljivoj
> Kada dodeljujemo vrednost nekoj promenljivoj tada se izvrsava LHS. Na primeru _var a = 2;_ dodeljujemo vrednost promenljivoj a, i Masina prilikom pretrage trazi sa leva na desno. Prvo vidi _var a_, kojem dodeli vrednost 2.<br>
> Suprotno ovome RHS se koristi kada zelimo da pristupimo vrednosti neke promenljive.
> Primer:

```js
var a = 2;
// Masina ovde identifikatoru dodeljuje vrednost, pa cita sa leve na desno
console.log(a);
// Masina pretrazuje vrednost promenljive a, ne dodeljuje nista
```

> Ko je odrediste u operaciji? - pitanje za LHS<br>
> Ko je izvor u operaciji? - pitanje za RHS

```js
function foo(a) {
  console.log(a); // 2
}

foo(2);
```

> Primer i LHS, a i RHS pretrazivanja<br>
> LHS, iako se ne primecuje, implicitno se desava sa foo(2) (a = 2)<br>
> RHS se desava prilikom pozivanja console.log(a), gde se pretrazuje vrednost promenljive a

### Razgovor izmedju Masine i Opsega vidljivosti

_Za primer:_

```js
function foo(a) {
  console.log(a);
}

foo(2);
```

Masina: obraca se Opsegu vidljivosti i trazi RHS referencu foo (RHS jer mu nema dodeljivanja vrednosti, vec mu treba vrednost)<br>
Opseg vidljivosti: Imam je, to je funkcija. _Prosledjuje blok koda na izvrsavanje_ <br>
Masina: _Izvrsava foo_<br>
Masina: Pita Opseg vidljivosti da li ima vrednost koju bi dodelila referenci a (parametru), RHS (jer se dodeljuje vrednost promenljivoj a)<br>
Opseg vidljivost: Da, kompajler ju je deklarisao kao parametar funkcije foo. _Predaje joj vrednost_<br>
Masina: _Dodeljuje 2 promenljivoj a_<br>
Masina: _Nailazi na console_, pa pita Opseg da li zna sta je to<br>
Opseg vidljivosti: Da, znam. To je ugradjena funkcija, evo ti blok koda koji sadrzi taj objekat<br>
Masina: _Pretrazuje log u obilju metoda_. Pronalazi i shvata da je to funkcija, uzima blok koda<br>
Masina: _Trazi od Opsega vidljivosti RHS referencu a_ (treba mu vrednost a kako bi izvrsio log())<br>
Opseg vidljivosti: To je ona ista promenljiva, nije se nista promenilo. _Prosledjuje vrednost promenljive a_<br>
Masina: Prosledjuje vrednost promenljive a, sto je 2, funkciji log(...)

#### Kviz

1. Napisi dijalog izmedju Masine i Opsega vidljivosti, ali ti glumi da si Masina

```js
function foo(a) {
  var b = a;
  return a + b;
}

var c = foo(2);
```

Masina: _Izvrsavam LHS referencu c, kojoj se dodeljuje vrednost foo()_. Trazim od Opsega vidljivosti RHS referencu foo.<br>
Opseg vidljivosti: Prosledjuje blok koda za foo, sto utvrdjuje da je funkcija.<br>
Masina: Izvrsavam funkciju foo. Trazim od Opsega LHS referencu a.<br>
Opseg vidljivosti: Nasao sam je, definisana je kao parametar funkcije foo. Prosledjuje vrednost 2.<br>
Masina: Dodeljujem vrednost 2 promenljivoj a. Trazim od Opsega LHS referencu b, kojoj se dodeljuje a. Pitam Opseg da li zna za a, sto je RHS (citanje vrednosti).<br>
Opseg vidljivosti: Da znam, to je ona ista promenljiva, nije se promenila, evo ti vrednost.<br>
Masina: Naisao sam na return, sto znaci da ne izvrsavam dalje blok koda, vec vracam neku vrednost pozivaocu funkcije. Proveravam sa Opsegom da li se promenila vrednost neke od promenljivih a i b, RHS \*2 (cita vrednost promenljivih a, pa b)<br>
Opseg vidljivosti: Ne, nisu se promenile, evo ti vrednosti.<br>
Masina: Izvrsava racunsku operaciju sabiranja dve vrednosti promenljivih a i b. Rezultat vraca mestu sa kojeg je pozvana, odnosno, dodeljuje vrednost sabiranja promenljivoj c.
