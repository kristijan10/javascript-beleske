# Pregled sadrzaja knjige _Naucite JavaScript_

Sustina ove knjige jeste da nas nauci _sve_ delove JS-a. Ne samo one minimalne, koje ce nam biti dosta da dobijemo posao, vec opsirno i sve. Sve je vise ljudi koji ne uce sve koncepte JavaScripta, vec samo ono sto treba za zaposlenje. Kratak pregled ostatka knjige

## Opseg vidljivosti i ograde

Na pocetku poglavlja ce razotkrivati mit o tome da je JS interpretiran jezik. (spoiler!, JS je kompajliran). Zatim ce opisati pristup koji JS masina preuzima dok kompajlira kod, da bi razumeli kako funkcionise obradjivanje deklaracija promenljivih i funkcija. Takodje opisuje koncept podizanja (hoisting).

Kako bi shvatili ograde moramo da shvatimo opseg vidljivosti, jer jedno bez drugog ne idu.

Najvaznija primena ograda jesu modularni sabloni, koji je nazastupljeniji nacin organizovanja koda u JS.

## Identifikator _this_ i prototipovi objekata

Identifikator this ne predstavlja funkciju u kojoj se pojavljuje.

On se dinamicki povezuje u zavisnoti od toga kako se data funkcija izvrsava i postoje cetiri pravila kako bi razumeli nacin povezivanja _this_.

Uz this najcesce idu prototipovi objekata. To je ukratko lanac u kojem se traze svojstva, slicno trazenju promenljive u leksickom opsegu.

## Tipovi i gramatika

Konverzija tipova. Kada se implicitna konverzija iskoristi na pravi nacin moze da poboljsa kod.

## Asihroni rad i performanse

Prva cetiri dela opisuju osnovne koncepte JS jezika. Ali ovaj, peti deo, razmatra sablone na visem nivou koriscenjem asihronog programiranja.

Pravi razliku izmedju "asihrono", "paralelno" i "istovremeno".

Zatim objasnjava nacin koriscenja povratnih funkcija ("callbacks"). Zatim otkriva da nam koriscenje povratnih funkcija nije dovoljno kako bi iskoristili asihrono program. i otkriva mane istog.

Kako bi ispravili te mane u ES6 su ubacena dva sablona programiranja - obecanje i generatore.(spoiler!, moras ih nauciti ako hoces da budes dobar asihroni programer)

Korscenje Web Workers kako bi unapredili performanse nasih web app, kao i paralizovanje podataka pomocu SIMD-a, kao i optimizovanje performansi na nizem nivou sa ASM.js.

Ovo poglavlje opisuje sve alatke i vestine koje ti trebaju da bi pisao pristojan JS kod sa dobrim performansama.

## ES6 i sledece verzije

Iako nikada necemo moci _sve_ da znamo o JS-u, posto stalno izlaze novi koncepti, u ovom poglavlju preci ce to sta ce biti novo u sledecim verzijama.

Opisuje nacin na koji treba da savladamo nove koncepte koji tek dolaze sledecim verzijama ES-a.

**Buducnost JavaScripta je svetla. Sada je vreme da pocnemo da ga ucimo!**
