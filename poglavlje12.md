# Mesanje objekta "klasa"

## Teorija klasa

Pojam klasa/nasledjivanje opisuje odredjen oblik organizovanja i arhitekture koda.

OOP istice da je priroda podataka da se uz njih uvek vezuje odredjeno ponasanje koje uticu na podatke, pa zato ispravan dizajn treba da spakuje zajedno i podatke i ponasanja.

>Grupa znakova koja predstavlja rec ili recenicu govornog jezika se naziva znakovni niz (string). Znakovi su podaci.
>
>Gotovo nikada nisu vazni samo podaci, vec obicno sa njima nesto radimo, pa se zato sva ponasanja koja se mogu primeniti na te podatke realizuju u obliku metoda klase String
>>Izracunavanje duzine stringa, dodavanje novih podataka, pretrazivanje...

Svaki znakovni niz je instanca svoje klase -> vesto upakovan paket podataka i funkcionalnosti koju mozemo primeniti na njih.

Svaku strukturu zamisljamo kao specificnu varijantu opstije osnove definicije.

>Kao primer mozemo uzeti _Automobil_, za koga se moze reci da je specificnija varijanta opstije klase koja se zove _vozilo_

**Polimorfizam** ideja da se dato opste ponasanje (deklarisano u roditeljskoj klasi) moze zameniti tako da se postigne specificnije ponasanje.

>Praksa je da se zamenjenoj funkciji u izvedenoj klasi ostavi isto ime funkcije kao u roditeljskoj

### Model projektovanja softvera pomocu "klasa"

_Proceduralno programiranje_ nacin za opisivanje koda koji se sastoji iskljucivo od procedura (funkcija) koje pozivaju druge funkcije.

Primena klasa je ispravan nacin da proceduralni "spageti kod" pretvorimo u pravilno formatiran i dobro organizovan kod.

### JavaScript "klase"

JavaScript, za razliku od OOP jezika, nema klase.

Ono sto je ES6 od skoro uveo, rezervisanu rec _class_ je samo pokusaj neke implementacije koriscenja klasa.

>U ovom momentu sam shvatio zasto autor stavlja u naslovu navodnike na reci klase.

## Mehanika klasa

U mnogim jezicima koji su orijentisani na klase, "standardna biblioteka" stavlja na raspoljaganje strukturu podataka tip _stek_ u obliku klase koja se zove _Stack_.

### Zgrada

Metafora za "klase" i "instance" pozajmljena je iz gradjevinarstva.

Klasa se moze zamisliti kao arhitektonski crtez zgrade.

Arhitekta na crtez ucrtava sirinu, visinu, broj prozora, na kojoj visini, sirini... On ne brine o tome cime ce ta zgrada biti popunjena (stanovi, kancelarije...) vec gleda samo siroku sliku.

Zatim preduzimac preuzima taj crtez i primenjuje ga na pravi svet, praveci stvarnu kopiju prema onome sto mu je arhitekta nacrtao. Moze se desiti da je na crtezu ucrtan neki deo koji ne moze biti primenjen na stvarnom svetu, pa ce morati biti dorade (menjanje svhe funkcije tako da odgovara izvedenoj klasi).

Kada zavrsi sa tom zgradom, preduzimac moze da nastavi da gradi zgrade po tom istpom principu koji mu je predlozio arhitekta (mogu da izvodim vise klasa iz osnovne).

Crtez je samo klasa, sa njim ne mogu fizicki nista uraditi. Ako zelim otvoriti vrata zgrade, moram napraviti instancu crteza (moram izgraditi zgradu).
