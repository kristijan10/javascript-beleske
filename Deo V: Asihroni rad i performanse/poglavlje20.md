# Asihronizam: pojmovi sada i kasnije

Jedno od najvaznijih delova JavaScripta jeste kako izraziti ponasanje programa koje je promenljivo tokom vremena. Odnosno to je pitanje sta se dogadja kada se deo koda izvrsi _sada_, a neki njegov deo _kasnije_.

## Program u delovima

Programeri imaju problem s shvatanjem da se _kasnije_ ne izvrsavao neposredno i odmah posle _sada_.

```js
// ajax je kao fetch
var data = ajax("https://some.url/api");

// posto se ajax ne izvrsava sihrono,
// data ce uglavnom biti ispisana kao
// undefined
console.log(data);
```

Ajax radi tako sto _sada_ salje zahtev, a _kasnije_ dobija odgovor.

Najjednostavniji nacin za "cekanje" jesu povratne funkcije (engl. callback function).

```js
ajax("https://some.url/api", function myCallback(data){
   console.log(data);
})
```

```js
function now(){
   return 42;
}

function later(){
   answer *= 2;
   console.log("Smisao zivota: ", answer); 
}

var answer = now(); // 42

setTimeout(later, 1000);
// ceka 1 sekund
// Smisao zivota: 84

/*
// program se sastoji od delova Sada
// i Kasnije
//
// Sada se izvrsava:
//    function now(){} - samo se inicijalizuje
//    function later(){} - samo se inicijalizuje
//    var answer = now(); - dodeljuje vrednost
//    setTimeout(later, 1000); - zapocinje odbrojavanje
//
// Kasnije se izvrsava:
//    poziva se izvrsavanje funkcije later:
//       answer *= 2;
//       console.log("Smisao zivota: ", answer);
*/
```

Kada god se deo koda upakuje u funkciju kojoj zadas da se izvrsi kao odziv na odredjeni dogadjaj (isticanje vremenskog intervala, pritiskanje tastera misa, prijem ajax odziva...) tako formiram element koji se izvrsava _kasnije_ i time u program uvodim asihronizam.

### Asihronizam konzole

Posto objekat _console_ nije sastavni deo ECMAScripta, vec ga citaci veba dodaju, pa zato moze doci do razlicitih ponasanja u konzolama razlicitih veb pretrazivaca.

```js
// jedan od retkih slucajeva
var a = {
   index: 1
}

console.log(a);

a.index++;
```

>Neki citaci veba console.log() izvrsavaju asihrono zbog sporog U/I protoka. Zato bi se tada dogodilo da u nekim konzolama prikaze prvo objekat ({index: 1}) pa zatim inkrementira, a u nekim bi se prikaz izvrsio asihrono (proslo bi dovoljno vremena da se izvrsi sledeci iskaz), sto znaci da bi doslo prvo do inkrementiranja, a zatim i prikaza promenjene vrednosti.

## Petlja za obradu dogadjaja

JS-ova masina ima posao samo da iscitava redom linije i izvrsava. Kada naidje na kod koji se postavlja kao odgovor na neki dogadjaj, JS masina se zaustavi kod njega, iscita na koji dogadjaj treba da ceka, dok dalje nastavlja da cita i izvrsava kod.

Kada JS masina primi neki odgovor (klik misa, odgovor sa servera...) izvrsava blok koda koji je zadat za taj dogadjaj.

>Sada mi je sinulo, da li se cuvaju negde informacije o tome na koji dogadjaj se postavlja cekanje i koja se f-ja izvrsava kada masina primi odgovor?

```js
// konceptualni izgled petlje
// za obradu dogadjaja

// eventLoop je niz koji igra
// ulogu cekanja (obrada po modelu FIFO)
var eventLoop = [];
var event;

while(true){
   if(eventLoop.length > 0){
      event = eventLoop.shift();

      try{
         event()
      } catch(err){
         reportError(err);
      }
   }
}
```

## Paralelni visenitni rad

Asihrono je interval izmedju _sada_ i _kasnije_, a paralelno opisuje stvari koje se mogu izvrsavati istovremeno.

JS po prirodi je single-thread (jednonitni), sto znaci da se izvrsavanje jednog dela koda ne moze preplitati s izvrsavanjem nekog drugog dela.

```js
var a = 20;

function foo(){
   a = a + 1;
}

function bar(){
   a = a * 2;
}

ajax("http://some.url/1", foo);
ajax("http://some.url/2", bar);

/*
// od blizine servera i protoka podataka zavisi koliko
// ce treba odgovoru da stigne, sto znaci da postoje
// dva odgovora naseg programa na to kojom brzinom
// dobijemo odgovor od servera
//
// U slucaju da prvo pristigne odgovor s servera 1
// onda bi a u tom slucaju bilo 42
//
// A da je slucaj da server 2 vrati brze odgovor, a bi tada imalo vrednost 41
*/
```

### Potpuno izvrsavanje

Posto je JS single-threaded jezik, kada masina krene da izvrsava blok koda funkije ona je izvrsava do kraja bloka, a nakon toga cita redom i ide dalje. To ponasanje se zove **potpuno izvrsavanje** (engl. **run-to-completion**).

>Ja sam ono sto je on u ovom delu objasnio napisao u objasnjenju koda pod naslovom iznad

```js
var a = 1;
var b = 2;

function foo(){
   a++;
   b *= a;
   a = b + 3;
}

function bar(){
   b--;
   a = 8 + b;
   b = a * 2;
}

ajax("https://some.url/1", foo);
ajax("https://some.url/2", bar);
```

| Rezultat 1 | Rezultat 2 |
| ---------- | ---------- |
| var a = 1; | var a = 1; |
| var b = 2; | var b = 2; |
|            |            |
| //foo()    | //bar()    |
| a++;       | b--;       |
| b = b * a; | a = 8 + b; |
| a = b + 3; | b = a * 2; |
|            |            |
| //bar()    | //foo()    |
| b--;       | a++;       |
| a = 8 + b; | b = b * a; |
| b = a * 2; | a = b + 3; |
|            |            |
| a - 11     | a - 183    |
| b - 22     | b - 180    |

## Istovremenost

Mogucnost izvrsavanja dva ili vise "procesa" istovremeno, bez obzira na to da li se operacije koje ih cine izvrsavaju paralelno (u istom trenutku na zasebnim procesorima ili jezgrima) se zove **istovremenost** (engl. **concurrency**).

Primer primene istovremenosti su web aplikacije koje prikazuju listu azuriranih statusa (web aplikacije za prikaz cena deonica, drustvene mreze...).

```md
onscroll, request 1 <- pocinje Proces 1
onscroll, request 2
response 1 <- pocinje Proces 2
onscroll, request 3
response 2
response 3
onscroll, request 4
onscroll, request 5
onscroll, request 6
response 4
onscroll, request 7 <- zavrsava Proces 1
response 6
response 5
response 7 <- zavrsava Proces 2
```

Proces 1 i Proces 2 se odvijaju istovremeno (paralelizam na nivou posla), ali se njihovi dogadjaji obradjuju sekvencijalno (serijski) u redu petlje za obradu dogadjaja.

Nisam primetio na prvi pogled, ali _response 6_ je vracen pre _response 5_. Autor kaze da postoje i drugi nacini obrade podataka, sto ce opisati u narednim poglavljima.

### "Procesi" bez medjusobne interakcije

```js
var res = {};

function foo(result){
   res.foo = result;
}

function bar(result){
   res.bar = result;
}

ajax('http://some.url/1', foo);
ajax('http://some.url/2', bar);
```

Ovde nema nikakve komunikacije izmedju povratnih funkcija, ne "trkaju se" cija ce se vrednost koristiti jer se povratna vrednost cuva u promenljivoj koja je odgovorna za istoimenu f-ju.

### "Procesi" izmedju kojih postoji interakcije

```js
var a = [];

function response(data){
   a.push(data);
}

ajax('some.url/1', response);
ajax('some.url/2', response);
```

>Programer ovde ne sme da pretpostavlja da ce se uvek na prvo mesto u promenljivoj a nalaziti odgovor pristigao od strane prvog linka
>
>Nekada na a[0] moze da se nalazi odgovor prvog poziva, a nekada odgovor drugog poziva

Da bi se izbeglo utrkivanje, treba koordinisati interakciju zbog redosleda izvrsavanja:

```js
var a = [];

function response(data){
   if(data.url == "some.url/1"){
      a[0] = data;
   } else if(data.url == "some.url/2"){
      a[1] = data;
   }
}

// ajax poziv
```

>Ovim nacinom nije mi bitno koji odgovor stigne prvi pa se resavam i "utrkivanja" a i znam da ce zasigurno na prvom mestu biti odgovor prvog zahteva

```js
var a, b;

function foo(x){
   a = x * 2;
   baz();
}

function bar(y){
   b = y / 2;
   baz();
}

function baz(){
   console.log(a+b);
}

ajax('some.url/1', foo);
ajax('some.url/2', bar);
```

>Bilo koji odgovor da mi stigne prvi, uvek ce biti greske kada pristigne prvi odgovor

Kada pristigne prvi odgovor poziva se funkcija koja konzoluje jedan od definisanih + drugi (koji nije definisan). Nakon sto i drugi odgovor pristigne, onda mogu da dobijem dobar odgovor.

Resenje tog problema je koriscenjem **kapije** (engl. **gate**)

```js
var a, b;

function foo(x){
   a = x * 2;
   // ispisi mi rezultat samo ako su stigla oba odgovora
   if(a && b) baz();
}

function bar(y){
   b = y / 2;
   if(a && b) baz();
}

function baz(){
   console.log(a+b);
}

ajax('some.url/1', foo);
ajax('some.url/2', bar);
```

A problem za utrkivanje se moze resiti koristeci **rampa** (engl. **latch**):

```js
var a;

function foo(x){
   if(a === undefined){
      a = x * 2;
      baz();
   }
}

function bar(x){
   if(a === undefined){
      a = x / 2;
      baz();
   }
}

function baz(){
   console.log(a);
}

ajax('some.url/1', foo);
ajax('some.url/2', bar);
```

>Koji god odgovor da je pristiga prvi samo on je odgovoran za postavljanje vrednosti
>
>Ko prvi devojci, njemu devojka xD

### Saradnja

Ako bi se desilo da sa neke udaljene lokacije na serveru zelim da preuzmem neki podatak/fajl i on u sebi sadrzi stotine hiljada linija koda, to bi zaustavilo ceo proces ucitavanja stranice na strani klijenta, sto bi rezultovali usporenom sadrzaju, sto znaci da ce korisnik trebati da ceka duze.

To se resava na sledeci nacin:

```js
// prvi primer koda je onaj koji bi pravio problem
var resp = [];

function response(data){
   res = res.concat(
      data.map(function(val){
         return val * 2;
      })
   );
}

ajax('some.url/1', response);
ajax('some.url/2', response);

/*
// kada prvi upit vrati odgovor pozivanjem f-je
// response u listu resp se ubacuju duplirane vrednosti
// odgovora primljenog s udaljene lokacije, a dok se sve
// to ne ogradi (prolazak kroz dospelu listu, 
// dupliranje njenih vrednosti pa i ubacivanje u listu
// resp). A tako isto i za drugi. U medjuvremenu,
// kontent na klijentskoj strani ne moze da se ucita
*/

// resenje problema
var res = [];

function response(data) {
   // obrada paketa velicine 1000
    var chunk = data.splice(0, 1000);

    res = res.concat(
        chunk.map(function(val) {
            return val * 2;
        })
    )

   // ako ima jos paketa
    if (data.length > 0) {
      // obradicu ih asihrono
      setTimeout(function() {
         response(data)
      }, 0)
    }
}

ajax('some.url/1', response);
ajax('some.url/2', response);
```

## Poslovi

Niz za poslove (engl. **job queue**) je niz koji se izvrsava kasnije, ali preko reda.

```js
console.log("A");

setTimeout(function(){
   console.log("B");
}, 0);

// sledeci blok koda je izmisljen kako bi se prikazao
// pravi nacin ponasanja
schedule(function(){
   console.log("C");

   schedule(function(){
      console.log("D");
   })
})
/*
// "A"
// "C"
// "D"
// "B"
*/
```

>Ne razumem, ali ce biti dalje objasnjeno kroz poglavlje 22
