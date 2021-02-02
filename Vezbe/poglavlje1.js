var TAKSA = 0.08;
var bankovni_racun = prompt("Koliko para imas na racunu?");
var maksimum_trosak = prompt("Koliko si spreman da platis?");
var cenaTelefona = 69.99;
var dodatnaOprema = 14.99;
var i = 0,
  n = 0;

function format(cena) {
  return "$" + cena.toFixed(2);
}

function oporezovano(cena) {
  return (cena + (cena * TAKSA));
}

while (bankovni_racun > cenaTelefona) {
  bankovni_racun -= oporezovano(cenaTelefona);
  i++;
}
while (bankovni_racun > dodatnaOprema) {
  bankovni_racun -= oporezovano(dodatnaOprema);
  n++;
}
console.log("Telefona: " + i + "\nDodatne opreme:" + n);
console.log("Ostalo ti je " + format(bankovni_racun));