# Delegiranje ponasanja

Sustina onoga sto je vazno za funkcionalnost medju objektima, sto mozemo iskoristiti, jeste **medjusobno povezivanje objekata**.

## Projektovanje orijentisano na delegiranje

Potrebno je da prebacimo nacin razmisljanja s modela klasa/nasledjivanja na model projektovanja sa delegiranjem ponasanja.

Kako to da uradimo razmotrit cemo u daljem kontekstu.

### Teorija klasa

Za demonstriranje upotrebe klasa uzecemo da imamo nekoliko slicnih poslova ("XYZ", "ABC").

- Prvo bi napravili klasu koja bi sadrzala zajednicka svojstva/metode,
- zatim izveli dve klase XYZ i ABC od osnovne klase, i redefinisali metode po potrebi posla.

Primer pseudokoda:

```c
class Task{
  id;

  // konstruktor
  Task(ID) id = ID;
  outputTask() output(id);
}

class XYZ inherits Task{
  label;

  // konstruktor
  XYZ(ID, Label){
    super(ID);
    label = Label;
  }
  outputTask(){
    // poziv izvorne verzije, ali dodajemo
    // malu izmenu, jos jedan output
    super();
    output(label);
  }
}

class ABC inherts Task{
  // ...
}
```

>Sada se ove nasledjene klase takodje mogu naslediti, i to tako u nedogled
>
>I uglavnom se na kraju radi sa izvedenim klasama, jer one imaju kopije ponasanja svih roditeljskih klasa (cak iako roditelj klase nad kojom radimo ima svog roditelja; mi imamo pristup i roditeljevom roditelju (dedi xD))

### Teorija delegiranja

Isti ovaj primer da pokusamo resiti projektovanja metodom delegiranja (behavior delegation).

- Prvo se definise objekat (ne klasa, ne funkcija, vec objekat) cije je ime Task i koji ce imati opste metode koje ce se delegirati u objekte za obavljanje razlicitih poslova.
- Zatim, za svaki posao ("XYZ", "ABC") definisati objekat koji ce imati ponasanja specificna za taj posao.
- Povezati objekte specificnih poslova s objektom Task (sto omogucava objektima specificnih poslova da delegiraju objektu Task)

Pomoc pri modelovanju s delegiranjem: razmisli koja su sve ponasanja potrebna potomcima da bi se obavio posao "XYZ".

Primer pseudokoda okrenutog na modelovanje s delegiranjem:

```js
Task = {
  setID: function(ID) this.id = ID;
  outputID: function() console.log(this.id);
}

XYZ = Object.create(Task);

XYZ.prepareTask = function(ID, Label){
  this.setID(ID);
  this.label = Label;
}

XYZ.outputTaskDetails = function(){
  this.outputID();
  console.log(this.label);
}

// ABC = Object.create(Task);
// ABC ... = ...
```

Ovaj stil koda autor zove **OPDO (objekti povezani drugim objektima)**.

Neka pravila za pisanje OPDO koda:

1) Svojstva _id_ i _label_ se cuvaju direktno u objektu "XYZ" (nijedno od ovih ne postoji kao deklarisno svojstvo objekta Task). Pri delegiranju pomocu mehanizma [[Prototype]], stanje cemo uglavnom cuvati u objektima koji delegiraju (XYZ, ABC), ne u delegatu (Task) kojem delegiraju.

2) Moze se primetiti da u OPDO stilu kodiranja nismo iskoristili polimorfizam. Razlog tome je sto na razlicitim nivoima [[Prototype]] lanca dolazi do zaklanjanja istoimenih metoda.

3) Pozivanjem metode _this.setID(ID)_ u objektu _XYZ_ [[Get]] operacija krece da trazi po lokalnom opsegu, gde ne nalazi metodu, zatim pretrazuje s cime je taj objekat povezan [[Prototype]] lancem, nalazi _Task_ objekat, gde nalazi i metodu _setID(..)_. Iako metodu nalazi u objektu _Task_, izvrsice je u kontekstu objekta _XYZ_, jer je _XYZ_ objektu omogucena upotreba metode jer je povezan s objektom _Task_ (delegira).

**Delegirati ponasanje** znaci omoguciti da jedan objekat (_XYZ_) delegira (prosledi) u drugi objekat (_Task_) razresenje reference svojstva ili metode ako ne postoji u samom izvornom objektu (_XYZ_).

Izuzetno mocan model projektovanja. Umesto hijerarhije ka dole (klase nasledjuju klase, i to stablo se grana ka dole), u OPDO metodi mozemo zamisliti objekte jedan pored drugog, kao ravnopravne ucesnike, pri cemu je smer delegiranja izmedju objekata proizvoljan i u skladu s potrebama.

#### Uzajamno delegiranje (nije dozvoljeno)

Ne mozemo formirati ciklus gde dva ili vise objekata delegiraju (dvosmerno) jedan u drugi.

>Ako povezem objekat B s objektom A, a zatim A povezem s B, prozurokovacu gresku.

Kada bi referencirao neko svojstvo/metodu koja ne postoji u ni u jednom objektu, dobijam beskonacnu rekurziju u [[prototype]] petlji.

Ali i kada bi postojale, onda bi B mogao delegirati u A, sto znaci da bi mogao podesiti tako da jedan delegira u drugi, za razne poslove.

#### Ispravljena greska

Chrome, u vreme pisanja knjige, je imao razlicit nacin prikazivanja da li je objekat napravljen pomocu operatora _new_ ili je nepravljen pomocu metode _Object.create()_.

```js
function Foo(){}

var a1 = new Foo();

a1; // Foo{} (Chrome)
a1; // Object{} (Firefox)
```

>Chrome u sustini kaze: "_a1_ je prazan objekat za ciju konstrukciju je odgovorna funkcija _Foo_"
>
>Firefox kaze: "_a1_ je prazan objekat konstruisan pomocu objekta _Object_"

Ova greska bi trebala da je ispravljena.

Ovo Chromovo specificno ucitavanje internog "imena konstruktora" korisno je samo ako u potpunosti primenjujemo stil kodiranja s klasama.

### Poredjenje mentalnih modela

Primer koda koriscenjem klasnog pristupa (OO - objekct oriented):

```js
function Foo(who){
  this.me = who;
}

Foo.prototype.identify = function(){
  return "I am " + this.me;
}

function Bar(who){
  Foo.call(this, who);
}

Bar.prototype = Object.create(Foo.prototype);

Bar.prototype.speak = function(){
  alert("Hello " + this.identify() + ".");
}

var b1 = new Bar("b1");
var b2 = new Bar("b2");

b1.speak(); // "Hello I am b1"
b2.speak(); // "Hello I am b2"
```

OPDO pristupom bi to izgledalo:

```js
var Foo = {
  init: function(who){
    this.me = who;
  },
  identify: function(){
    return "I am " + this.me;
  }
}

var Bar = Object.create(Foo);

Bar.speak = function(){
  alert("Hello " + this.identify() + ".");
}

var b1 = Object.create(Bar);
b1.init("b1");

var b2 = Object.create(Bar);
b2.init("b2");

b1.speak(); // "Hello I am b1"
b2.speak(); // "Hello I am b2"
```

## Poredjenje klasa i objekata

Do sada smo imali primere kako bi prikazali teorijsko objasnjenje metoda "klasa" u poredjenju sa "delegiranjem ponasanja", a u nastavku cemo praviti real-world komponente.

### "Klase" za elemente korisnickog interfejsa

>U ovom primeru je koristen JQuery za DOM i CSS za stilizovanje, iako ne znam sintaksu, to nije bitno, ono sto je vazno je da se primeti nacin pravljenja tog "klasnog" modela

```js
// Roditeljska klasa
class Widget(width, height){
  this.width = width || 50;
  this.height = height || 50
  this.$elem = null;
}

Widget.prototype.render = function($where){
  if(this.$elem){
    this.$elem.css({
      width: this.width + "px",
      height: this.height + "px"
    }).appendTo($where);
  }
}

// Klasa potomak
class Button(width, height, label){
  // pozivanje "super" konstruktora
  Widget.call(this, width, height);
  this.label = label || "Default";

  this.$elem = $("<button>").text(this.label);
}

// klasa 'Button' "nasledjuje" klasu 'Widget'
Button.prototype = Object.create(Widget.prototype);

// redefinisanje nasledjene metode 'render(..)'
Button.prototype.render = function($where){
  // pozivanje "super" klase
  Widget.prototype.render.call(this, $where);
  this.$elem.click(this.onClick.bind(this));
}

Button.prototype.onClick = function(evt){
  console.log("Button '" + this.label + "' clicked!");
}

$(document).ready(function(){
  var $body = $(document.body);
  var btn1 = new Button(125, 30, "Hello");
  var btn2 = new Button(150, 40, "World");

  btn1.render($body);
  btn2.render($body);
})
```

Poziv _this_-a u kodu gde redefinisemo metodu _render_ je stvarno previse zestokog izgleda...

Pridrzava se konvencije da u roditeljskoj klasi ima osnovnu verziju funkcije, pa da u izvedenoj samo na to dodam ono sto je specificno za taj objekat (polimorfizam), ali kada se pogleda poziv "super" konstruktora moze lako da se pogubi.

A sada ce biti prikazan kod cija je namena ista kao i prethodnog koda, samo ce se koristiti "lepsa" sintaksa uvedena u ES6 (_class_).

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
        width: this.width + "px",
        height: this.height + "px"
      }).appendTo($where)
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
    console.log("Button '" + this.label + "' clicked!");
  }
}

$(document).ready(function(){
  var $body = $(document.body);
  var btn1 = new Button(125, 30, "Hello");
  var btn2 = new Button(150, 40, "World");
  
  btn1.render($body);
  btn2.render($body);
})
```

### Delegiranje objekata korisnickog interfejsa

```js
var Widget = {
  init: function(width, height){
    this.width = width;
    this.height = height;
    this.$elem = null;
  }

  insert: function($where){
    if(this.$elem){
      this.$elem.css({
        width: this.width+"px",
        height: this.height+"px"
      }).appendTo($where);
    }
  }
}

var Button = Object.create(Widget);

Button.setup = function(width, height, label){
  // delegujuci poziv
  this.init(width, height);
  this.label = label || "Default";

  this.$elem = $('<button>').text(this.label);
}

Button.build($where){
  // delegujuci poziv
  this.insert($where);
  this.$elem.click(this.onClick.bidn(this));
}

Button.onClick = function(evt){
  console.log("Button '" + this.label + "' clicked!");
}

$(document).ready(function(){
  var $body = $(document.body);

  var btn1 = Object.create(Button);
  btn1.setup(125, 30, "Hello");

  var btn2 = Object.create(Button);
  btn2.setup(150, 40, "World");

  btn1.build($body);
  btn2.build($body);
})
```

Uh, ovo mnogo lepse izgleda, a i mnogo se lakse razume.

Nema nikakvih roditelja/izvedenih "klasa", ne moram da brinem o _.prototype_-u. Nema pseudopolimorfnih poziva (_Widget.call(..)_ i _Widget.prototype.render.call(..)_).

Iako izgleda kao gora opcija (u OPDO stilu koda pravljenje objekta i inicijalizacija (postavljanje vrednosti tog objekta) su dva razdvojena koraka, dve linije koda, dok je to u klasnom stilu pisanja skupljeno u jednoj liniji koda), ona je bas suprotno - bolja.

Moze se zamisliti kao kalup. Ako napravis kalup za ono sto ti treba, recimo testo, ti ga imas pa ga imas. Upotrebices ga/napuniti onda kada ti bude trebao. Ne moras da ga napunis, pa da koristis kada budes koristio to testo.

**OPDO bolje podrzava razvajanje aktivnosti**, gde izrada i inicijalizovanje nisu obavezno spojeni u istu operaciju.
