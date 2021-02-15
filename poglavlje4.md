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
  - Za AST vec navedenog primera _var a = 2_, se pretvara u masinski kod kojem je cilj da napravi promeljivu, da za nju rezervise mesto u memoriji i da zatim smesti zadatu vrednost toj istoj promenljivoj.

Kompajler JS-a nema dovoljno vremena ostavljenog kao i neki drugi kompajlirani jezici. Kompajlira se u sekundama (milisekundama) pre njegovog izvrsavanja.
