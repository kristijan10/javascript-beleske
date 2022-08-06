# Konverzija (engl. coersion)

Iako konverzija iz jednog u drugi tip izgleda kao zamka ili greska u jeziku, ono sto ne razumemo valja nauciti, pa tek onda kritikovati.

## Konverzija vrednost

Konverzija iz jednog u drugi tip se naziva **pretvaranje tipa** dok je **konverzija** kada se radi implicitno konvertovanje.

Autor se vodi mislju i pravi razliku samo izmedju "eksplicitne" i "implicitne" konverzije tipa.

## Apstraktne operacije s vrednostima

Pre istrazivanja o razlici sta se to desava prilikom implicitne/eksplicitne konverzije, moramo videti kako to vrednosti postaju tipa _number, string ili boolean_.

### Operacija toString

Kada operaciju _toString_ pozivam nad obicnim objektom, ako ona nije redefinisana u lokalnom opsegu tog objekta, ona vraca interno svojstvo [[Class]] svojstva objekta, a to je obicno "[object Object]"

Nizovi imaju redefinisanu metodu _toString()_ koja vraca string ciji je sadrzaj sadrzaj tog niza odvojen , (zarezima):

```js
var a = [1, 2, 3];

a.toString(); // "1,2,3"
```

#### Pretvaranje u JSON znakovne nizove

Metoda _JSON.stringify(..)_ serijalizuje odredjenu vrednost u znakovni oblik u JSON formatu.

>Ne smatra se isto kao konverzija!

Za proste vrednosti, rezultat pretvaranja u JSON format je isto kao i konverzija pomocu metode _toString()_.

```js
JSON.stringify(42); // "42"
JSON.stringify("42"); // ""42""
JSON.stringify(null); // "null"
JSON.stringify(true); // "true"
```

JSON bezbedne vrednosti se mogu koristiti kao argumenti metode _JSON.stringify(..)_.

>JSON bezbedne vrednosti su sve osim _function, undefined, symbol i objekata koji sadrze cirkularnu referencu (gde referenciranje svojstva u strukturi jednog objekta formira neprekidan ciklus s jednog svojstva na drugo)_
>
>Te vrednosti su neprihvatljive JSON-u iz razloga sto nisu prenosive u druge jezike koji rade s JSON vrednostima

Kada JSON naidje na nebezbedne vrednosti on ih zanemaruje, a ako koristim metodu _stringify()_ nad slozenom vrednoscu (objekat ili niz) JSON ce sva ponavljanja tipova _undefined, function i symbol_ zameniti s _null_:

```js
JSON.stringify(undefined); // undefined
JSON.stringify(function f(){}); // undefined

JSON.stringify([1, undefined, function(){}, 4]); // "[1, null, null, 4]"
JSON.stringify({a: 2, b:function(){}}); // "{"a": 2}"
```

Ako pomocu _JSON.stringify(..)_ metode pokusam da pretvorim u JSON format objekat s cirkularnim vrednostima, masina izbacuje gresku.

Ako zelim da objekat koji sadrzi neprihvatljive JSON vrednosti pretvorim u JSON format, onda treba da definisem metodu _toJSON()_ koja vraca JSON bezbednu verziju objekta.

```js
var o = {};

var a = {
  b: 42,
  c: o,
  d: function(){}
}

o.e = a; // pravi cirkularnu referencu unutar 'a'

// Pozivanjem metode sada bi prouzrokovalo gresku
// JSON.stringify(a);

// definisem namenski nacin JSON serijalizovanja vrednosti
a.toJSON = function(){
  // serijalizuje se samo svojstvo 'b'
  return {b: this.b}
}

JSON.stringify(a); // "{"b":42}"
```

Namenska metoda _toJSON()_ je napravljena kao pomocna metoda koja bi omogucila da i ako imamo neprihvatljive vrednosti u objektu, opet mogu da pretvorim u JSON format ono sto se moze pretvoriti.

Treba je zamisliti kao "pretvara u JSON bezbednu vrednost koja je pogodna za dalje pretvaranje u JSON format".

```js
var a = {
  var: [1,2,3],

  // verovatno ispravno jer vraca
  // vrednost podtipa array
  toJSON: function(){
    return this.val.slice(1);
  }
}

var b = {
  val: [1,2,3],

  // verovatno neispravno posto vec vraca
  // vrednost tipa string
  toJSON: function(){
    return "[" + this.val.slice(1).join() + "]";
  }
}

JSON.stringify(a); // "[2, 3]"
JSON.stringify(b); // ""[2, 3]""
```

_JSON.stringify(..)_ metoda prima i drugi, opcioni, argument koji se jos naziva i zamena (engl. replacer). Taj argument moze biti niz ili funkcija, a svrha mu je da filtrira koja se svojstva ukljucuju u proces pretvaranja u JSON format.

U slucaju ako je drugi argument niz, on mora sadrzati vrednosti tipa string, a koje predstavljaju imena svojstava objekta koji pokusavamo da pretvorimo u JSON oblik. Ime svojstva koje nije navedeno u tom drugom argumentu se izostavlja iz prebacivanja.

Ako je zadata funckija, ona se poziva jednom za zadat objekat, a i jednom za svako svojstvo tog objekta. Funkciji prilikom poziva nad svojstvima se prosledjuju dva armuneta: _kljuc_ i _vrednost_. Da bi se iz procesa izostavio odredjeni _kljuc_ funkcija za njegovu vrednost treba da vrati _undefined_.

```js
var a = {
  b: 42,
  c: "42",
  d: [1,2,3]
}

JSON.stringify(a, ["b", "c"]); // "{"b":42,"c":"42"}"
JSON.stringify(a, function(k, v){
  if(k !== "c") return v;
}); // "{"b":42,"d":[1,2,3]}"
```

Metoda _JSON.stringify(..)_ ima i treci opcioni argument, koji predstavlja sta ce biti umetnuto umesto razmaka (kako bi format bio citljiviji):

```js
var a = {
  b: 42,
  c: "42",
  d: [1,2,3]
}

JSON.stringify(a, null, 3);
/*
//"{
//   "b": 42,
//   "c": "42",
//   "d": [
//      1,
//      2,
//      3
//   ]
//}"
*/

JSON.stringify(a, null, "-----");
/*
//"{
//-----"b": 42,
//-----"c": "42",
//-----"d": [
//----------1,
//----------1,
//----------1,
//-----]
//}"
*/
```

Vrednosti tipa _number, boolean, string i null_ pretvaraju se u JSON format kao kada bi iskoristio _toString()_ metodu.

Dok, ako _JSON.stringify(..)_ metodi prosledim vrendnost tipa _object_, a taj objekat ima definisanu metodu _toJSON()_, ta metoda se poziva automatski zbog "konverzije" tipa te vrednosti u JSON bezbedan oblik pre pretvaranja u JSON znakovni oblik.

### Operacija toNumber

Ako konverzija tipa _string_ u tip _number_ nije izvodljiva, operacija ce vratitit _NaN_ vrednost.

Ako koristim neku vrednost koja nije broj uz matematicku operaciju, masina ce tu vrednost pretvoriti u numbericku alternativu.

>true postaje 1; false postaje 0; undefined postaje NaN; null (neobjasnjivo) postaje 0

Ako pokusavam da konvertujem slozen tip vrednosti (objekat/array) _toNumber_ metoda ce potraziti da li u internom opsegu tog objekta ima definisana metoda _toString()_ ili _valueOf()_.

```js
var a = {
  valueOf: function(){
    return "42";
  }
}

var b = {
  toString: function(){
    return "42";
  }
}

var c = [4, 2];
c.toString = function(){
  return this.join(""); // "42"
}

Number(a); // 42
Number(b); // 42
Number(c); // 42
Number(""); // 0
Number("42"); // 42
Number("3e"); // NaN
Number([]); // 0
Number(["abc"]); // NaN
Number(undefined); // NaN
```

### Operacija toBoolean

Cesto pogresno misljenje vlada medju programerima da su numericke vrednosti _1_ i _0_ jednake vrednostima _true_ i _false_. Numericke vrednosti su numericke vrednosti, a logicke su logickke vrednosti. Ako bi se izvrsila konverzija tada bi _1_ mogao da postane _true_ (i obrnuto; a tako i za _0_ i _false_).

#### Vrednosti koje se ponasaju kao false

Prilikom konverzije tipova u boolean tip moze se suziti na:

1) tipovi koji se pretvaraju u _false_
2) svi ostali, odnosno, oni koji se pretvaraju u _true_

Vrednosti koje se pretvaraju u _false_:

- undefined
- null
- false
- +0, -0, NaN
- ""

Sve ostale vrednosti koje postoje u JS-u se smatraju kao _true_.

#### Objekti koji se ponasaju kao false

Jedan primer koji je autor naveo je objekat _document.all_. Taj objekat je isti kao i svi drugi objketi u JS-u. Smatra se zastarelim ali autor nije naveo zbog cega je odluceno da se taj obican objekat prikazuje kao _false_.

```js
if(document.all) console.log("prosao sam");
else console.log("nisam prosao");

// "nisam prosao"
```

#### Vrednosti koje se ponasaju kao true

Da skratim, sve sto se NE nalazi na listi vrednosti koje se konverzijom u _boolean_ smatraju kao _false_, ponasa se kao _true_. Ta lista je prilicno dugacka, zato se ne treba ni truditi pisati je, vec je mnogo mudrije proveriti da li se vrednost koju ispitujemo nalazi na listi za _false_, i ako se nalazi - vrednost ce implicitno/eksplicitno biti konvertovan u _false_, a u suprotnom _true_.

## Eksplicitna konverzija

### Eksplicitno: znakovni niz -> brojevi

Najcesca konverzija (iz stringa u broj).

```js
var a = 42;
var b = String(a); // "42"

var c = "3.14";
var d = Number(c); // 3.14
```

Ovo je najocigledniji tip eksplicitnog konvertovanja. Slicna ideja je i u jezicima gde je staticko odredjivanje tipova.

>U C/C++ bi se pretvaranje vrsilo na nacin: int(x) (mada postoji i drugi zapis - (int)x (kasting tipa, engl. type casting))
>
>Sto je mnogo slicno JS nacinu: Number(x)

A postoje i mnogo drugih nacina:

```js
var a = 42;
var b = a.toString(); // "42"

var c = "3.14";
var d = +c; // 3.14
```

Metoda _toString()_ radi malo drugacije nego sto sam zamisljao. Nisam uopste razmisljao o tome kako radi, tako da nije ni to lose receno xD

Da bi iskoristio metodu nad primitivnom vrednoscu moram da je "upakujem" u okruzujuci objekat. Makar to nije nesto o cemu moram da razmisljam jer JS masina to radi umesto mene. Ovo je primer "eksplicitno implicitnog" konvertovanja.

+c je vec opste prihvacen oblik eksplicitnog nacina konvertovanja prihvacen u zajednici za otvoren JS kod.
Ali ovaj oblik takodje moze lako i da zbuni.

```js
var a = "3.14";
var b = 5 + +a; // 8.14

/*
// palo mi je napamet zasto nije samo stavio 5 + a
// var c = 5 + a; // 53.14
// var d = a + 5; // 3.145
*/
```

Kako moze sa +, tako moze i sa -. Samo sto prilikom koriscenja s operacijom -, menja se znak broja.

```js
var a = "3.14"
var b = -a; // -3.14

/*
// da bi ponovo prebacio
// u pozitivnu stranu
// mogu iskoristit jos jedan minus:
// var b = - -a; // 3.14
*/
```

#### Konverzija datuma u broj

Jos jedan cest oblik upotrebe unarnog operatora + je prilikom konverzije datumskog objekta u tip _number_.

```js
var d = new Date();

+d; // broj u milisekundama koji je protekao od 1. januara 1970. godine
```

Najbolji nacin da dobijem informaciju o vremenu je koriscenjem nove metode _now_ u _Date_ objektu:

```js
var a = Date.now();

// polifil
if(!Date.now){
  Date.now = function(){
    return +new Date();
  }
}
```

**Preporuka**: nemoj koristiti oblik konverzije datuma, vec koristi metodu _Date.now()_ ako ti je potrebno trenutno vreme, a u suprotnom _new Date(..).getTime()_

#### Neobican slucaj operatora ~

Spada u opseg eksplicitnog konvertovanja.

Ono sto se desava je da on prvo konvertuje u 32-bitni broj, a zatim negira sve bitove tog broja (obrce paritet svakog bita)

-1 se obicno naziva kontrolna vrednost (engl. _sentinel_). Kada funcija vrati bilo koji vrednost >=0, to se tumaci kao uspeh, dok ako vrati -1 neuspeh. Jedan primer njene primene je metoda _indexOf(..)_. Ako ne nadje postring u stringu f-ja vraca -1, a ako nadje, vraca indeks >=0.

```js
var a = "Zdravo svete"

if(a.indexOf("sv") >= 0){
  // nasao sam ga
}

if(a.indexOf("sv") != -1){
  // nasao sam ga
}

if(a.indexOf("vs") < 0){
  // nisam ga nasao
}

if(a.indexOf("vs") == -1){
  // nisam ga nasao
}
```

Problem sa ovakvim kodom je taj sto se moze videti da zavisim od kontrolne vrednosti (-1), a vise bih voleo da se to ne primeti. Zato tu stupa operator ~ (**tilda**).

```js
var a = "Zdravo svete"

~a.indexOf("sv"); // -7 <- ponasa se kao true

if(~a.indexOf("sv")){
  // nasao sam
}

~a.indexOf("vs"); // 0 <- ponasa se kao false
!~a.indexOf("vs"); // true

if(!~a.indexOf("vs")){
  // nisam ga nasao
}
```

#### Odsecanje bitova

Tilda se takodje moze korisititi i za odsecanje decimalnih delova broja.

```js
~~-49.6; // -49
Math.floor(-49.6); // -50;
```

Prva tilda pretvara u 32-bitnu alternativu i obrce vrednosti bitova, a druga zatim opet obrce vrednosti bitova sto ih vraca u prvobitno stanje.

Ali to sto se moze postici sa duplom tildom, moze i s operatorom | (OR).

```js
~~1E20 / 10; // 166199296
1E20 | 0 / 10; // 1661992960 <-razlicito od gornjeg
(1E20 | 0) / 10 // 166199296
```

### Eksplicitno: numericki znakovni niz u brojeve

>Rasclanite znakovni niz u broj kada vam nije vazno koji se drugi numericki znaci mogu naci na desnoj strani.
>
>Konvertujte stip string (u number) samo kada su prihvatljive jedino numericke vrednosti i kada bi sve nalik na "42px" trebalo odbaciti kao da nije broj

```js
var a = "42"
var b = "42px"

Number(a); // 42
parseInt(a); // 42

Number(b); // NaN
parseInt(b); // 42
```

Pri generisanju numericke od znakovne vrednosti, tolerise se prisustvo nenumerickih znakova (postupak analiziranja pojedinacnih znakova sleva nadesno zavrsava se na prvo nenumerickom znaku), dok konverzija tipa to ne tolerise i propada (a rezultat je NaN).

_parseInt_ je pre ES5 verzije zahtevao kao drugi argument da se napise u kom sistemu brojeva ce da konvertuje. Zatim je stavljeno kao obavezno da se stavlja 10, a nakon toga za kasnije verzije se podrazumevalo da je 10 sve dok nisi nista prosledio kao drugi argument.

#### Rasclanjivanje vrednosti koje nisu znakovnog tipa

Pre nekoliko godina se pojavila sarkasticna poruka koja je ismevala ponasanje JS-a:

```js
parseInt(1/0, 19); // 18
```

Kao prvo, vidi se da metodi nije prosledjen tip string, vec broj. To se jednostavno ne radi. A ako to i uradis, masina implicitno konvertuje broj u string, a zatim rasclanjuje.

```js
parseInt(1/0, 19);

// pretvara se u
parseInt("Infinity", 19);

/*
// brojevni sistem 19 sadrzi od 1-9 i od a-i (mala i velika)
// kada krene da rasclanjuje "I" je vrednost 18, "n"
// ne postoji u tom brojevnom sistemu pa se proces prekida
*/
```

```js
parseInt(0.000008); // 0 ("0" od "0.000008")
parseInt(0.0000008); // 8 ("8" od "8e-7")
parseInt(false, 16); // 250 ("fa" od "false");
parseInt(parseInt, 16); // 15 ("f" od "function..");

parseInt("0x10"); // 16
parseInt("103", 2); // 2
```

### Eksplicitno: * -> tip boolean

Kao sto postoji nacin da eksplicitno konvertujem string u number pomocu operatora +, tako postoji i ovde - **!**

```js
var a = "0";
var b = [];
var c = {};

var d = null
var e = 0;
var f = "";
var g;

Boolean(a); // true
!!b; // true
Boolean(c); // true

Boolean(d); // false
!!e; // false
!!f; // false
!!g; // false

/*
// razlog zasto dva !! je sto jedan menja
// paritet (od false -> true i obrnuto)
// prvi ! je za eksplicitno konvertovanje
// koji takodje menja i paritet, a onda je drugi
// da vrati na podrazumevanu parnost 
*/
```

## Implicitna konverzija

Podrazumeva se konverzija koja nama programerima na prvi pogled nije uocljiva. Nije eksplicitno naznaceno da dolazi do bilo kakve konverzije, ali dubljim razumevanjem napisanog koda mozemo shvatiti da li dolazi do implicitne ili ne dolazi.

Ovaj tip konverzije je onaj koji tera vecinu ljudi od konverzija uopsteno. Toliko je mrze da misle da je to uvedena greska u JS-u.

Cilj implicitne konverzije definisacemo kao smanjivanje opsirnosti iskaza, smanjivanje kolicina ponovljenog sablonskog koda i/ili nepotrebnih detalja implementacije koji pretrpavaju nas kod sumom koji nam odvlaci paznji s vaznijih namera.

### Implicitno pojednostavljivanje

Ono sto treba je shvatiti kako koji tip funkcionise, kako ga koristimo u kodu i to nam omogucava koriscenje implicitne konverzije, koja cini kod pojednostavljenim, bez viska naglasavanja masini da mora da prebaci iz ovog tipa u ovaj tip. To ona primeti kada vidi na koji nacin koristimo tipove.

### Implicitno: znakovni nizovi -> brojevi

Operator + je preklopljen tako da sluzi i za sabiranje brojeva ali i za spajanje stringova. Kako da znam kada se koja funkcionalnost koristi?

```js
var a = "42";
var b = "0";
var c = 42;
var d = 0;

a+b; // "420"
c+d; // 42
```

```js
var a = [1, 2];
var b = [3, 4];

a+b; // "1, 23, 4"
```

Zasto je vratio string kada su svi brojevi u nizu?

Kada operator + dobije vrednost tipa _object_ kao jedan od operanada, prvo za tu vrednost poziva operaciju _toPrimitive()_. Posto pozivanje metode _valueOf()_ za vrednost tipa array nije jednostavna primitivna vrednost, prelazi se na znakovni oblik predstavljanja vrednosti koji se dobija pomocu metode _toString()_. Zbog toga nizovi postaju vrednosti "1,2" i "3,4". Operator zatim samo spaja ta dva stringa i zato dobijamo ocekivani rezultat - "1,23,4".

Vrednost tipa _number_ se moze jednostavno konvertovati u tip _string_ "sabiranjem" broja i praznog znakovnog niza:

```js
var a = 42;
var b = a + "";
b; // "42"
```

```js
var a = {
  valueOf: function(){return 42;},
  toString: function(){return 4;}
};

a + ""; // "42"
String(a); // "4"
```

Zbog nacina na koji deluje apstraktna operacija toPrimitive, izraz _a + ""_ poziva metodu _valueOf()_ za vrednost _a_, a povratna vrednost te metode se zatim konvertuje u string kroz internu metodu _toString()_. Ali funkcija _String(a)_ samo poziva metodu _toString()_ direktno.

```js
// implicitno konvertovanje iz tipa string u tip number
var a = "3.14"
var b = a - 0;

/*
// moze i:
// b = a/1;
// b = a*1;
*/
b; // 3.14
```

Sta se desava s koriscenjem operatora - uz objekte?

```js
var a = [3];
var b = [1];

a - b; // 2
```

Prvo iz niza se pretvara u string, a zatim i u number kako bi se mogla izvrsiti operacija oduzimanja.

### Implicitno: logicke vrednosti -> brojevi

```js
/*
// f-ja proverava da li je prosledjeno
// vise od jedne true vrednosti
*/
function onlyOne(a, b, c){
  return !!((a && !b && !c) || (!a && b && !c) || (!a && !b && c));
}

var a = true;
var b = false;

onlyOne(a, b, b); // true
onlyOne(b, a, b); // true

onlyOne(a, b, a); // false
```

Sta bi bilo ako mi treba vise argumenata da proverim u funkciji? Tada bi presao na pristup brojevima:

```js
/*
// ako je argumentom prosledjeno samo
// jedna vrednost true f-ja ce vratiti true,
// u suprotnom vraca false
*/
function onlyOne(){
  var sum = 0;
  for(let i = 0; i < arguments.length; i++){
    // ako je vrednost razlicita od false
    // proci ce uslov i izvrsiti kod

    // ovde se takodje dogadja i implicitna
    // konverzija; posto prosledjujem vrednosti
    // true ili false one ce se pretvoriti u
    // svoj numericki par i izvrsiti matematicku
    // operaciju sabiranja
    if(arguments[i]) sum += arguments[i];
  }
  
  return sum == 1;
}

var a = true;
var b = false;

onlyOne(a, b); // true
onlyOne(b, a, b, b, b); // true

onlyOne(b, b); // false
onlyOne(b, a, a, b, b, a); // false
```

### Implicitno: * -> boolean

Operacije u izrazima koji dovode do implicitne konverzije u tip _boolean_:

1) uslov u iskazu petlje _if(..)_
2) uslov (drugi argument) u petlji _for(.., .., ..)_
3) uslov u petljama _while(..)_ i _do..while_
4) uslov (prva odredba) u ternarnim izrazima _.. ? .. : .. ;_
5) levi operand (koji sluzi kao uslov) logickih operatora _||_ ("logicka disjunkcija" - ili) i && ("logicka konjunkcija" - i)

```js
var a = 42;
var b = "abc"
var c;
vad d = null;

if(a) console.log("da"); // "da"
while(c) console.log("ne, ne izvrsava se");
c = d ? a : b;
c; // "abc"
if((a && d) || c) console.log("da"); // "da"
```

### Operatori || i &&

Ovi operatori drugacije se ponasaju nego u nekim drugim jezicima. Autor kaze da je progresno dato ime ovih operatora "logicki operator za ___", vec on misli da je prikladnije ime **"operator za biranje operanda"**

Razlog je taj sto u JavaScript-u oni zapravo ne vracaju vrednost logickog _boolean_ tipa, vecvracaju rezultat jednog od zadatih operanda.

```js
var a = 42;
var b = "abc"
vac c = null;

a || b; // 42
a && b; // "abc"

c || b; // "abc"
c && b; // null
```

U jezicima kao sto su C/C++ ovi operatori bi vratili rezultat _true ili false_, dok JavaScript (pa i Ruby i Python) vracaju vrednost jednog od operanda.

Nacin na koji funkcionise biranje operanda:

Oba operatora ispituju da li je vrednost s leve strane tipa _boolean_. Ako nije izvrsava se normalna ToBoolean konverzija.

Za operator ||: AKO JE LEVI OPERAND _true_, rezultat celog ispitivanja je vrednost operanda s LEVE strane. U suprotnom (AKO JE LEVI OPERAND _false_) rezultat je vrednost operanda s DESNE strane.

Za operator &&: AKO JE LEVI OPERAND _true_ rezultat celog ispitivanja je vrednost operanda s DESNE strane. U suprotnom (AKO JE LEVI OPERAND _false_) rezultat je vrednost operanda s LEVE strane.

>Vec sam do sada to ucio:
>
>a || b; ako je jedan od operanada true a drugi false, razultat tog poredjenja je true (sto je vrednost onog operanda koji je true: "foo" || null - "foo", odnosno true (vrednost operanda s leve strane))
>
>a && b; ako je jedan od operanada true a drugi false, rezultat poredjenja je false: "foo" && null - null, odnosno false

Jos jeadn nacin na koji se moze zamisliti operacija poredjenja:

```js
a || b;
a ? a : b;

a && b;
a ? b : a;
```

Primena koju nisam razumeo a koristi se cesto:

```js
function foo(a, b){
  a = a || "zdravo";
  b = b || "svete";

  console.log(`${a} ${b}`);
}

foo(); // "zdravo svete"
foo("da", "da!"); // "da da!"
```

Jos jedan oblik upotrebe koji se koristi s operatorom && je takozvani "cuvarski" oblik (engl. _guard_); odnosno, test prvog "cuva" drugi izraz:

```js
function foo(){
  console.log(a);
}

var a = 42;

a && foo(); // 42

// ^ ekvivalentno je:
if(a) foo();
```

Funkcija se poziva samo ako je vrednost promenljive _a_ razlicita od vrednosti false. A ako je ipak false, dolazi do "kratkog spoja" - odnosno, f-ja se ne poziva.

>Kada sa poceo da citam na koji nacin funkcionisu operatori poredjenja (|| i &&) pomislio sam da sam do sada negde pogresio pisajuci takav kod. Ali to nije istina. Ono vraca vrednost nekog od operanda (ne logicku vrednost) ali se opracija uglavnom korstila u nekom uslovu, sto se vec videlo da se izvrsava implicitna konverzija u boolean tip

```js
var a = 42;
var b = null;
var c = "foo"

if(a && (b || c)) console.log("da"); // "da"
```

Prvo se ulazi u unutrasnju zagradu i konvertuje vrednost promenljive b u tip boolean, sto ce biti _false_ (a ako je vrednost operanda s leve strane u operaciji || onda se uzima vrednost s desne strane - "foo"). Zatim se konvertuje vrednost promenljive a u tip boolena, sto je true (a kod operatora && ako je vrednost s leve strane _true_, rezultat poredjenja je vrednost operanda s desne strane - "foo"). Onda se izvrsava implicitna konverzija vrednosti "foo" u tip boolean, sto je _true_, pa uslov prolazi i izvrsava se zadata naredba u bloku koda.

### Konverzija simbola

Eksplicitna konverzija iz tipa _symbol_ u tip _string_ je dozvoljena, ali implicitna nije.

```js
var a = Symbol("cool");
var b = String(a); // "Symbol(cool)"

var c = Symbol("not cool");
var d = c + ""; // TypeError: can't convert symbol to string
```

## Labava jednakost i striktna jednakost

Poredjenje jednakosti moze biti labavo (==) i striktno (===).

Razlika je sto labavo poredjenje dozvoljava konverziju tipova pri ispitivanju jednakosti, dok striktno poredjenje to ne dozvoljava.

### Performanse pri ispitivanju vrednosti

Ne mora da te brine da li koriscenje striktnog operatora poredjenja usporava/ubrzava program/utice na performanse. Rec je o mikrosekundama (milioniti deo sekunde)...

Sustina je da li ti je za tok programa bitno da li je prilikom poredjenja doslo do konverzije tipa (koristeci ==) ili nije (koristeci ===).

### Apstraktna jednakost

Opis algoritma kojim se utvrdjuje jednakost izmedju vrednosti.

Ono na sta se svodi je da se prvo proverava da li su istog tipa vrednosti. Ako jesu, poredi se da li su iste vrednosti. U suprotnom (ako su tipovi razliciti), dolazi do konvertuje jednog ili oba u isti tip, pa se ponovo gleda da li su iste vrednosti.

#### Poredjenje: znakovni nizovi s brojevima

Ako je jedan od vrednosti tipa _string_ a drugi _number_, uvek ce se _string_ pretvoriti u tip _number_.

```js
var a = 42;
var b = "42";

a === b; // false
a == b; // true
```

Operacija labave nejednakosti prvo izvrsava labavu jednakost pa se njen rezultat negira.

#### Poredjenje: bilo sta s logickom vrednoscu

```js
var a = "42";
var b = true;

a == b; // false

/*
// "42" == true
// specifikacija kaze da ako je jedna vrednost
// tipa boolean ona se pretvara u number
// "42" == 1
// specifikacija kaze da ako se porede number
// i string, string se pretvara u number
// 42 == 1 -> false
*/
```

Cesto se desava da nas mozak to shvata pogresno. Kada pogledamo "42" == true mozak misli da je to jednako. Ali moramo da gledamo kako to operator labavog poredjenja vidi.

```js
// koristim se vrednostima iz
// prethodnog primera koda
if(a == true){/*nece biti izvrseno*/}
if(a === true){/*nece biti izvrseno*/}
if(a){/*ovde dolazi do implicitne konverzije i izvrsava se blok koda*/}
if(!!a){/*eksplicitan nacin konvertovanja i opet prolazi uslov*/}
if(Boolean(a)){/*ekspl. konvertovanje i prolazi uslov*/}
```

#### Poredjenje: vrednosti null i undefined

Po specifikaciji (poredjenje labave jednakosti) ako je jedna od vrednosti _null_ a druga _undefined_ rezultat je true.

```js
var a = null;
var b;

a == b; // true
a == null; // true
b == null; // true

a == ""; // false
a == false; // false
b == false; // false
a == 0; // false
b == 0; // false
```

Konverzija izmedju vrednosti _null_ i _undefined_ je predvidljiva i bezbedna za koristiti.

```js
var a = doSomething();

if(a == null){/*izvrsi samo ako f-ja vrati null ili undefined*/}
```

#### Poredjenje: objekti sa skalarnim vrednostima

Poredjenje primitivne vrednosti s objektom (bilo koje vrste) dovodi do toga da se objekat pretvara u primitivnu vrednost pomocu operacije ToPrimitive.

```js
var a = 42;
var b = [42];

a == b; // true

/*
// masina vidi objekat -> iskoristi ToPrimitive
// 42 == "42"
// 42 == 42 -> true
*/
```

```js
var a = null;
var b = Object(a); // isto sto i `Object()`
a == b; // false

var c = undefined;
var d = Object(c); // isto sto i `Object()`
c == d; // false

var e = NaN;
var f = Object(e); // isto sto i `Number(e)`
e == f; // false
```

"Pakovanje" se za vrednosti _null_ i _undefined_ ne moze izvrsiti jer nemaju ekvivalentan objektni omotac. Vrednost NaN se moze upakovati u svoj ekv. objektni omotac Number, ali kada zbog == dodje do raspakivanja dovodi do NaN == NaN sto je uvek false.

### Granicni slucajevi

Lista granicnih slucajeva do kojih moze doci implicitnom konverzijom (koristeci labavu jednakost ==).

#### Ruzni trikovi

```js
Number.prototype.valueOf = function(){
  return 3;
}

new Number(2) == 3; // true
```

Ovo se dogadja zato sto levi operand nije broj, vec objekat koji pakuje vrednost 2. Implicitna konverzija poziva internu metodu _valueOf()_ gde nalazi vrednost 3.

```js
if(a == 2 && a == 3){
  // ...
}
```

>Pomisao "Nemoguce", ali je moguce...!

```js
var i = 2;

Number.prototype.valueOf = function(){
  return i++;
}

var a = new Number(42); // broj je nebitan

if(a == 2 && a == 3) console.log("Zasto komplikujem?");
// "Zasto komplikujem"
```

#### Poredjenje s vrednostima koje se ponasaju kao false

```js
"0" == false; // true - NIJE DOBRO
false == 0; // true - NIJE DOBRO
false == ""; // true - NIJE DOBRO
false == []; // true - NIJE DOBRO
"" == 0; // true - NIJE DOBRO
"" == []; // true - NIJE DOBRO
0 == []; // true - NIJE DOBRO
```

#### Suludi slucajevi

```js
[] == ![]; // true WTF??
```

>Ovaj se primer dao videti u proslom bloku koda, samo sto ga nisam tako primetio

Pre poredjenja jednakosti radi se pretvaranje u boolean (i obrcanje pariteta) opernda s desne strane. Zatim to izgleda vise kao slucaj koji smo videli.

```js
[] == false; // true
```

```js
2 == [2]; // true
"" == []; // true
```

```js
0 == "\n"; // true
0 == " "; // true

Number(" "); // 0
```

#### Provara logike

Pokusavam da shvatim zasto se ljudi boje implicitne konverzije i zasto je nazivaju greskom jezika. Kada bolje pogledam, tu ima samo sedam slucajeva koji dovode do zablue. A posto je pomenuto da nikada ne bi trebalo koristiti operaciju poredjenja gde je jedan od operanada _false_, znaci da ostaju jos tri slucaja do kojih moze doci "slucajno".

Pretpostavljam da je ljudi izbegavaju zato sto ne izuce sta se desava iza koda, odnosno, sta masina radi kada procita napisan kod.

A ona tri slucaja sto sam rekao da ostaju "cudna" i nerazjasnjena:

```js
"" == 0; // true - NIJE DOBRO
"" == []; // true - NIJE DOBRO
0 == []; // true - NIJE DOBRO
```

To je ono sto moras da zapamtis da ne mozes da koristis.
