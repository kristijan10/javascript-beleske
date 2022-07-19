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

> Sada se ove nasledjene klase takodje mogu naslediti, i to tako u nedogled
>
> I uglavnom se na kraju radi sa izvedenim klasama, jer one imaju kopije ponasanja svih roditeljskih klasa (cak iako roditelj klase nad kojom radimo ima svog roditelja; mi imamo pristup i roditeljevom roditelju (dedi xD))

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

1. Svojstva _id_ i _label_ se cuvaju direktno u objektu "XYZ" (nijedno od ovih ne postoji kao deklarisno svojstvo objekta Task). Pri delegiranju pomocu mehanizma [[Prototype]], stanje cemo uglavnom cuvati u objektima koji delegiraju (XYZ, ABC), ne u delegatu (Task) kojem delegiraju.

2. Moze se primetiti da u OPDO stilu kodiranja nismo iskoristili polimorfizam. Razlog tome je sto na razlicitim nivoima [[Prototype]] lanca dolazi do zaklanjanja istoimenih metoda.

3. Pozivanjem metode _this.setID(ID)_ u objektu _XYZ_ [[Get]] operacija krece da trazi po lokalnom opsegu, gde ne nalazi metodu, zatim pretrazuje s cime je taj objekat povezan [[Prototype]] lancem, nalazi _Task_ objekat, gde nalazi i metodu _setID(..)_. Iako metodu nalazi u objektu _Task_, izvrsice je u kontekstu objekta _XYZ_, jer je _XYZ_ objektu omogucena upotreba metode jer je povezan s objektom _Task_ (delegira).

**Delegirati ponasanje** znaci omoguciti da jedan objekat (_XYZ_) delegira (prosledi) u drugi objekat (_Task_) razresenje reference svojstva ili metode ako ne postoji u samom izvornom objektu (_XYZ_).

Izuzetno mocan model projektovanja. Umesto hijerarhije ka dole (klase nasledjuju klase, i to stablo se grana ka dole), u OPDO metodi mozemo zamisliti objekte jedan pored drugog, kao ravnopravne ucesnike, pri cemu je smer delegiranja izmedju objekata proizvoljan i u skladu s potrebama.

#### Uzajamno delegiranje (nije dozvoljeno)

Ne mozemo formirati ciklus gde dva ili vise objekata delegiraju (dvosmerno) jedan u drugi.

> Ako povezem objekat B s objektom A, a zatim A povezem s B, prozurokovacu gresku.

Kada bi referencirao neko svojstvo/metodu koja ne postoji u ni u jednom objektu, dobijam beskonacnu rekurziju u [[prototype]] petlji.

Ali i kada bi postojale, onda bi B mogao delegirati u A, sto znaci da bi mogao podesiti tako da jedan delegira u drugi, za razne poslove.

#### Ispravljena greska

Chrome, u vreme pisanja knjige, je imao razlicit nacin prikazivanja da li je objekat napravljen pomocu operatora _new_ ili je nepravljen pomocu metode _Object.create()_.

```js
function Foo() {}

var a1 = new Foo();

a1; // Foo{} (Chrome)
a1; // Object{} (Firefox)
```

> Chrome u sustini kaze: "_a1_ je prazan objekat za ciju konstrukciju je odgovorna funkcija _Foo_"
>
> Firefox kaze: "_a1_ je prazan objekat konstruisan pomocu objekta _Object_"

Ova greska bi trebala da je ispravljena.

Ovo Chromovo specificno ucitavanje internog "imena konstruktora" korisno je samo ako u potpunosti primenjujemo stil kodiranja s klasama.

### Poredjenje mentalnih modela

Primer koda koriscenjem klasnog pristupa (OO - objekct oriented):

```js
function Foo(who) {
  this.me = who;
}

Foo.prototype.identify = function () {
  return "I am " + this.me;
};

function Bar(who) {
  Foo.call(this, who);
}

Bar.prototype = Object.create(Foo.prototype);

Bar.prototype.speak = function () {
  alert("Hello " + this.identify() + ".");
};

var b1 = new Bar("b1");
var b2 = new Bar("b2");

b1.speak(); // "Hello I am b1"
b2.speak(); // "Hello I am b2"
```

OPDO pristupom bi to izgledalo:

```js
var Foo = {
  init: function (who) {
    this.me = who;
  },
  identify: function () {
    return "I am " + this.me;
  },
};

var Bar = Object.create(Foo);

Bar.speak = function () {
  alert("Hello " + this.identify() + ".");
};

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

> U ovom primeru je koristen JQuery za DOM i CSS za stilizovanje, iako ne znam sintaksu, to nije bitno, ono sto je vazno je da se primeti nacin pravljenja tog "klasnog" modela

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
class Widget {
  constructor(width, height) {
    this.width = width || 50;
    this.height = height || 50;
    this.$elem = null;
  }

  render($where) {
    if (this.$elem) {
      this.$elem
        .css({
          width: this.width + "px",
          height: this.height + "px",
        })
        .appendTo($where);
    }
  }
}

class Button extends Widget {
  constructor(width, height, label) {
    super(width, height);
    this.label = label || "Default";
    this.$elem = $("<button>").text(this.label);
  }

  render($where) {
    super($where);
    this.$elem.click(this.onClick.bind(this));
  }

  onClick(evt) {
    console.log("Button '" + this.label + "' clicked!");
  }
}

$(document).ready(function () {
  var $body = $(document.body);
  var btn1 = new Button(125, 30, "Hello");
  var btn2 = new Button(150, 40, "World");

  btn1.render($body);
  btn2.render($body);
});
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

## Jednostavniji program

Odradicemo jos jedan primer koda kako bi ponovo prikazali da je OPDO stil koda mnogo fleskibilniji je jednostavniji za pisanje.

Zadatak ce se sastojati od kontrole za prijavu, a kasnije i za autentifikaciju prijave.

```js
function Controller() {
  this.errors = [];
}

Controller.prototype.showDialog = function (title, msg) {
  // prikazuje dijalog s naslovom i tekstom poruke korisniku
};

Controller.prototype.success = function (msg) {
  this.showDialog("U redu", msg);
};

Controller.prototype.fail = function (err) {
  this.errors.push(err);
  this.showDialog("Greska", err);
};

// nasledjena klasa
function LoginController() {
  Controller.call(this);
}
LoginController.prototype = Object.create(Controller.prototype);

LoginController.prototype.getUser = function () {
  return document.getElementById("login_username").value;
};

LoginController.prototype.getPass = function () {
  return document.getElementById("login_password").value;
};

LoginController.prototype.validateEntry = function (user, pw) {
  user = user || this.getUser();
  pw = pw || this.getPass();

  if (!(user && pw)) {
    return this.fail("Upisite ime i lozinku!");
  } else if (pw.lenght < 5) {
    return this.fail("Lozinka mora sadrzati bar pet znakova!");
  }
  // ako prodje ove if-ove, znaci da je sve dobro
  return true;
};

// redefinisanje
LoginController.prototype.fail = function (err) {
  // pozivanje "super" verzije metode
  Controller.prototype.fail.call(this, "Prijava nije prihvacena: " + err);
};

// nasledjena klasa
function AuthController(login) {
  Controller.call(this);
  // kombinovanje objekata
  this.login = login;
}
AuthController.prototype = Object.create(Controller.prototype);

AuthController.prototype.server = function (url, data) {
  return $.ajax({
    url: url,
    data: data,
  });
};

AuthController.prototype.checkAuth = function () {
  var user = this.login.getUser();
  var pw = this.login.getPass();

  if (this.login.validateEntry(user, pw)) {
    this.server("/check-auth", {
      user: user,
      pw: pw,
    })
      .then(this.success.bind(this))
      .fail(this.fail.bind(this));
  }
};

// redefinisanje
AuthController.prototype.success = function () {
  // pozivanje "super" verzije metode
  Controller.prototype.success.call(this, "Ispravan");
};

// redefinisanje
AuthController.prototype.fail = function (err) {
  // pozivanje "super" verzije metode
  Controller.prototype.fail.call(this, "Prijava nije uspela: " + err);
};

var auth = new AuthController(new LoginController());
auth.checkAuth();
```

Imamo osnovna ponasanja koja dele svi upravljaci, a to su metode _success(..)_, _fail(..)_ i _showDialog(..)_. Klase potomci, _LoginController_ i _AuthController_ redefinisu metode _success(..)_ i _fail(..)_ prema svojim potrebama.

Moze se dati primetiti da u nasledjenoj klasi _AuthController_ postoji svojstvo _this.login_ koje ukazuje na argument prosledjen funkciji, sto sto mi stavili da je poziv funkcije _LoginController_, sto znaci da _AuthController_ ima pristup metodama _LoginController_ funkcije.

### A sada bez klasa

```js
var LoginController = {
  errors: [],

  getUser: function(){
    return document.getElementById('user_username').value;
  },

  getPass: function(){
    return document.getElementById('user_password').value;
  },

  validateEntry: function(user, pw){
    user = user || this.getUser();
    pw = pw || this.getPass();

    if(!(user && pw)){
      return this.fail("Upisite ime i lozinku korisnika!");
    }
    else if(pw.length < 5){
      return this.fail("Lozinka ne sme imati manje od pet znakova!");
    }
    // ako je prosao sve if-ove, prijava je uspesna
    return true;
  },

  showDialog: function(title, msg){
    // prikaz dijaloga s naslovom i teksom korisniku
  },

  fail: function(err){
    this.errors.push(err);
    this.showDialog("Greska", "Nepoznat korisnik: "+err);
  }
}

// Veza koja omogucava delegiranje
var AuthController = Object.create(LoginController);

AuthController.errors = [];

AuthController.checkAuth = function(){
  var user = this.getUser();
  var pw = this.getPass();

  if(this.validateEntry(user, pw)){
    this.server('/check-auth', {
      user: user,
      pw: pw
    }).then(this.accepted.bind(this)).fail(this.rejected.bind(this));
  }
}

AuthController.server = function(url, data){
  return $.ajax({
    url: url,
    data: data
  })
}

AuthController.accepted = function(){
  this.showDialog("Uspeh", "Korisnik je ispravan!");
}

Auth.Controller.rejected = function(err){
  this.fail("Nepoznat korinik: "+err);
}

AuthController.checkAuth();
```

Postignuta je ista funkcionalnost, ali pomocu znatno jednostvanijeg programa.

## Lepsa sintaksa

ES6 sintaksa _class_ je dosta pojednostavila upotrebu "klasa" u JS-u.

```js
class Foo{
  methodName(){
    /...
  }
}
```

Uklonjena je upotreba rez. reci _function_ da deklaracije metoda, sto je dalo ideju da se to uradi i za OPDO stil koda. Tako da jedina sada razlika izmedju ES6 _class_-a i OPDO stila pisanja koda je sto u OPDO stilu koda metode moras razdvajati zarezom (jer su to ustvari svojstva objekta...).

```js
var LoginController = {
  errors = [],
  getUser(){
    // vidi, nema rez. reci function
  }
  getPass(){
    // ...
  }
}
```

ES6 je takodje omogucio noviju sintaksu za povezivanje objekata tako da delegira jedan drugom pomocu _Object.setPrototypeOf(obj1, obj2)_, gde je _obj1_ onaj koji delegira, a _obj2_ onaj u koji se delegira.

```js
var AuthController = {
  errors: [],
  checkAuth(){
    // ...
  },
  server(url, data){
    // ...
  }
}

// povezivanje tako da AuthController delegira u LoginController
Object.setPrototypeOf(AuthController, LoginController);
```

### Neleksicki deo

Postoji jedna mala mana upotrebe novije, skracene verzije deklarisanja metoda - anonimna funkcija.

```js
var obj = {
  foo(){
    // ...
  },
  bar: function bar(){
    // ...
  }
}
```

Kako bi izgledalo bez sintaksnih skracenica:

```js
var obj = {
  foo: function(){
    // ...
  },
  bar: function bar(){
    // ...
  }
}
```

Anonimne funkcije nemaju _name_ kojim bi se mogle pozvati prilikom poziva u lokalnom opsegu. Primer:

```js
var obj = {
  bar: function(x){
    if(x<10) return obj.bar(x*2);
    return x;
  },
  foo: function foo(x){
    if(x<10) return foo(x*2);
    return x;
  }
}
```

Ovo je sada jednostavan primer, ali da imam kompleksniji kod gde objekat _obj_ delegira u neki drugi objekat ili on delegira nekom drugom objektu moze se desiti zbrka sa pozivom tog svojstva _obj.bar(x*2)_.

Resenje: ako imam metodu gde mi treba sam njen poziv u lokalnom opsegu, promeni iz skracene u puniju sintaksu i daj funkciji ime!

## Introspekcija tipova

Introspekcija tipova (engl. type introspection) sluzi za utvrdjivanje strukture/karakteristika datog objekta na osnovu toga _kako je on bio napravljen_.

```js
function Foo(){
  // ...
}

Foo.prototype.something = function(){
  // ...
}

var a1 = new Foo();
a1.prototype = Object.create(Foo.prototype);

if(a1 prototypeof Foo){
  a1.something();
}
```

U ovom ce slucaju _a1.something()_ biti izvrseno => _a1_ jeste "nasledio" Foo "klasu".

```js
function Foo(){/*...*/}
Foo.prototype/*...*/;

function Bar(){/*...*/}
Bar.prototype = Object.create(Foo.prototype);

var b1 = new Bar("b1");

// veza izmedju Foo i Bar
Bar.prototype instanceof Foo; // true
Object.getPrototypeOf(Bar.prototype) === Foo.prototype; // true
Foo.prototype.isPrototypeOf(Bar.prototype); // true

// veze izmedju b1, Foo, Bar
b1 instanceof Bar; // true
b1 instanceof Foo; // true
Object.getPrototypeOf(b1) === Bar.prototype; // true
Foo.prototype.isPrototypeOf(b1); // true
Bar.prototype.isPrototypeOf(b1); // true
```

Kompleksna sintaksa dovodi do kasnijeg zbunjivanja i zapeljavanja. Igled predvodi na koriscenje klasa, sto mi se bas ne svidja.

OPDO stil koda ponovo pobedjuje:

```js
var Foo = {
  // ...
}

var Bar = Object.create(Foo);
Bar/*...*/;

var b1 = Object.create(Bar);

// veza izmedju Foo i Bar
Foo.isPrototypeOf(Bar); // true
Object.getPrototypeOf(Bar) === Foo; // true

// veza izmedjub1, Foo, Bar
Foo.isPrototypeOf(b1); // true
Bar.isPrototypeOf(b1); // true
Object.getPrototypeOf(b1) == Bar; // true
```

Sada je potrebno da postavimo pitanje "Da li si ti prototip mene?". Nema potrebebe za indirekcijom nepotrebnih stvari _Foo.prototype_...

## Sazetak poglavlja

Klase i nasledjivanje su modeli projektovanja koji mozete izabrati ili ne izabrati za svoju softversku arhitekturu. Vecina projektanata uzima zdravo za gotovo da su klase jedini (ispravan) nacin organizovanja koda, ali se ipak dokazalo da postoji jos jedan, prilicno mocan model - **delegiranje ponasanja**.

Delegiranje ponasanja podrazumeva da su objekti potpuno ravnopravni i da medjusobno delegiraju funkcije i metode, umesto da izmedju njih postoje veze kao izmedju roditeljskih i nasledjenih klasa.

Kada projektujes kod koji radi iskljucivo s objektima, to ne samo sto pojednostavljuje sintaksu programa vec cesto i njegovo strukturu.

OPDO (Objekti povezani drugim objektima) je stil pisanja koda u kojem se objekti direktno prave i povezuju jedni s drugima, bez apstrakcije klasa. Pomocu mehanizma [[Prototype]] OPDO sasvim prirodno implementira delegiranje ponasanja.
