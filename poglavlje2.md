# Uvod u JavaScript

## Vrednosti i tipovi
JavaScript ima ukupno 7 tipova:
1. string
2. number
3. boolean
4. null 
5. undefined
6. object
7. symbol (novina u ES6)

U JS-u samo vrednosti imaju definisan tip, dok su promenljive samo kontejneri za te vrednosti.
> U C jeziku promenljive imaju definisane tipove, dok vrednosti nemaju.

```js
// Zanimljiva greska u JS
typeof(null); // "object"
```

### Objekti
Slozena vrednosti kojoj se moze zadavati vrednost na imenovane lokacije (svojstva), koja imaju svako svoju vrednost datog tipa.<br>
Svojstvima se pristupa pomocu notacije s tackom (obj.a) i notacije sa uglastim zagradama (obj["a"]).
> Notacija sa tackom se cesce koristi jer je prostija i razumljivija.<br>
> Notacija sa zagradama se koristi kada je 'kljuc' (imenovana lokacija) tipa string. Ova notacija (sa zagradama) zahteva promenljivu ili vrednost tipa string.

```js
var obj = {
    a: "hello world",
    "broj": 42
}

var b = "a";

obj.a // "hello world"
obj["broj"]; // 42
obj[b]; // "hello world"
```

#### Nizovi
Nemaju zaseban tip vrednosti array ili nizovi, vec su pripojeni tipu _object_. Ono pocemu se razliku je objecta jeste to sto nema imenovana svojstva vec se vrednosti indeksiraju numerickim vrednostima.
```js
var a = [0, 1, 2, 3, 4];
// Prva vrednost ima index 0, druga vrednost ima index 1
a[0]; // 0
a[1]; // 1
a[2]; // 2
```

#### Funkcije
Isto kao i nizovi, funkcije nemaju zaseban tip vrednosti vec pripadaju podskupu _object_.
```js
function foo(){
    return 42;
}

foo.bar = "hello world";
// ^ Moze se koristiti kao objekat, ali se to retko radi.

typeof(foo); // "function"
typeof(foo()); // "number"
typeof(foo.bar) // "string"
```

### Ugradjene metode tipova