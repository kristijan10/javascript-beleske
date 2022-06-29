# Sada this postaje jasnije

> Podsetnik:
>
> This je veza koja se uspostavlja sa funkcijom u zavisnosti od nacina pozivanja te iste funkcije

## Mesto pozivanja

**Mesto pozivanja (call-site)** je mesto u kodu na kome se poziva funkcija (ne deklaracija).

Kako bi pronasli mesto na kome se funkcija poziva moramo na umu imati **stablo pozivanja (call-stack)**, koje cine sve funkcije koje su bile pozvane pre nego sto smo stigli do poziva funkcije.

```js
function baz() {
  // stablo pozivanja se sastoji od: 'baz'
  // mesto pozivanja ove funkcije se nalazi u globalnom opsegu; 1

  console.log("baz");
  bar(); // evo ga poziv; 2
}
function bar() {
  // stablo pozivanja se sastoji od: 'baz' -> 'bar'
  // mesto pozivanja ove funkcije nalazi se u baz opsegu; 2

  console.log("bar");
  foo(); // evo ga poziv; 3
}
function foo() {
  // stablo pozivanja se sastoji od: 'baz' -> 'bar' => 'foo'
  // mesto pozivanja ove funkcije se nalazi u bar opsegu; 3

  //debugger; pomaze nam prilikom otkrivanja stabla pozivanja funkcija
  console.log("foo");
}
baz(); // evo ga poziv u globalnom opsegu; 1
```

Treba pronaci stvarno mesto poziva funkcije u stablu pozivanja kako bi shvatili sa cim se _this_ povezao.

Upotrebom ugradjenih alatki za debug mozemo otkriti stablo pozivanja funkcija.

## Samo po pravilu

Potrebno je da ispitamo mesto pozivanja funkcije i utvrdimo koja od cetiri pravila vaze kako bi znali na sta _this_ upucuje.

### Podrazumevano povezivanje (samostalan poziv funkcije)

Pravilo koje se primenjuje kada nijedno drugo nije primenljivo; default.

```js
function foo() {
  console.log(this.a);
}

var a = 2;

foo(); // 2
```

Prvo na sta treba obratiti paznju jeste to da su promenljive, koje su deklarisane u globalnom opsegu, sinonimi za svojstva globalnog objekta istog imena. _a_ == _window.a_

Drugo, prilikom poziva funkcije _foo()_ _this_ se povezuje sa globalnim objektom.

Zasto se bas primenilo podrazumevano povezivanje?

U navedenom primeru _foo()_ se poziva u obliku obicne i nedekorisane reference same funkcije.

Da je bio ukljucen striktni rezim, ne bi moglo da dodje do podrazumevanog povezivanja (globalni objekat nije upotrebljiv) pa bi _this_ bilo povezano sa _undefined_.

```js
function foo() {
  "use strict";
  console.log(this.a);
}

var a = 2;

foo(); // TypeError: this is undefined
```

>Globalni objekat je upotrebljiv za podrazumevano povezivanje samo ako u bloku koda iste funkcije nije definisan striktni rezim
>
>Za mesto pozivanja funkcije nije bitno da li je ukljucen striktni rezim

```js
function foo() {
  console.log(this.a);
}

var a = 2;

(function () {
  "use strict";
  foo(); // 2
})();
```

### Implicitno povezivanje

Da li mesto pozivanja funkcije ima objekat konteksta?

```js
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo,
};

obj.foo(); // 2
```

Kada pozivu funkcije prethodi referenca ne neki objekat znaj da se _this_ implicitno povezuje sa blokom koda tog objekta.

Vazan je samo poslednji u lancu poziva:

```js
function foo() {
  console.log(this.a);
}

var obj1 = {
  a: 2,
  obj2: obj2,
};

var obj2 = {
  a: 3,
  foo: foo,
};

obj1.obj2.foo(); // 3
```

#### Gubljenje implicitno uspostavljene veze

```js
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo,
};

var bar = obj.foo;
var a = "global";
bar(); // global
```

> izgubili smo implicitnu vezu jer smo promenljivoj bar dodali referencu na funkciju foo
>
> kako smo rekli, bitno je gde je funkcija pozvana, ovde imamo samo _bar()_ sto je obican poziv funkcije i zato se primenilo podrazumevano povezivanje

```js
function foo() {
  console.log(this.a);
}

function doFoo(fn) {
  fn();
}

var obj = {
  a: 2,
  foo: foo,
};

var a = "global";
doFoo(obj.foo); // global
```

### Eksplicitno povezivanje

Sve definisane funkcije imaju metode _call(..)_ i _apply(..)_ koje nam omogucavaju da zadamo na sta ce _this_ upucivati.

Metode prihvataju jedan parametar, a to je objekat sa kojim ce se _this_ povezati.

```js
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
};

foo.call(obj); // 2
```

Ako se umesto objekta, funkcijama _call_ i _apply_, prosledi neki drugi tip (string, number, boolean) ta vrednost tipa number ce se pretvoriti u svoj ekvivalentni objekat sa new Number. Ovo pretvaranje prostog tipa u objekat naziva se **pakovanje (boxing)**

#### Cvrsto povezivanje

Kako bi resili problem gubljenja implicitne veze nastalo je cvrsto povezivanje

```js
function foo() {
  console.log(this.a);
}

var obj = {
  a: 2,
};

var bar = function () {
  foo.call(obj); // 2
};

bar(); // 2
setTimeout(bar, 100); // 2
bar.call(window); // 2
```

Identifikatoru bar implicitno dodeljujemo poziv funkcije foo, kojoj za _this_ podesavamo objekat _obj_. Svakim pozivom _bar_ mi pozivamo funkciju _foo_, cije _this_ predstavlja opseg identifikatora _obj_.

Ne bitno kako pozovemo _bar_, _this_ funkcije foo ce uvek biti prikacen na _obj_, sto se zove **cvrsto povezivanje (hard-binding)**

Najuobicajniji nacin umotavanja funkcije u cvrstu vezu formira prolaz za sve argumente koje prosledite i povratnu vrednost koju dobijete:

```js
function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}

var obj = {
  a: 2,
};

var bar = function () {
  return foo.apply(obj, arguments);
};

var b = bar(3); // 2 3
console.log(b); // 5
```

```js
function foo(something) {
  return this.a + something;
}

function bind(fn, obj) {
  return function () {
    return fn.apply(obj, arguments);
  };
}

var obj = {
  a: 2,
};

var bar = bind(foo, obj);
var b = bar(3);
console.log(b); // 5
```

Posto je cvrsto povezivanje cesto koriscenja metoda u ES5 je dodata metoda funkcije Function.prototype.bind koji se koristi na sledeci nacin:

```js
function foo(something) {
  console.log(this.a, something);
  return this.a + something;
}

var obj = {
  a: 2,
};

var bar = foo.bind(obj);
var b = bar(3); // 2 3
console.log(b); // 5
```

Metoda bind(..) vraca funkciju koja poziva izvornu funkciju (foo()) sa kontekstom za this koji zadamo kao parametar funkciji bind.

#### Pozivanje API-ja s parametrom 'context'

Funkcije iz mnogih biblioteka, kao i nove funkcije imaju neobavezan parametar _context_.

Svrha mu je da interno pozove funkciju bind / call / apply i da podesi _this_ na zadatki objekat.

```js
function foo(el) {
  console.log(el, this.id);
}

var obj = {
  id: "awesome",
};

[1, 2, 3].forEach(foo, obj); // this se, za funkciju foo, postavlja u obj
// 1 awesome
// 2 awesome
// 3 awesome
```

### Povezivanje funkcija pomocu operatora new

**Konstruktor** je funkcija kojoj prethodi operator new. Nisu nikakve specijalne funkcije; ne generisu klase niti su vezane za njih.

Kada bi neku funkciju / metodu pozvali sa _new_ onda bi taj funkcijski poziv postao konstruktorski poziv funkcije. Ono sto se desava prilikom konstruktorskog poziva funkcije je sledece:

1. Konstruise se potpuno novi objekat
2. Novonastali objekat se povezuje sa [[Prototype]]
3. Na taj objekat, prilikom poziva funkcije, upucuje _this_
4. Funkcija pozvana sa operatorom new automatski vraca novonastali objekat

```js
function foo(a) {
  this.a = a;
}

var bar = new foo(2);
console.log(bar); // Object {a: 2}
console.log(bar.a); // 2
```

## Uvek po pravilu

Ukoliko se nadje vise pravila na jednom mestu, postoje prioriteti po kojima gleda koje je pravilo "jace".

- _Podrazumevano povezivanje_ je najnizeg prioriteta.

- _Implicitno povezivanje_ je sledeg prioriteta

- _Eksplicitno / cvrsto povezivanje_

- _Povezivanje sa new_

```js
function foo(something) {
  this.a = something;
}

var obj1 = {};

var bar = foo.bind(obj1);
bar(2);
console.log(obj1.a); // 2

var baz = new bar(3);
console.log(obj1.a); // 2
console.log(baz.a); // 3
```

```js
function foo(p1, p2) {
  this.val = p1 + p2;
}

var bar = foo.bind(null, "p1");
var baz = new bar("p2");
console.log(baz); // Object: {val: "p1p2"}
console.log(baz.val); // p1p2
```

### Odredjivanje sta this predstavlja

Postavi sebi sledeca pitanja i odredi na sta _this_ ukazuje.

1. Da li je funkcija pozvana sa operatorom _new_? Ako jeste _this_ predstavlja novonastali objekat.

    ```js
    var bar = new foo();
    ```

2. Da li je funkcija pozvana pomocu metode _call(..)_ ili _apply(..)_, ili cak umetnuta u cvrsto povezivanje pomocu funkcije _bind(..)_? Ako jeste _this_ predstavlja eksplicitno zadat objekat.

    ```js
    var bar = foo.apply(obj);
    var bar = foo.call(obj);
    var bar = (function baz(
      foo.bind(obj);
    ))();
    ```

3. Da li je funcija pozvana sa zadatim kontekstom (implicitno povezivanje)? Ako jeste _this_ predstavlja taj zadati objekat.

    ```js
    var bar = obj.foo();
    ```

4. U ostalim slucajevima, _this_ predstavlja podrazumevani objekat. Ako vazi striktni rezim, to je _undefined_ objekat, a ako ne vazi, to je _window_ objekat.

```js
var bar = foo();
```

## Izuzeci od pravila za povezivanje this

### Zanemareni this

Kada metodama _bind(..)_, _call(..)_ i _apply(..)_ prosledimo objekat koji je _null_ ili _undefined_ automatski se _this_ prebacuje na _podrazumevano povezivanje_.

```js
function foo() {
  console.log(this.a);
}

var a = 2;
foo.call(null); // 2
```

Ako funkciji koju pozivamo nije bitno na sta this upucuje, potrebna nam je zamena za taj objekat, a _null_ i _undefined_ su dobar izbor.

```js
function foo(a, b) {
  console.log("a: " + a + ", b: " + b);
}

// izdvajanje vrednosti parametra iz niza
foo.apply(null, [1, 2]); // a: 1, b:2

// parcanje parametara
var bar = foo.apply(null, 1);
bar(2); // a: 1, b: 2
```

Problem sa stalnim povezivanjem _this_ sa _null_, u nekim third-party biblioteci, moze slucajno izmeniti globalni objekat _window_.

#### Bezbedniji this

Kako ne bi doslo do neocekivanih gresaka, umesto _null_ upotrebicemo prazan objekat, sto ogranicava this samo na taj prazan objekat i uklanja mogucnost pojavljivanja greske. Taj objekat se zove **DMZ** (demiliterizovana zona).

```js
var ∅ = Object.create(null);
var npo = {}; // moze i ovako, ali onda se povezuje za tu promenljivu Object.prototype, sto onda nije prazan objekat.

console.log(∅, npo); // ∅: {}
                     // npo: {<prototype>: Object{...}};
```

```js
function foo(a, b){
  console.log("a: "+a+", b: "+b);
}

var ∅ = Object.create(null);

foo.apply(∅, [1, 2]); // a: 1, b: 2

var bar = foo.bind(∅, 1);
bar(2); // a: 1, b: 2
```

### Indirekcija

Jedan od najcescih razloga pojave indirektne refernce jeste dodeljivanje vrednosti. Tada se primenuje podrazumevano povezivanje.

```js
function foo() {
  console.log(this.a);
}

var a = 2;
var o = { a: 3, foo: foo };
var p = { a: 4 };

o.foo(); // 3
(p.foo = o.foo)(); // 2; indirektna referenca
```

### Labavo povezivanje

```js
// Functija za labavo povezivanje
if (!Function.prototype.softBind) {
  Function.prototype.softBind = function (obj) {
    var fn = this,
      curried = [].slice.call(arguments, 1),
      bound = function bound() {
        return fn.apply(
          !this ||
            (typeof window !== "undefined" && this === window) ||
            (typeof global !== "undefined" && this == global)
            ? obj
            : this,
          curried.concat.apply(curried, arguments)
        );
      };
    bound.prototype = Object.create(fn.prototype);
    return bound;
  };
}
```

> Povezuje tako sto zadatu funkciju umotava u logiku koja u vreme izvrsavanja ispituje stra je _this_, pa ako je global ili undefined, povezuje ga sa zadatim alternativnim podrazumevanim objektom.

```js
function foo() {
  console.log("name: " + this.name);
}

var obj = { name: "obj" },
  obj2 = { name: "obj2" },
  obj3 = { name: "obj3" };

var fooOBJ = foo.softBind(obj);
fooOBJ(); // name: obj

obj2.foo = foo.softBind(obj);
obj2.foo(); // name: obj2

fooOBJ.call(obj3); // name: obj3

setTimeout(obj2.foo, 10); // name: obj
```

## Leksicki this

Funkcija sa strelicom ima drugaciji nacin povezivanja; ne prati ona cetiri pravila. _This_ preuzima samo iz okruzujuceg opsega vidljivosti (opseg funkcije ili globalni).

```js
function foo() {
  return (a) => {
    console.log(this.a);
  };
}

var obj1 = {
  a: 2,
};

var obj2 = {
  a: 3,
};

var bar = foo.apply(obj1);
bar.call(obj2);
```

Leksicki se preuzima this onakvo kakvo je bilo prilikom poziva funkcije foo. To je pozvano sa foo.apply(obj1), sto znaci da _this_ upucuje na obj1.

Najcesce se koristi kod povratih funkcija, kao sto su obradjivaci dogadjaja i tajmeri:

```js
function foo() {
  setTimeout(() => {
    console.log(this.a);
  }, 100);
}

var obj = {
  a: 2,
};

foo.call(obj); // 2
```

```js
function foo() {
  var self = this;
  setTimeout(function () {
    console.log(self.a);
  }, 100);
}

var obj = {
  a: 2,
};

foo.call(obj); // 2
```

_self = this_ je trik koji se koristio pre ES6 verzije kako bi se koristio leksicki opseg vidljivosti. Zaobilazi se prava primena this mehanizma!

Iskljucuju standardni mehanizam this radi poznatijeg leksickog opsega vidljivosti. Koriscenjem arrow function zaobilazimo da koristimo, i ucimo this.
