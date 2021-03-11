# Polifilovanje opsega vidljivosti velicine bloka

Kako bi koristili prednosti opsega vidljivosti velicine bloka u ranijim vezijama ES-a preporucljivo je da koristimo alatke koje kod ES6 pretvaraju u kod koji razumeju ranije verzije ES.<br>
Primer rezultata tih alatki:

```js
{
  let a = 2;
  console.log(a); // 2
}
console.log(a); // ReferenceError

// Pretvara u:

try {
  throw 2;
} catch (a) {
  console.log(a); // 2
}
console.log(a); // ReferenceError
```

## Alatka Traceur

To je projekat koji odrzava Google i koji od ES6 koda pravi ekvivalentan kod koji radi u starijim verzijama, najcesce ES5.

```js
// Od prethodno navedenog koda alatka Traceur ce vratiti:
{
  try {
    throw undefined;
  } catch (a) {
    a = 2;
    console.log(a);
  }
}
console.log(a);
```

## Implicitni i eksplicitni blokovi

Let blok

```js
// Proveriti, meni ovo ne radi, ne radi zato sto ES6 ne podrzava ovo
let (a=2){
  console.log(a);
}
console.log(a);
```

_Let_ iskaz, formira svoj eksplicitni blok za ciji se opseg vidljivosti vezuje.<br>
Kao sto sam napisao u komentaru, let iskaz ne radi u ES6 verziji, ne sa tom sintaksom.<br>
Kako bi resili to, postoje dva resenje:

1. Kod mozemo formatirati uz primenu ES6 sintakse

```js
{
  let a = 2;
  console.log(a); // 2
}
console.log(a); // ReferenceError
```

2. Postoje alatke koje ce to uciniti umesto nas. [let-er](https://github.com/getify/let-er) je alatka koju je napravio autor knjige koja radi na princip transpajlera koda. Posao mu je da pronadje sve oblike iskaza let i da ih konvertuje u let deklaracije (let blok).
