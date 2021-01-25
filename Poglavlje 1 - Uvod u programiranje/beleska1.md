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
Ovaj izraz govori racunaru da ucita vrednost *b*, zatim je pomnozi sa *2* i dobijeni rezultat cuva u promenljivoj *a*.
>*a* i *b* su promenljive; mogu se zamisliti kao kutije u kojima se mogu cuvati razne stvari.<br>
>*2* je vrednost, *literal*; pojavljije se samostalno i nije smestena u promenljivu.<br>
>*\** i *=* su operatori; izvrsavaju akciju sa zadatim vrednostima.<br>

## Izrazi
Izrazi predstavljaju svaku referencu na promenljivu ili vrednost, a i na skup promenljivih ili literala kombinovanih pomocu operatora.<br>
```js
a = b * 2;
```
>2 je izraz sa literalnom vrednoscu<br>
>b je izraz s promenljivom<br>
>b * 2 je artitmeticki izraz, spojen operacijom<br>
>a = b * 2 je izraz dodeljivanja vrednosti<br>

Iskaz izraza ja opsti izraz koji se moze navesti samostalno. Primer istog je poziv funkcije. Ne koristi se cesto jer se vrenost izraza na cuva, ne menja ishod programa.
```js
alert(a);
```

## Izvrsavanje programa
Graficki prikaz **a = b * 2;** ne predstavlja nista za racunar. Kako bi on izvrsio dodeljivanje vrednosti promenljivoj **a** potrebna je jedna alatka - kompajler / interpreter.<br>
Neki racunarski jezici koriste **interpreter**. Kada zelis da pokrenes program, interpreter cita naredbe, liniju po liniju i tada ih prevodi.<br>
Dok se za druge jezike koristi **kompajler**. Radi na princip da kako se pisu komande, on ih prevodi na masinski jezik i kada pokrenes program, pokrenu se vec prevedene naredbe.<br>
*Javascript*, iako izgleda kao da koristi interpreter, zapravo radi na princip **kompajlera**.

## Rezultati izvrsavanja programa
Postoje dva nacina prikaza rezultata nekoz izraza - ***console.log(parametar)*** i ***alert(parametar)***.
>console.log() se sastoji od dva dela<br>
>**console.** je naziv objekta; tackom se poziva property u tom istom objektu<br>
>**log()** je naziv funkcije, koja se nalazi u objektu **console**
>kao parametar prihvata *"Tekst"*, *32* (vrednost) ili *a* (promenljive)

## Unosenje ulaznih podataka
Iako se to najcesce radi preko [HTML formi](https://www.w3schools.com/html/html_forms.asp) - nekog polja u koje korisnik unese tekst, vrednost. Zatim se ta vrednost stavi u premenljivu preko *JavaScript-a* i koristi na drugim mestima.<br>
Za svrhe ucenja ulazni podaci se prihvataju preko **prompt(parametar)** funkcije.















