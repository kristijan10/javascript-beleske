# Povratne funkcije

## Nastavljanje izvrsavanja programa

Uvodjenjem asihronizma pomocu povratnih funkcija u nas kod dodajemo omotac koji moze lako da zbuni, a i za uspori otklanjanje gresaka.

## Sekvencijalni um

Asihroni rad, a i petlja za obradu dogadjaja, radi nalik nasem mozgu. Mozak ne moze da radi paralelno s dve ili vise stvari odjednom.

Ako bi razgovarao telefonom i pokusao da zapises nesto mozak bi velikom brzinom prebacivao s jednog nacina na drugi nacin razmisljanja.

Dok petlja izvrsava dogadjaj ona obavlja samo tu radnju, sve dok je ne zavrsi, ostale cekaju u redu.

### Izvrsavanje i planiranje poslova

Kada planiramo u stvarnom zivotu sta cemo da radimo, mi to uglavnom radimo korak po korak (sihrono).

>Ici cu u prodavnicu, kupiti mleko pa i napraviti toplu cokoladu

To je potpuno drugaciji nacin na koji bi trebalo da razmisljamo kada pisemo asihroni kod.

>Treba da odem do prodavnice, ali siguran sam da cu usput primiti poziv, zato _Zdravo mama_, ali dok ona pocne da prica, ja cu na GPS-u potraziti adresu prodavnice, ali posto ce za ucitavanje toga trebati nekoliko sekundi, utisacu zvuk na radiju da bih bolje cuo mamu, a onda cu shvatiti da sam zaboravio jaknu a napolju je hladno, ali nije bitno, nastavicu da vozim i pricam s mamom, a onda ce me alarm za pojas podsetiti da treba da se vezem, pa zato _da, mama vezao sam pojas, uvek to cinim_. Ah, najzad je GPS uspeo da pronadje put...

Uh, da, to je bas razlicit nacin na koji mi, ljudska bica, razmisljamo o tome sta treba uraditi. Ovo je planiranje u sitna crevca.

### Ugnjezdene/ulancane povratne f-je

```js
listen('click', function handler(evt){
   setTimeout(function request(){
      ajax('http://some.url.1', function response(text){
         if(text === "hello") handler();
         else if(text === "world") request();
      })
   }, 500);
});
```

>Pakao povratnih funkcija, ponekad i piramida propasti

Ovaj nacin pisanja koda nije bas najbolji. Ovim nacinom ti rucno podesavas sta ce da se desi nakon ovoga, pa nakon toga...

To je los pristup jer nekada moze da se desi da se pojavi neka greska u koraku 2, pa to znaci da se dalje nece izvrsavati. A program ce ostati s tim problemom, nad kojim se nista nece preduzimati.

## Pitanje pouzdanosti

U slucaju da se dogodi da koristimo neku biblioteki stranog izvora (odnosno, nad kojom nemamo direktnu kontrolu) i da za program zavisi od pokretanja nekog dela koda _kasnije_ (odnosno, pomocu asihronizma) i da se ta metoda iz strane biblioteke ne pokrene uopste, sta ce da se desi?

### Bajka o pet povratnih f-ja

Ako se postavim u situaciju da klijentu postavim aplikaciju koja u sebi ima biblioteku stranog izvora i desi se ,nekim slucajem, da programerski tim za razvijanje te biblioteke izbaci verziju koja nije dobra, to moze da kosta mog klijenta novac/potrosaci/vreme...

>Prica s jako dobrim objasnjenjem o tome koliki je problem kada se to desi

### Pakao nije samo kOd drugih programera

"Neotkrivene greske su jos uvek greske" - Kyle Simpson

Ukratko, ako koristis povratne f-je moras imati neku logiku za proveru da li sve ide kako je ocekivano.

"Veruj, ali proveravaj!"

## Pokusaji spasavanja povratnih f-ja

Uh, zabolela me glava od svih ovih primera koda. Toliko kompleksno...

Ukratko, ne postoji nacin da se resi problem s preranim/prekasnim/ne pozivanjem/pozivanjem previse puta povratnih f-ja.

Postoje bolji nacini, uvedeni u ES6 verziji, da se resi neki problem asihronizma, ali ce biti otkriven u toku...

>TODO: pogledaj sta/ko je Zalga
>
>"Ne pustaj Zalga s lanca"

## Sazetak poglavlja

Povratne funkcije su osnovne jedinice asihronizma u JS-u. Ali one ne prate dovoljno dobro evoluciju asihronizma tokom razvoja JS-a.

Prvo, nas um planira stvari na sekvencijalne, blokirajuce i jednonitne semanticke nacine, ali povratne f-je izrazavaju asihroni tok na nacin koji je nelinearan i nije uzrocno-posledican, sto znatno otezava ispravno razmisljanje o takvom kodu. Kod o kojem je tesko rasudjivati je los kod, koji dovodi to ozbiljnih gresaka.

Drugo i vaznije, jeste da povratne f-je imaju manu prepustanja kontrole jer implicitno prosledjuju kontrolu drugom delu koda (cesto kodu iz treceg izvora nad kojim nemate kontrolu) da bi pokrenule nastavljanje rada programa. To prepustanje kontrole dovodi do celog spiska mogucih problema usled nepouzdanosti koda, kao sto je onaj kada se povratna f-ja poziva cesce nego sto ocekujemo.

Izmisljanje ad hoc logike radi resavanja tih problema nepouzdanosti jeste izvodljivo, ali je to teze nego sto bi trebalo da bide i proizvodi kod koji je pretrpan, teze se odrzava i verovatno nije dovoljno zasticen od pomenutih opasnosti dok neka greska ne postane zaista vidljiva.

Treba nam resenje. Nesto bolje od povratnih f-ja. Poglavlja koja slede sadrze odgovor, zato nastavi da citas Kristijane.
