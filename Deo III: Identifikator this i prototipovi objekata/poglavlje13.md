# Prototipovi

## Svojstvo [[Prototype]]

Svi objekti imaju interno svojstvo [[Prototype]] i cija vrednost je obicna referenca na neki drugi objekat.

```js
var myObj = {
  a: 2
}

myObj.a; // 2
```

Operacija [[Get]], koja se izvrsava kada referenciramo neko svojstvo objekta, kao sto je _myObj.a_.
Prvi korak je utvrdjivanje da li objekat sadrzi trazeno svojstvo, ako ga ima to se i koristi.
A ako [[Get]] operacija ne nadje trazeno svojstvo, ono nastavlja da sledi [[Prototype]] vezu ka drugom objektu.

```js
var anotherObj = {
  a: 2;
}

// pravi objekat povezan sa objektom 'anotherObj'
var myObj = Object.create(anotherObj);

myObj.a; // 2
```

Ovim postupkom dobijamo objekat _myObj_ koji je kroz svoje svojstvo [[Prototype]] povezans objektom _anotherObj_

**Ako _anotherObj_ ne bi imao svojstvo _a_, koje trazimo, [[Get]] operator bi trazio dalje kroz [[Prototype]] lanac** povezanih objekata da li se negde nalazi trazeno svojstvo.

Ako operator [[Get]] prodje ceo [[Protoype]] lanac, a **ne nadje trazeno svojstvo, operator vraca vrednost _undefined_**.

Slicna pretraga se dogadja kada petljom _for..in_ prolazimo kroz objekat.

```js
var anotherObj = {a:2};

var myObj = Object.create(anotherObj);

for(var k in myObj){
  console.log("ima svojstvo: " + k);
};
// ima svojstvo: a

("a" in myObj); // true
```

Kada trazim imena svojstava, bez obzira na oblik kojim to izvodim, uvek se pretrazuje [[Prototype]] lanac, veza po veza. Pretraga se prekida kada se nadje svojstvo ili ako se lanac zavrsi.
