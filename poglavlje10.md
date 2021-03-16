# Sada this postaje jasnije

> Podsetnik:<br>
> This je veza koja se uspostavlja sa funkcijom u zavisnosti od nacina pozivanja te iste funkcije

## Mesto pozivanja

**Mesto pozivanja (call-site)** je mesto u kodu na kome se poziva funkcija (ne deklaracija).<br>
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

Treba pronaci stvarno mesto poziva funkcije u stablu pozivanja kako bi shvatili sa cim se _this_ povezao.<br>
Upotrebom ugradjenih alatki za debug mozemo otkriti stablo pozivanja funkcija.

## Samo po pravilu

Potrebno je da ispitamo mesto pozivanja funkcije i utvrdimo koja od cetiri pravila vaze kako bi znali na sta _this_ upucuje.<br>

### Podrazumevano povezivanje (samostalan poziv funkcije)

Pravilo koje se primenjuje kada nijedno drugo nije primenljivo; default.

```js
function foo() {
  console.log(this.a);
}

var a = 2;

foo(); // 2
```

Prvo na sta treba obratiti paznju jeste to da su promenljive, koje su deklarisane u globalnom opsegu, sinonimi za svojstva globalnog objekta istog imena. _a_ == _window.a_<br>
Drugo, prilikom poziva funkcije _foo()_ _this_ se povezuje sa globalnim objektom.<br>
Zasto se bas primenilo podrazumevano povezivanje?<br>
U navedenom primeru _foo()_ se poziva u obliku obicne i nedekorisane reference same funkcije.<br>
Da je bio ukljucen striktni rezim, ne bi moglo da dodje do podrazumevanog povezivanja (globalni objekat nije upotrebljiv) pa bi _this_ bilo povezano sa _undefined_.

```js
function foo() {
  "use strict";
  console.log(this.a);
}

var a = 2;

foo(); // TypeError: this is undefined
```

> globalni objekat je upotrebljiv za podrazumevano povezivanje samo ako u bloku koda iste funkcije nije definisan striktni rezim<br>
> za mesto pozivanja funkcije nije bitno da li je ukljucen striktni rezim

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

Kada pozivu funkcije prethodi referenca ne neki objekat znaj da se _this_ implicitno povezuje sa blokom koda tog objekta.<br>
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

> izgubili smo implicitnu vezu jer smo promenljivoj bar dodali referencu na funkciju foo<br>
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
