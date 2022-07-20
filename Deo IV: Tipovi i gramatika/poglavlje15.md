# Tipovi

**Tip (engl. _type_)** - ugradjeni skup karakteristika koji jednoznacno identifikuje ponasanje date vrednosti i cini je razlicitom od drugih vrednosti.

## Tip pod bilo kojim drugim imenom

Kako bi bili sigurni u to da smo sigurno obavili konverziju iz jednog u drugi tip treba nam detaljno razumevanje kako do njih dolazi, kao i o opstim stvarima u vezi tipova i vrednosti

## Ugradjeni tipovi

Postoji sedam ugradjenih tipova:

1) undefinde
2) null
3) boolean
4) number
5) string
6) object
7) symbol

Prilikom ispitivanja kojeg je tipa _null_ JS vraca gresku, prikazuje ga kao _objekat_.

```js
typeof null === "object"; // true
```

Svi ostali tipovi prikazuju svoje odgovarajuce znakovne vrednosti.

Ako zelim da proverim da li je vrednost promenljive null, potreban mi je kombinovan uslov:

```js
var a = null;
(!a && typeof a === "object"); // true
```

_null_ je jedina primitivna vrednost koja se ponasa kao _false_ a koja vraca rezultat _object_ kada se ispituje pomocu operatora _typeof_.

_typeof_ moze da vrati jednu od sedam znakovnih vrednosti: object, string, number, symbol, undefined, boolean, function

```js
typeof function a(){/*...*/} === "function"; // true
```

Smatra se da je funkcija - objekat koji se poziva. On ima interno svojstvo [[Call]] koje mu omogucava da se poziva.

Duzina funkcije - koliko parametara funkcija prima.

```js
function a(b, c){
  // ...
}

a.length; // 2
```
