import { Button, Container,Row,Col } from "react-bootstrap";

export default function Uvjeti() {
  
return(
  <>
    <Container>
      
 <div className="container">
    <h1>UVJETI KORIŠTENJA APLIKACIJE „AUKCIJE”</h1>
    <p className="date">Posljednja izmjena: 1. listopada 2026.</p>

    <p>Dobrodošli u aplikaciju <strong>Aukcije</strong> (u daljnjem tekstu: „Aplikacija”). Molimo vas da pažljivo pročitate ove Uvjete korištenja (u daljnjem tekstu: „Uvjeti”) prije početka korištenja Aplikacije.</p>

    <div className="highlight-box">
      Pristupanjem ili korištenjem Aplikacije potvrđujete da ste pročitali, razumjeli i prihvatili ove Uvjete u cijelosti. Ako se ne slažete s bilo kojim dijelom ovih Uvjeta, nemojte koristiti Aplikaciju.
    </div>

  

    <h2>1. Opće odredbe i definicije</h2>
    <ul>
      <li><strong>Pružatelj usluge:</strong> [Naziv tvrtke/obrta], [Adresa], OIB: [OIB], e-mail: [E-mail adresa za podršku] (u daljnjem tekstu: „Platforma” ili „Mi”).</li>
      <li><strong>Korisnik:</strong> Svaka fizička ili pravna osoba koja pristupa Aplikaciji, registrira račun te sudjeluje na aukcijama kao Kupac (Ponuditelj) ili Prodavatelj.</li>
      <li><strong>Prodavatelj:</strong> Korisnik koji oglašava i stavlja predmet na prodaju putem aukcije.</li>
      <li><strong>Kupac / Ponuditelj:</strong> Korisnik koji predaje ponude za kupnju predmeta u aukciji.</li>
      <li><strong>Aukcija:</strong> Postupak prodaje predmeta u kojem pobjeđuje najviša važeća ponuda u zadanom vremenskom roku.</li>
    </ul>

    <h2>2. Registracija i Korisnički račun</h2>
    <ol>
      <li><strong>Uvjeti za registraciju:</strong> Za korištenje Aplikacije morate imati najmanje 18 godina i punu poslovnu sposobnost.</li>
      <li><strong>Točnost podataka:</strong> Prilikom registracije dužni ste navesti točne, potpune i ažurne podatke. Zabranjeno je korištenje lažnih identiteta ili tuđih podataka.</li>
      <li><strong>Sigurnost računa:</strong> Odgovorni ste za čuvanje tajnosti svojih pristupnih podataka (korisničko ime i lozinka). Sve aktivnosti izvršene putem vašeg računa smatraju se vašim vlastitim aktivnostima.</li>
      <li><strong>Gašenje računa:</strong> Zadržavamo pravo privremeno ili trajno blokirati ili izbrisati vaš korisnički račun u slučaju kršenja ovih Uvjeta ili sumnje na prijevaru.</li>
    </ol>

    <h2>3. Pravila sudjelovanja na aukcijama</h2>

    <h3>3.1. Pravila za Prodavatelje</h3>
    <ul>
      <li>Prodavatelj jamči da je zakoniti vlasnik predmeta ili da ima sva potrebna prava i ovlaštenja za njegovu prodaju.</li>
      <li>Zabranjena je prodaja ilegalnih, ukradenih, opasnih, krivotvorenih ili zakonom zabranjenih predmeta.</li>
      <li>Prodavatelj je dužan točno i istinito opisati predmet te navesti sve eventualne nedostatke ili oštećenja.</li>
      <li>Postavljanjem predmeta na aukciju, Prodavatelj prihvaća obvezu prodaje predmeta ponuditelju s najvišom važećom ponudom na kraju aukcije (uz ispunjenje minimalne/rezervne cijene, ako je postavljena).</li>
    </ul>

    <h3>3.2. Pravila za Kupce (Ponuditelje)</h3>
    <ul>
      <li><strong>Obvezujuća ponuda:</strong> Svaka predana ponuda na aukciji je pravno obvezujuća. Ponuda se ne može povući ili otkazati nakon što je predana.</li>
      <li>Pobjednik aukcije je korisnik čija je ponuda u trenutku isteka aukcije najviša.</li>
      <li>Pobjednik je dužan izvršiti plaćanje i preuzimanje predmeta u roku od [npr. 3 ili 5] radnih dana od završetka aukcije.</li>
    </ul>

    <h2>4. Naknade i Plaćanje</h2>
    <ol>
      <li><strong>Naknade za korištenje:</strong> Korištenje Aplikacije može uključivati naknade (npr. provizija od prodaje, naknada za isticanje oglasa). Sve važeće naknade jasno su prikazane u Cjeniku Aplikacije.</li>
      <li><strong>Plaćanja između korisnika:</strong> Aplikacija služi kao posrednik koji spaja Kupca i Prodavatelja. Ovisno o postavkama Aplikacije, transakcije se izvršavaju putem integriranih sustava za plaćanje ili izravnim dogovorom Kupca i Prodavatelja.</li>
          <li>Platforma ne odgovara za kašnjenja, pogreške ili neuspjele transakcije uzrokovane trećim stranama (pružateljima platnih usluga ili bankama).</li>
          <li>Kupoprodaja se vrši dogovorom između Prodavayelja i kupca. <strong>Aplikacija ne  nudi  uslugu plaćanja</strong></li>
    </ol>

    <h2>5. Dostava i Preuzimanje predmeta</h2>
    <ul>
      <li>Kupac i Prodavatelj samostalno ugovaraju način dostave, troškove dostave i rok isporuke kupljenog predmeta.</li>
      <li>Prodavatelj je dužan poslati predmet u roku ugovorenom s Kupcem nakon zaprimanja uplate.</li>
      <li>Platforma ne snosi odgovornost za oštećenja predmeta u transportu ili kašnjenja u dostavi.</li>
    </ul>

    <h2>6. Ograničenje odgovornosti Platforme</h2>
    <ul>
      <li><strong>Uloga posrednika:</strong> Platforma pruža tehničku infrastrukturu za spajanje Kupaca i Prodavatelja. Platforma nije vlasnik predmeta koji se prodaju (osim ako je izričito navedeno suprotno) niti je ugovorna strana u kupoprodajnom ugovoru između Kupca i Prodavatelja.</li>
      <li><strong>Točnost oglasa:</strong> Ne jamčimo za točnost, potpunost ili istinitost opisa predmeta koje postavljaju Prodavatelji.</li>
      <li><strong>Dostupnost sustava:</strong> Nastojimo osigurati neprekidan rad Aplikacije, ali ne jamčimo da će Aplikacija raditi bez prekida, kašnjenja ili pogrešaka te ne odgovaramo za eventualnu štetu nastalu zbog tehničkih poteškoća.</li>
    </ul>

    <h2>7. Zabranjeno ponašanje</h2>
    <p>Korisnicima je strogo zabranjeno:</p>
    <ul>
      <li>Umjetno podizanje cijene na vlastitim aukcijama (korištenjem sporednih računa ili u dogovoru s trećim osobama – <em>shill bidding</em>).</li>
      <li>Komuniciranje izvan Aplikacije radi izbjegavanja plaćanja provizije Aplikaciji.</li>
      <li>Vrijeđanje, uznemiravanje ili slanje neprimjerenog sadržaja drugim korisnicima.</li>
      <li>Pokušaji narušavanja sigurnosti ili stabilnosti Aplikacije (npr. botovi, hakerski napadi, zlouporaba API-ja).</li>
    </ul>

    <h2>8. Intelektualno vlasništvo</h2>
    <p>Sva prava intelektualnog vlasništva nad Aplikacijom, njezinim dizajnom, izvornim kodom, logotipom i sadržajem pripadaju Pružatelju usluge. Korisnik ne smije kopirati, reproducirati ili distribuirati dijelove Aplikacije bez izričitog pismenog odobrenja.</p>

    <h2>9. Izmjene Uvjeta korištenja</h2>
    <p>Zadržavamo pravo u bilo kojem trenutku izmijeniti ove Uvjete. O važnim izmjenama korisnici će biti obaviješteni putem Aplikacije ili e-maila najmanje [npr. 14 dana] prije stupanja izmjena na snagu. Nastavak korištenja Aplikacije nakon izmjena smatra se prihvaćanjem novih Uvjeta.</p>

    <h2>10. Mjerodavno pravo i rješavanje sporova</h2>
    <p>Na ove Uvjete primjenjuje se pravo Republike Hrvatske. Sve eventualne sporove proizašle iz ovih Uvjeta ugovorne strane pokušat će riješiti mirnim putem, a u suprotnom je nadležan stvarno nadležni sud u [Grad, npr. Zagrebu].</p>

    <h2>11. Kontakt</h2>
    <p>Za sva pitanja, podršku ili prigovore u vezi s korištenjem Aplikacije, možete nas kontaktirati putem:</p>

    <ul>
      <li><strong>E-mail:</strong> podrska@vasa-domena.hr</li>
      <li><strong>Adresa:</strong> [Adresa tvrtke]</li>
    </ul>
  </div>

      <Row>
        <Col sm={12} md={6}><Button variant="success" type="submit" id='accept' >Prihvaćam</Button></Col>
        <Col sm={12 } md={6}><Button variant="danger" type="submit" id='deny'>Odbijam</Button></Col>
      </Row>

</Container>
  
  </>
  )
}