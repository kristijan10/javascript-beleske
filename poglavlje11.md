# Objekti

## Sintaksa

Objekti se mogu naci u dva oblika:

1. Deklarativnom (literalnom) i
2. Konstruisanom

```js
// Literalni oblik
var obj = {
  key: value,
};

// Konstruisani oblik
var obj = new Object();
obj.key = value;
```

## Tip objekta

Proste primitivne vrednosti (number, string, boolean, null i undefined) nisu tipa object.

> Zanimljiva "greska"
>
> ```js
> typeof null; // "object"
> ```

Iako se ova greska pojavljuje, null je zaseban primitivni tip.<br>
Nije sve u JavaScriptu objekat, kao sto kazu, ali postoje podtipovi objekata (slozeni literali).<br>
U slozene literale spadaju funkcije i nizovi.<br>
Za funkcije se kaze da su objekti prve klase jer su, funkcije, u osnovi samo objekti koji imaju pridodatu semantiku za povezivanje.

### Ugradjeni objekti

Ugradjeni objekti:

- String
- Number
- Boolean
- Object
- Function
- Array
- Date
- RegExp (Regular Expression - regularni izrazi)
- Error

Iako nazivom podseca na tip podataka ili klase, predstavlja ugradjene funkcije, koje sa pozivom uz rezervisanu rec _new_, konstruisu nove objekte.

```js
var primitiveString = "Kristijan";
typeof primitiveString; // "string"
primitveString instanceof String; // false

var stringObject = new String("Kristijan");
typeof stringObject; // "object"
stringObject instanceof String; // true
console.log(stringObject); // String{ "Kristijan" };
```

String "Kristijan" (ili bilo koji drugi) je prost primitivni tip (literal), a da bi nad njim izvrsavali metode kao sto su _lenght_, _charAt_ prevodilac inplicitno nas string pretvara u podtip objekta - String odakle uzima reference na definisane funkcije, odnosno metode. To se isto desava i sa drugim prostim vrednostima (number, boolean).<br>
Null i undefined nemaju svoj omotacki oblik tipa object. Suprotno njima objekat Date nema svoj prost tip koji omotava.
Object, Array, Function i RegExp su objekti, bez obzira da li uporebljavamo literalni ili konstruisani oblik deklaracije objekta. Uglavnom se koristi literalni oblik. A ako su potrebne dodatne opcije, koristi se konstruisani oblik.<br>
Error se ne definise toliko cesto eksplicitno, ali se automatski javlja kada se dogodi izuzetak.
