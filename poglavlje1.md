# Uvod

Prvi deo knjige je namenjen onima koji nisu imali dodira sa programiranjem, ali i onima koji zele da se podsete osnovnih stvari u vezi programiranja i razumevanja rada racunara.

## Programski kod

Program je sastavljen od skupa specijalnih naredbi koje racunaru govore sta treba da uradi.<br>
Sintaksa / racunarski jezik je skup pravila pisanja koje racunar razume. Kao i sa govornim jezikom; pravila pisanja reci, pravila sastavljanja gramaticko ispravnih recenica.

## Programski iskazi

Iskaz je svaka grupa reci, brojeva i operatora koja obavlja neku radnju.

```js
a = b * 2;
```

Ovaj izraz govori racunaru da ucita vrednost _b_, zatim je pomnozi sa _2_ i dobijeni rezultat cuva u promenljivoj _a_.

> _a_ i _b_ su promenljive; mogu se zamisliti kao kutije u kojima se mogu cuvati razne stvari.<br> >_2_ je vrednost, _literal_; pojavljije se samostalno i nije smestena u promenljivu.<br> > \*\*_ i _=\* su operatori; izvrsavaju akciju sa zadatim vrednostima.<br>

## Izrazi

Izrazi predstavljaju svaku referencu na promenljivu ili vrednost, a i na skup promenljivih ili literala kombinovanih pomocu operatora.<br>

```js
a = b * 2;
```

> 2 je izraz sa literalnom vrednoscu<br>
> b je izraz s promenljivom<br>
> b _ 2 je artitmeticki izraz, spojen operacijom<br>
> a = b _ 2 je izraz dodeljivanja vrednosti<br>

Iskaz izraza ja opsti izraz koji se moze navesti samostalno. Primer istog je poziv funkcije. Ne koristi se cesto jer se vrenost izraza na cuva, ne menja ishod programa.

```js
alert(a);
```

## Izvrsavanje programa

Graficki prikaz **a = b \* 2;** ne predstavlja nista za racunar. Kako bi on izvrsio dodeljivanje vrednosti promenljivoj **a** potrebna je jedna alatka - kompajler / interpreter.<br>
Neki racunarski jezici koriste **interpreter**. Kada zelis da pokrenes program, interpreter cita naredbe, liniju po liniju i tada ih prevodi.<br>
Dok se za druge jezike koristi **kompajler**. Radi na princip da kako se pisu komande, on ih prevodi na masinski jezik i kada pokrenes program, pokrenu se vec prevedene naredbe.<br>
_Javascript_, iako izgleda kao da koristi interpreter, zapravo radi na princip **kompajlera**.

## Rezultati izvrsavanja programa

Postoje dva nacina prikaza rezultata nekoz izraza - **_console.log(parametar)_** i **_alert(parametar)_**.

> console.log() se sastoji od dva dela<br> >**console.** je naziv objekta; tackom se poziva property u tom istom objektu<br> >**log()** je naziv funkcije, koja se nalazi u objektu **console**
> kao parametar prihvata _"Tekst"_, _32_ (vrednost) ili _a_ (promenljive)

## Unosenje ulaznih podataka

Iako se to najcesce radi preko [HTML formi](https://www.w3schools.com/html/html_forms.asp) - nekog polja u koje korisnik unese tekst, vrednost. Zatim se ta vrednost stavi u premenljivu preko _JavaScript-a_ i koristi na drugim mestima.<br>
Za svrhe ucenja ulazni podaci se prihvataju preko **prompt(parametar)** funkcije.

## Operatori

Odredjuju akcije koje izvrsavamo sa promenljivima i vrednostima.<br>

| Ime                                    | Operator         |
| -------------------------------------- | ---------------- |
| Dodeljivanje vrednosti                 | =                |
| Matematicki                            | +, -, \*, /      |
| Kombinovani sa dodeljivanjem vrednosti | +=, -=, \*=, /=  |
| Inkrementacija / dektementacija        | ++, --           |
| Pristupanje svojstu objekta            | . (tacka)        |
| Jednakost                              | ==, ===, !=, !== |
| Poredjenje                             | <, >, <=, >=     |
| Logicki                                | &&, \|\|         |

## Vrednosti i tipovi

Tipovi su ustvari razliciti nacini prikazivanja vrednosti.<br>

> Ako ti treba broj, tip te vrednosti je **number**.<br>
> Ako treba da prikazes neku vrednost na ekranu, treba ti **string**.<br>
> Kada treba da doneses odluku koristis tip **boolean**.

### Konverzije tipova

**Eksplicitna** konverzija se postize nekom u ugradjenih funkcija, ko sto je Number(), koja zadati string pretvara u broj.

```js
var text = "42";
var number = Number(text);

console.log(text); // "42"
console.log(number); // 42
```

**Implicitnu** konverziju pokrece JavaScript prevodilac. Ako poredimo dva razlicita tipa, prevodilac ce vrednost jednog tipa pretvoriti u tip druge vrednosti, sa kojom se poredi.

```js
console.log("99.99" == 99.99); // true
```

> String "99.99" se pretvara u tip number => 99.99, pa se zatim poredi sa tipom number, sto vraca true, tacno.

Implicitna konverzija, ako je osmisljena da pomogne, zbunjuje programere. Cak je nazivaju i greskom u dizajnu jezika.

## Komentari u kodu

Kako bi olaksali razumevanje napisanog koda drugim programerima vazno je da biramo dobra imena za promenljive i funkcije. Takodje je vazno beleziti sta koja funkcija radi kratkim tekstom (komentarom).

- Programski kod bez komentara nije optimalan
- Previse komentara znak je lose napisanog koda
- Komentar treba da objasnjava **zasto**, a u nekim slozenijim delovima i **kako**

```js
// ovo je jednoredni komentar

/* ovo
    je 
        viseredni
            komentar
                    */
```

## Promenljive

**Staticko** odredjivanje tipa vrednosti se smatra bezbedniji i sigurnijim nacinom jer ne moze da dodje do nenamerne implicine konverzije

> Ovaj nacin odredjivanja tipova koristi jezik C, u kojem moras da definises tip vrednosti; int c = 9;

**Dinamicko** odredjivanje tipa vrednosti koristi _JS_. Omogucava fleksibilnost programa.

```js
var c = 45;
c = "Ne moram da brinem o tipu promeljive";
```

```js
var cena = 99.99;
cena *= 2;
console.log(cena); // 199.98
// implicitno pretvara number u string kako bi ga prikazao na ekranu
cena = "$" + string(cena);
console.log(cena); // "$199.98"
//eksplicitno smo pretvorili number u string
```

> Nisam morao da razmisljao o tipu promenljive, iako sam mu menjao tip vrednosti sa number u string. Ovo nikada ne bih uspeo u C-u.

Dogovori medju programerima jeste da konstantne promenljive nazivaju velikim slovima.

```js
var KONSTANTNA_VREDNOST = "Nebitno"; // reci se razdvajaju _
```

U ES6 su ubacili rezervisanu rec _**const**_ koja predstavlja konstante, nepromenljive vrednosti.

```js
const DRUGA_REC = "Ista namena, ali nepromenljiva u toku programa";
DRUGA_REC = 32; //Uncaught TypeError: invalid assignment to const 'DRUGA_REC'
```

## Blokovi

Kada je potrebno vise koraka u nameri da obavimo neki proces koriste se blokovi.

```js
var cena = 99.99;

{
  cena *= 2;
  console.log(cena);
}
```

> Iako je ovo ispravno, ne vidja se cesto u _JS_ programima.<br>
> Obicno se koristi uz neki od upravljackih izraza (if, for, while...)<br>
>
> ```js
> var a = 11;
> if (a > 10) {
>   // <-- blok pridruzen if-u
>   console.log(a); // 11
> }
> ```
