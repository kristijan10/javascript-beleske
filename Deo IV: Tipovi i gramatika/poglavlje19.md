# Gramatika

Gramatika JS-a je struktuisan nacin opisivanja kako se elementi sintakse medjusovno uklapaju u pravilno formatirane i ispravne programe.

## Iskazi i izrazi

Izraz moze biti iskaz, ali obrnuto ne moze.

Prost primer da bi razlikovao:

3*5 - izraz

var a = 3\*5; - iskaz (deklaracioni; 3\*5 je izraz)

var b = a; - iskaz (a je ovde izraz)

### Zavrsne vrednosti iskaza

Prilikom izvrsavanja iskaza u konzoli citaca veba bice vracena neka vrendnost.

```js
var a = 42;
// undefined
```

Taj undefined koji se vraca je povratna vrednost koja se vraca iz algoritma koji se koristi za "postavljanje" te promenljive.

>Taj algoritam ustvari vraca znakovni niz s imenom deklarisane vrednosti

Zavrsna vrednost svakog standardnom bloka { .. } je vrednost poslednjeg iskaza/izraza koji taj blok sadrzi.

```js
var b;

if(true) b = 42;
// 42
```

Konzola ce ispisati vracenu vrednost - 42.

~~Pomisao je da se ta vrednost moze zadati nekoj drugoj promenljivoj.~~

```js
var a, b

a = if(true) b = 42; // ovaj izraz ce u konzoli ispisati 42, ali je nece dodeliti kao vrednost

// ISPRAVLJENO JE, SADA PRIJAVLJUJE SINTAKSNU GRESKU!!!!!!!!
```

### Sporedni efekti izraza

Uglavnom prilikom deklarisanja promenljivih izrazi nemaju nekih sporednih efekata.

```js
var a = 42;
var b = a + 3;
```

Ali se ti sporedni efekti pocnu pojavljivati ako ih ne koristimo kako treba prilikom pozivanja funkcija.

```js
function foo(){
   a = a + 1;
}

var a = 2;
foo(); // undefined, sporedni efekat promenjeno a (3)
```

Medjutim, postoje i drugi izrazi sa sporednim efektima:

```js
var a = 42;
var b = a++; // 42, sporedan efekat promenjeno a (43)
```

Unarni operatori ++ i -- se mogu zadati na **postfiksnom (iza)** ili na **prefiksnom (ispred)** polozaju.

```js
a++; // 42
a; // 43

++a; // 44
a; // 44
```

Kada se ++ zada na prefiksnom (++a) polozaju njegov sporedni efekat (inkrementiranje) se izvrsava pre nego sto se vrednost vrati iz izraza. U slucaju kada je ++ na postfiksnom (a++) polozaju tada se prvo vraca vrednost u izraz pa se izvrsava inkrementacija.

Postoji i mogucnost nadovezivanja vise iskaza u jedan:

```js
var a = 42;
var b = (a++, a);

a; // 43
b; // 43
```
