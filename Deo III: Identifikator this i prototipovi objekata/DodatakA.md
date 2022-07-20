# ES6 sintaksa class

Ono sto je najbitnije zapamtiti iz ovog dela knjige je da osim klasnog modela pisanja koda, postoji jos jedna, mnogo bolji - OPDO.

## Mehanizam class

Vracamo se na primer Widget/Button iz poglavlja 14.

```js
class Widget{
  constructor(width, height){
    this.width = width || 50;
    this.height = height || 50;
    this.$elem = null;
  }

  render($where){
    if(this.$elem){
      this.$elem.css({
        width: this.width+"px",
        height: this.height+"px"
      }).appendTo($where);
    }
  }
}

class Button extends Widget{
  constructor(width, height, label){
    super(width, height);
    this.label = label || "Default";
    this.$elem = $('<button>').text(this.label);
  }

  render($where){
    super($where);
    this.$elem.click(this.onClick.bind(this));
  }

  onClick(evt){
    console.log("Button '"+this.label+"' clicked!");
  }
}
```

Osim sto je sintaksa lepsa, resila je i sledece probleme:

1) Nema vise referenci .prototype rasutih po kodu
2) _Button_ je deklarisan tako da direktno "nasledjuje" (extends) pa ne mora da pozivanjem metode _Object.create(..)_ zameni podrazumevani .prototype objekat
3) _super(..)_ pruza korisnu mogucnost relativnog polimorfizma, tako da svaka metoda na jednom nivou moze referencirati metodu koja se nalazi jedan nivo vise u lancu.
4) Sintaksa s literalom _class_ nije upotrebljivo za definisanje svojstava, vec samo metoda.
5) Rez. rec _extends_ omogucava da na "prirodan nacin" prosirujem cak i ugradjene objektne (pod)tipove kao sto su Array i RegExp.

### Zamke pri upotrebi sintakse class

Iako mozda izgleda da je ova nova sintaksa resila vecinu problema, nije. Ona je samo "ukras" postojeceg mehanizma (delegiranja) [[Prototype]].

To znaci da class ne kopira definicije staticki, u trenutku deklarisanja. Ako zamenim/izmenim odredjenu metodu u roditeljskoj "klasi", to ce uticati na "nasledjenu" buduci da one ne dobijaju kopije metode u vreme deklarisanja, nego i dalje koriste model delegiranja koji se zasniva na mehanizmu [[Prototype]].

```js
class C{
  constructor(){
    this.num = Math.random();
  }

  rand(){
    console.log("Random: "+this.num);
  }
}

var c1 = new C();
c1.rand(); // "Random: 0.70002"

C.prototype.rand = function(){
  console.log("Random: "+Math.round(this.num*1000));
}

var c2 = new C();

c2.rand(); // "Random: 208"
c1.rand(); // "Random: 700"
```

Sintaksa _class_ ne omogucava deklarisanje svojstava clanova klase. Ako mi je potrebno da pratim deljeno stanje izmedju vise instanci, preostaje samo upotreba .prototype sinktakse:

```js
class C{
  constructor(){
    // menjam deljeno stanje
    C.prototype.count++;

    // mogu pristupiti svojstvu zbog delegiranja
    console.log("Hello: "+this.count);
  }
}

C.prototype.count = 0;

var c1 = new C();
// "Hello: 1"

var c2 = new C();
// "Hello: 2"

c1.count === 2; // true
c1.count === c2.count; // true
```

Problem je sto class sintaksu upropastavam koriscenjem .prototype, zamka u tome sto iskaz _this.count++_ implicitno pravo zasebno zaklonjeno svojstvo _this.count_ i oba objekta c1 i c2, umesto da azurira deljeno stanje.

Osim toga, postoji i opasnost od nenamernog zaklanjanja:

```js
class C{
  constructor(id){
    // u ovoj instanci zaklanjam
    // metodu 'id()' vrednoscu svojstva

    this.id = id;
  }

  id(){
    console.log("Id " + id);
  }
}

var c1 = new C("c1");
c1.id(); // TypeError: 'c1.id' is not a function
c1.id; // "c1"
```

_super(..)_ se ne povezuje dinamicki kao sto to radi _this_. Ono se povezuje "staticki", u vreme deklarisanja.

```js
class P{
  foo() {console.log("P.foo")};
}

class C extends P{
  foo(){super()};
}

var c1 = new C();
c1.foo; // "P.foo"

var D = {
  foo: function() {console.log("D.foo")};
}

var E = {
  foo: C.prototype.foo;
}

Object.setPrototypeOf(E, D);

E.foo(); // "P.foo"
```

Shvatio sam sta je trebalo da se desi kada sam procitao; posto objekat _E_ delegira u objekat _D_, a svojstvu objekta _E_ je dodeljena vrednost funkcije _C.foo_, a _C.foo_ upucuje na poziv funkcije _P.foo_. Meni je obo bilo logicno kada sam pogledao kod. Uposte nisam video razlog zasto bi _E.foo_ vratio vpoziv funkcije _D.foo_.

_super()_ se ne povezuje dinamicki iz performanskih razloga, vec se njegovo tekuce stanje preuzima u vreme povezivanja iz [[HomeObject]].[[Prototype]], gde je [[HomeObject]] staticki dodeljen u vreme deklarisanja objekta.

>U ovom slucaju super() se i dalje razresava u P.foo(), buduci da je [[HomeObject]] te metode i dalje C, a C.[[Prototype]] je P

## Staticko je bolje od dinamickog?

U tradicionalnim jezicima orijentisanim na klase, definicija klase se nikada ne menja naknadno, pa zato model projektovanja s klasama ne predlaze takvu mogucnost. JS _class_ sintaksa pokusava bas to i da uradi.

Iako je JS dinamicki jezik, _class_ sintaksa nas tera da pisemo staticki kod, a ako zelimo to da izbegnemo moramo koristiti ruznu .prototype sintaksu.

_class_ kao da kaze "Posto je dinamicki nacin suvise tezak, pravicemo se da je JS staticki (a to on zapravo nije!")

## Sazetak dodatka A

Sintaksa class se cini kao da resava probleme primene modela projektovanja s klasama/nasledjivanjem u JS-u. Ali ona bas radi suprotno, skriva veliki deo tih problema, a uvodi nove - suptilne, ali opasne.
