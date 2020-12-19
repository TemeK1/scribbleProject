# scribbleProject
# Tietotekniikan erikoistyö
@ Teemu Käpylä

Tämä projekti koostuu kolmesta osasta:

API (endpoint, hoitelee yhteydet MongoDB-tietokantaan).
client (browser-client, ReactJS sovellus)
mobileClient (mobile-client, React Native sovellus)

Browser-clientillä muistiinpanot tallennetaan käyttäen paikallista localStoragea. Mobile-clientillä ne taasen tallennetaan lokaalisti Realm-ratkaisulla.

Käyttäjä voi luoda muistiinpanoja lokaalisti (painaen oikean yläkulman "Add note" kuvaketa), ja muistiinpano luodaan sattumanvaraisella värillä ja perustemplaatilla käyttäjän näkyville. Sitä klikatessaan käyttäjä voi määrittää otsikon, tekstin ja värin. Editoitava muistiinpano tarjoaa kolmea vaihtoehtoa: punainen rasti, peru muutos. Roskakori (poistaa muistiinpanon sekä lokaalisti että tietokannasta). Kolmantena vaihtoehtona voit tallentaa uusimmat muutokset.

Muistiinpanotemplaatille haetaan pohjaksi sattumanvarainen  ohjelmointiaiheinen vitsi JOKE APIsta, jos se on saatavilla.

Mobiiliversiossa voit lisäksi swaipata muistiinpanoja vasemmalle poistaaksesi ne, ja oikealle vaihtaaksesi niiden värin sattumanvaraisesti.

Voit lisäksi vaihtaa muistiinpanojen järjestystä klikkaamalla niiden oikean laidan pieniä nuolia ylös ja alas. Myös vaihdettu järjestys synkronisoituu eri clienttien välillä.

API-endpoint on yhteyksissä MongoDB-klusteriin (http://mongodb.com/). Itse API-applikaatio (Node.js, ExpressJS..) on asennettu Google Cloudin AppEngineen sen saatavuuden takaamiseksi. API:sta haetaan muistiinpanodataa GET-pyynnöillä, ja sinne lähetetään muutoksia joko GET- tai POST-pyynnöillä.

----------

Synkronisointivaihe on kaksiosainen.

1) Muistiinpanot haetaan endpoint-tietokannasta ja tallennetaan lokaalisti siltä osin kun niitä ei vielä lokaalissa säilytyksessä ollut. Lokaaleja ja haettuja muistiinpanoja verrataan keskenään niiden aikaleiman perusteella. Jos etäversiota on muokattu myöhemmin, niin sitten on syytä epäillä että käyttäjä haluaa varoituksen tästä ristiriidasta, jotta voi päättää seuraavan toimenpiteen sen mukaan. Käyttäjä voi valita preferoivansa joko lokaaleja tai etämuistiinpanoja ristiriitatilanteissa. Jos valintaa ei tehdä, tai valintatilannetta ei tule (eli ristiriitoja ei ole), silloin luonnollisesti suositaan lokaaleja muistiinpanoja.

2) Lokaalit päivitykset lähetetään tallennettavaksi endpoint-tietokantaan. Siltä osin kun ristiriitoja löytyi, ja käyttäjän preferoidessa etämuistiinpanoja, lokaaleja muutoksia ei lähetetä tietokantaan, vaan lokaalit muutokset ylikirjoitetaan tuoreemmilla etämuutoksilla.

Huom:

x) Tilanteessa, jossa esim. mobiilikäyttäjä poistaa muistiinpanon lokaalisti ja tietokannasta ei tarkoita sitä että se olisi poistettu lokaalisti jokaiselta alustalta. Eli lokaali versio saattaa vielä löytyä toisaalta, ja se voidaan myös ladata takaisin tietokantaan. Tämä on design-päätös tällä erää, eikä bugi.

