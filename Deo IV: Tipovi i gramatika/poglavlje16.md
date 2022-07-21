# Vrednosti

Nizovi (array), znakovni niz (string, ili po naski niska) i brojevi (number) cine najosnovnije gradivne blokove programa.

## Nizovi

To su samo kontejneri koji mogu sadrzati vrednosti proizvoljnog tipa - od string ili number, do object, pa cak i drugi nizovi (sto je nacin na koji se dobiju visedimenzioni nizovi).

Iako je moguce deklarisati clanove niza a da pritom ostavljamo neka mesta prazna, ali se to ne preporucuje.

```js
var a = [];

a[0] = 1;
a[2] = 3;

a[1]; // undefined
a.length; // 3
```

Jos nesto sto se ne preporucuje je da zadajem index znakovnog tipa, jer bi tada trebao koristiti objekat, ne listu.

```js
var a = [];

a['footbal'] = 2;
a["13"] = 14;

a.legth; // 14
```

### Vrednosti nalik nizovima

Kako bi iskoristili metode lista, slicne iglede array listama mozemo pretvoriti u appray listu.

Jedan od tih slicnih primera je prilikom igranja s DOM-om. Kada biramo vise slicnih elemenata masina nam vraca odgovor u obliku _NodeList_. A drugi primer je koriscenjem rez. reci _arguments_ u opsegu vidljivosti funkcije.

```js
function foo(){
  // slice(..) je metoda kojom pravim listu
  var arr = Array.prototype.slice.call(arguments);
  /*
  // U es6 je olaksano pravljenje liste
  // var arr2 = Array.from(arguments);
  */
  arr.push("bar");
  console.log(arr);
}

foo("baz", "bam"); // ["baz", "bam", "bar"]
```

## Znakovni nizovi

Moglo bi se pomisliti da je znakovni niz (string) samo kopija listi (array). Pristup znakovima na nacin nakoji bi pristupali nekoj vrednosti liste nije preporucljiv.

```js
var a = "foo";
var b = ["f", "o", "o"];

a[1]; // "o"
b[1]; // "o"

// ispravna sintaksa bi bila:
a.charAt(1);
```

Javascriptov objekat _string_ je nepromenljiv, dok je objekat _array_ prilicno promenljiv. Nepromenljiv u smislu da kada radimo nesto nad njim, pravi se nova kopija trenutnog, pa se nad njim izvrsava i kasnije cuva u zadatoj promenljivoj. Nasuprot tome, mnoge metode niza koje menjaju sadrzaj zapravo to rade u samom nizu (ne prave kopije).

Jos jedan primer kako znakovni nizovi i liste nemaju ni zajednicke metode je primer koji se najcesce pojavljuje na razgovoru za posao, obrtanje redosleda stringa.

```js
/*
// undefined je zato sto ne
// postoji to svojstvo za
// vrednosti tipa string
*/
a.reverse; // undefined

b.reverse(); // ["o", "o", "f"]
b; // ["o", "o", "f"]

/*
// jedino resenje je da string
// prebacimo u niz, odradimo reverse
// i vratimo u string
*/

// razvajamo znakove u niz, obrcemo i spajamo u string
var c = a.split("").reverse().join("");

c; // "oof"
```

>Izgleda ruzno sintaksa ovog resnja i nije preporucena
