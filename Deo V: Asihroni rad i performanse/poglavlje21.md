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
