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
