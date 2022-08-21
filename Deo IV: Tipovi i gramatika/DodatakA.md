# JavaScript za razlicita okruzenja

## Annex B (specifikacija ECMAScript)

ECMAScript je ustvari zvanicno ime jezika. JavaScript je implementacija ECMASCript jezika namenjena za veb citace.

Zvanicna specifikacija jezika ECMAScript sadrzi "Annex B", ciji predmet su specificna odtupanja od zvanicne specifikacije, a svha mu je postizanje kompatibilnosti s verzijom JS-a za citace veba.

### Specifikacija Web ECMAScript

Specifikacija Web ECMAScript opisuje razlike izmedju zvanicne specifikacije EMCAScript i tekuce implementacije JS-a namenjene citacima veba.

Moze se pogledati na [linku](https://tc39.es/ecma262/multipage/additional-ecmascript-features-for-web-browsers.html)

## Objekti okruzenja

Neki objekti su nam dati na raspolaganje u zavisnosti od toga u kom okruzenju se JS izvsava.

Primer objekta bi bio _console_. Kada se on koristi u pretrazivacu povezuje se s konzolom, dok ako se koristi u okruzenju node objekat _console_ se povezuje s standardnim izlaznim tokom (stdout).

## Globalne DOM promenljive

HTML nad elementima koji imaju podesen id pravi globalne promenljive istog imena (id) i za vrednost mu je postavljen HTMLElement nad kojim je id postavljem.

```html
<h1 id="foo">Zdravo</h1>
<script>console.log(foo)</script>
<!-- <h1 id="foo"> -->
```

## Izvorni prototipovi

Ukratko, nikada ne treba menjati prototipske metode jer moze dovesti do gresaka u nekim od okruzenja.

Ako se desilo da neka metoda ne postoji/ne reaguje onako kako bi se moglo ocekivati od nje, trebalo bi napisati test za svaku od koriscenih metoda.

Autor je dao primer koji je on doziveo. Kada je dodavao u prototip neku metodu radila je na svim okruzenjima, do jednog dana kada su otkrili da na specificnom okruzenju ne radi. Proveo je nedelju dana trazeci gresku, i na kraju je naisao na dodatak programera u Netscape pretrazivacu koji je izgledao ovako:

```js
// Netscape 4 doesn't have Array.push
Array.prototype.push = function(item){
   this[item.length - 1] = item;
}
```

>Programer nije predvideo da ce se moci prosledjivati i vise od jednog argumenta metodi push

Test da li se odredjena metoda ponasa onako kako bi trebala da se ponasa je da hard codujes njeno ponasanje:

```js
(function(){
   if(Array.prototype.push){
      var a = [];
      a.push(1, 2);
      if(a[0]===1 && a[1]===2){
         // prosao je test, bezbedna je za upotrebu
         return;
      }
   }
   throw Error("Metode Array.push() nema ili je neupotrebljiva");
})();
```

Iako je naporno pisati test za svaku metodu, jedini pravi odgovor na to kako resiti probleme kada neka metoda ne radi kako je ocekivano je da se **ne petlja s prototipovima**.

### Simovi/polifilovi

Razlika izmedju sima (engl. shim) i polifila je to sto sim i testira ukladjenost metode s standardima dok polifil testira samo postojanje metode u trenutnom okruzenju.

## HTML elementi <script\>

Svaki uvezeni JS fajl preko taga script se ponasa kao zaseban program ali svi imaju jedan zajednicki parent objekat _window_.

## Rezervisane reci

Ukratko, ne zadaj imena promenljivih nekim recima iz liste rezervisanih reci.

Lista rezervisanih reci:

>Let this long package float,
>
>Goto private class if short.
>
>While protected with debugger case,
>
>Continue volatile interface.
>
>Instanceof super synchronized throw,
>
>Extends final export throws.
>
>Try import double enum?
>
>False, boolean, abstract function,
>
>Implements typeof transient break!
>
>Void static, default do,
>
>Switch int native new.
>
>Else, delete null public var
>
>In return for const, true, char
>
>…Finally catch byte.

## Ogranicenja koja uvodi implementacija jezika

Definisana ogranicenja:

- Maksimalan broj znakova dozvoljen u znakovnom literalu (ne znakovna vrednost)
- Velicina (u bajtovima) podataka koji se prosledjuju kao argumenti pri pozivanju funkcije (u smislu velicina steka)
- Broj parametara u deklaraciji f-je
- Maksimalna dubina neoptimizovanog stabla pozivanja (pri rekurziji): koliko moze biti dugacak lanac pozivanja f-ja
- Broj sekundi koliko JS program moze raditi prilikom blokiranja veb pretrazivaca
- Maksimalna duzina imena promenljivih

## Sazetak poglavlja

Retko se desava da JS radi izolovano, vec radi u okruzenjima gde se mesa s kodom iz spoljasnih biblioteka, a ponekad radi cak i u masinama/okruzenjima koja se razlikuju od onih u citacima veba.

To treba imati na umu radi povecavanja pouzdanosti i robusnosti koda.
