# Obecanja

## Sta je obecanje

### Buduca vrednost

Kada odes u Mek i narucis hamburger i platis, ostaje odredjeno vreme koje moras da sacekas da oni naprave hamburger. Ti za to vreme dobijas broj porudzbine koji predstavlja dokaz da si ti platio hamburger. Racun je trenutna zamena za hamburger. Kada on bude gotov mozes ga zameniti za racun. ALi takodje postoji i druga strana, ako nemaju dostupnih hamburgera. U tom slucaju ti moras da trazis drugo mesto gde ces jesti.

Obecanje se desava kada zatrazis od nekog izvora nesto, i ocekujes neki odgovor. On moze biti ili potvrdan (vraceno ti je to sto si trazio) ili negativan (nije uspesna transakcija).

#### Vrednosti sada i kasnije

Da bi na jednak nacin obradjivali f-je koje se izvrsavaju _sada_ i _kasnije_ sve prebacujemo da se izvrsavaju _kasnije_.

#### Vrednost obecanja

Vrednost pristiglog obecanja se ne moze nikako promeniti, ni slucajno, ni namerno.

### Dogadjaj zavrsetka obecanja

Posto obecanje moze biti ili ispunjeno ili odbijeno zato nad pristiglim odgovorom od obecanja mozemo da odvojimo da li je ono uspelo ili neuspelo. Sto nije bilo moguce u povratnim f-jama.

F-ja koja se koristi za dobijanje resursa iz stranog izvora (fetch) postavlja interno osluskivac (event listener) koji se svakako pokrece samo je pitanje da li je odgovor stigao uspesno ili nije.

Sto je jos jedna dobra stvar za razliku od povratnih f-ja jeste da mi taj odgovor u obliku objekta dobijamo da koristimo u nasem kodu. Ne zavisimo od nekog stranog izvora.

#### "Dogadjaji" razresavanja obecanja

## Pacje utvrdjivanje tipa thenable vrednosti

"Ako nesto izgleda kao patka, a i gace kao patka, onda je to sigurno i patka".

Provera da li je neki objekat ili f-ja obecanje moze se proveriti da li on/ona ima na raspolaganju f-ju _then_. Zato se i kaze da su obecanja - thenable vrednosti.

Provera se moze izvristi pacijim utvrdjivanje, sto bi izgledalo:

```js
if (
  p !== null &&
  (typeof p === "object" || typeof p === "function") &&
  typeof p.then === "function"
) {
  // jeste thenable vrednost
} else {
  // nije thenable vrednost
}
```

Potencijalna bomba bi ovde bila ukoliko objekat/funcija imaju internu metodu nazvanu _then_.

Jos bi veca bomba bila ako se napravi neki objekat koji nasledjuje objekat koji ima internu _then_ metodu, a mi ispitujemo da li nad izvedenoj vrednosti imam thenable vrednost...

## Pouzdanost obecanja

Obecanja resavaju sve nabrojane probleme povratnih f-ja, od kojih je:

- prerano pozivanje
- prekasno (ili nikad)
- preveliki ili premali broj puta
- s pogresnim parametrima ili okruzenjem
- zanemarivanje gresaka/izuzetaka do kojih je mozda doslo

### Prerano pozivanje povratne f-je

Za razliku od povratnih f-ja, gde moze da se desi da dodje do utrkivanja, obecanja to nikada ne mogu da prouzrokuju.

Razlog je taj sto i kada se obecanje razresi, izvrsavanje f-je zadate u _then_ metodi se nastavlja asihrono.

### Prekasno pozivanje povratne f-je

Kada se obecanje razresi, sve povratne f-je koje su registrovane pozivanjem metode _then_ pozivaju se, tim redosledom, odmah pri sledecoj asihronoj prilici.

```js
p.then(function () {
  p.then(function () {
    console.log("C");
  });
  console.log("A");
});

p.then(function () {
  console.log("B");
});

// A B C
```

> C ne moze da prestigne, niti da prekine B zbog nacina na koji obecanja rade

#### Posebnosti vremenskog rasporeda izvrsavanja f-ja pomocu obecanja

Preporucljivo je da kod koji pises ne zavisi od nekog redosleda razresavanja obecanja. Jer nikada ne znas sta se moze dogoditi s odgovorom i koliko ce kojem trebati da se razresi.

### Povratna f-ja se nikada ne poziva

Do ovoga ne moze doci kada su u pitanju obecanja, jer oba uvek vracaju neki odgovor bilo potvrdan ili odrican.

### Povratna f-ja koja se poziva premali ili preveliki broj puta

Premali broj puta = nikada se i ne poziva...

Preveliki = ne moze da se desi s obecanjima..

Obecanja su napravljena tako da i ako omotavajuca metoda pokusa opet da se pozove, obecanje ce biti samo jedanput razreseno.

### Neprosledjivanje odgovarajucih parametara/okruzenja

Ako kao argument prosledimo vise od jedne vrednosti, prva ce biti izvrsena, a ostale ce u tisini biti zanemarene. Ako zelimo da se prosledi vise vrednosti kao argument moramo koristiti listu (engl. array) ili objekat za tu svrhu.

### Zanemarivanje gresaka / izuzetaka

Razresavanja slucajeva kada je obecanje odbaceno je jako mocna stvar jer omogucava da se ono razresi asihrono, sto nece dovesti nikada do bilo kakvog utrkivanja.

Ako se desi greska TypeError ili ReferenceError obecanje preuzima odbaceno stanje i izvrsava f-ju koja mu je dodeljena za razresavanje tog problema.

Ako se slucajno desi da se obecanje uspesno razresi, ali mi napravimo gresu prilikom obrade tog obecanja prijavice nam TypeError gresku, iako je obecanje razreseno.

Logicno bi bilo da ako se desi greska, odmah predje u f-ju za razresavanje te greske. Ali bi to automatski znacilo da obecanje nije proslo. Malo dovodi do konfuzije...

```js
var p = new Promise(function (resolve, reject) {
  resolve(42);
});

p.then(
  function fulfilled(msg) {
    foo.bar(); // <- ne postoji, zato nastaje TypeError
    console.log(msg); // ovo se ne izvrsava
  },
  function rejected(err) {
    // ovde nikada ne ulazi
  }
);
```

### Pouzdano obecanje?

Ako mi je potrebno da od neke funkcije/metode obezbedim da mi se uvek vrati obecanje, za to se koristi metoda objekta Promise - _Promise.resolve(..)_.

```js
// Umesto
foo(42).then(function (v) {
  console.log(v);
});

// Sigurnije resenje
Promise.resolve(foo(42)).then(function (v) {
  console.log(v);
});
```

Ako slucajno pokusam da iskoristim ovu metodu da bih 100% bio siguran da ce mi se vratiti obecanje, dobicu samo to isto obecanje:

```js
var p1 = new Promise(resolve(42));

var p2 = Promise.resolve(p1);

p1 === p2; // true
```

### Uspostavljanje poverenja

Ukratko, obecanja sigurna za pravljenje robusnoh softvera i od njih se moze ocekivati ocekivano. Dodaje neku logiku za razliku od povratnih f-ja.

## Lancani tok obecanja

```js
var p = Promise.resolve(21);

var p2 = p.then(function (v) {
  console.log(v);
  // sada p2 ima vrednost 42
  return v * 2;
});
p2.then(function (v) {
  console.log(v);
});
```

Metoda _then_ nazad vraca obecanje, pa se to moze iskoristiti da bi se jos jedna _then_ metoda nakacila posle na to.

Jako je mocno kada se mora uciniti nesto s vrednoscu koju dobijes, a zatim da nastavis da ides kroz obecanje i odradis neku drugu stvar nad tim.

```js
var p = Promise.resolve(21);

var p2 = p
  .then(function (v) {
    return v * 2;
  })
  .then(function (v) {
    console.log(v); // 42
  });
```

Ili jos bolje, sve ulancane metode ce cekati na odgovor, koji moze da se izvrsi i asihrono.

```js
var p = Promise.resolve(21);

p.then(function (v) {
  console.log(v);
  return new Promise(function (resolve, reject) {
    // uvodi asihronizam
    setTimeout(function () {
      resolve(v * 2); // 42
    }, 100);
  });
}).then(function (v) {
  // izvrsava se nakon 100ms cekanja
  console.log(v); // 42
});
```

Mocna alatka kojom mogu da kontrolisem kada ce se razresiti/ispuniti obecanje..

Razresavanje obecanja u lancu je samo signal da se nastavi na sledeci korak.

Greske/izuzetci dolaze na nivou pojedinacnog obecanja, sto znaci da se svaka takva greska moze presretnuti u bilo kojoj tacki lanca i odraditi tako da se na tom mestu ceo lanac "vrati" u normalan rad:

```js
request("https://some.url.1/")
  .then(function (response) {
    foo.bar(); // ovde se desava greska
    return request("https://some.url.2/?v=" + response);
  })
  .then(
    function fulfilled(response2) {
      // nikada ne stizemo
    },
    function rejected(error) {
      console.log(error);
      return 42;
    }
  )
  .then(function (msg) {
    console.log(msg); // 42
  });
```

Ukoliko programer ne zada neku vrednost f-je kao prvi argument funkcije za fetchovanje ona ima svoju default vrednost:

```js
var p = new Promise.resolve(42);

p.then(null, function rejected(err) {
  console.log(err);
});

// Ako je obecanje razreseno, ono ce po defaultu (osim ako mu nije drugacije receno/napisano), vratiti dobijenu vrednost, sto je u ovom slucaju 42.
```

- Pozivanje funkcije _then(..)_ obecanja cine da se automatki generise novo obecanje koje taj poziv vraca
- Unutar povratnih f-ja za ispitivanje/odbacivanje obecanja, ako vracate odredjenu vrednost ili dodje do izuzetka, u skladu s time se razresava i novo vraceno obecanje (koje se dalje moze ulancavati)
- Ako povratna f-ja za razresavanje ili odbacivanje obecanja vraca novo obecanje, iz njega se izdvaja konkretna vrednost u koju je razreseno, a zatim ta vrednost postaje vrednost u koju se razresava sledece ulancano obecanje vraceno iz tekuce f-je _then(..)_

### Terminologija: razresavnje, ispunjavanje i odbacivanje

Konstruktor obecanja prima dve f-je: jednu koja se uglavnom poziva kada je obecanje ispunjeno i drugu koja se uvek poziva na odbacivanje obecanja.

Uglavnom se poziva f-ja za ispunjavanje jer postoji mogucnost da se u toj f-ji odgovor obecanja obradi kao odbaceno:

```js
var rejectedTh = {
  then: function (resolved, rejected) {
    rejected("Uh");
  },
};

var rejectedPr = Promise.resolve(rejectedTh);
// Iako bi ovo obecanje trebalo da se vodi kao ispunjeno, to nece biti slucaj.
```

ES6 specifikacija povratne f-je metode _then(..)_ naziva _onFulfilled(..)_ i _onRejected(..)_.

### Obrada gresaka

Prvo povratna f-ja za obradu greske (engl. _error-first callback_) - model obrade gresaka:

```js
function foo(cb) {
  setTimeout(function () {
    try {
      var x = baz.bar();
      cb(null, x);
    } catch (err) {
      cb(err);
    }
  }, 100);
}

foo(function (err, val) {
  if (err) {
    console.log(err);
  } else {
    console.log(val);
  }
});

/*
// Popularan model obrade gresaka koji proverava samo
// da li se desila greska. Ukoliko nije, znaci da je
// uspesno..
*/
```

Obecanja su napravljena na malo drugaciji nacin. Ako se desi neka greska prilikom obrade pristiglih podataka bice prijavljena greska, ali ne u smislu da je obecanje neispunjeno.

```js
var p = Promise.resolve(42);

p.then(
  function fulfilled(msg) {
    console.log(msg.toLowerCase()); // greska!
  },
  function rejected(err) {
    // ovde nikada ne stizem
  }
);

// Iako se desila greska prilikom obrade odgovora, obecanje nece prijaviti gresku f-ji za obradu greske.
```
