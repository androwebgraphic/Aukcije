import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { Faker, en, hr } from '@faker-js/faker';

import PredmetiServices from '../services/predmeti/PredmetiServices';
import KategorijeServices from '../services/kategorije/KategorijeServices';
import OznakeServices from '../services/oznake/OznakeServices';
import KorisniciService from '../services/korisnici/KorisniciService';

/*
 * Presipavanje uvijek čita iz memorije, neovisno o DATA_SOURCE. Dispečeri
 * (npr. PredmetiServices) u firebase načinu vraćaju Firestore, pa se ovdje
 * memorijski servisi uvoze izravno.
 */
import KategorijeServicesMemorija from '../services/kategorije/KategorijeServicesMemorija';
import OznakeServicesMemorija from '../services/oznake/OznakeServicesMemorija';
import PredmetiServicesMemorija from '../services/predmeti/PredmetiServicesMemorija';

/*
 * KorisniciData je izvor za prijenos u localStorage:
 * KorisniciServiceMemorija svoje korisnike drži upravo u ovom arrayu
 * (dodaj() radi push) i hashira lozinke, dok get() namjerno NE vraća
 * lozinke. Bez ovoga bi presipani korisnici ostali bez hashova i prijava
 * bi prestala raditi. Kod localStorage izvora ovaj uvoz se ne koristi jer
 * se presipavanje u tom smjeru ne prikazuje.
 */
import { korisnici as korisniciMemorije } from '../services/korisnici/KorisniciData';
import {
  DEMO_ADMIN,
  DEMO_KORISNIK,
  DEMO_LOZINKA,
  opisDemoRacuna,
  osigurajDemoRacune,
} from '../utils/demoRacuni';

import { APP_NAME, PrefixStorage, DATA_SOURCE } from '../constants';
import useModal from '../hooks/useModal';
import useLoading from ".././hooks/useLoading"
import KorisniciServiceFirebase from '../services/korisnici/KorisniciServiceFirebase';
import KategorijeServicesFirebase from '../services/kategorije/KategorijeServicesFirebase';
import OznakeServicesFirebase from '../services/oznake/OznakeServicesFirebase';
import PredmetiFirebaseServices from '../services/predmeti/PredmetiFirebaseServices';
import KorisniciServiceMemorija from '../services/korisnici/KorisniciServiceMemorija';
/*
 * Ključevi moraju biti isti kao u *ServicesLocalStorage datotekama — one sve
 * koriste PrefixStorage (e4.kategorije, e4.oznake, ...). Prije su ovdje bili
 * goli nazivi ('kategorije'), pa je presipavanje pisalo u ključeve koje servisi
 * nikad ne čitaju.
 */

 
const LOCALSTORAGE_KLJUCEVI = {
  kategorije: PrefixStorage.KATEGORIJE,
  oznake: PrefixStorage.OZNAKE,
  korisnici: PrefixStorage.KORISNICI,
  predmeti: PrefixStorage.PREDMETI,
};

// Kategorije i oznake moraju biti zapisane prije predmeta (reference na id-eve).
const REDOSLIJED_PISANJA = ['kategorije', 'oznake', 'korisnici', 'predmeti'];

const NAZIVI_KATEGORIJA = [
  'Računala', 'Auti Oldtimers', 'Alati', 'Satovi', 'Numizmatika',
  'Nakit', 'Filatelija', 'Umjetnine', 'LP ploče', 'Beletristika',
  'Motocikli', 'Starinsko oružje', 'Omiljeni predmeti', 'Stari filmovi',
];

const IKONE_KATEGORIJA = [
  'racunala', 'auti', 'alati', 'satovi', 'numizmatika',
  'nakit', 'filatelija', 'umjetnine', 'lp', 'beletristika',
  'motori', 'starinsko oruzje', 'omiljeni', 'filmovi',
];

const STANJA_PREDMETA = [
  'Odlično', 'Vrlo dobro', 'Dobro', 'Očuvano', 'Restaurirano', 'Kolekcionarsko',
];

// Hrvatski skup oznaka — faker.word.sample() nema hrvatske riječi, pa bi
// generirao engleske izraze koji ne odgovaraju postojećim oznakama.
const OZNAKE_BAZA = [
  'novo', 'rabljeno', 'vintage', 'retro', 'originalno pakiranje',
  'očuvano', 'rijetko', 'kolekcionarsko', 'prvi vlasnik', 'naslijeđeno',
  'ručni rad', 'restaurirano', 'potpisano', 'limitirano izdanje', 'staro izdanje',
];

// Faker: hrvatski s engleskim kao zamjenom (hr nema npr. commerce i word
// definicije, pa bi bez fallbacka generiranje vratilo prazne vrijednosti).
const faker = new Faker({ locale: [hr, en] });

/** Servisi vraćaju { data: [...] } (korisnici i { success }), ali neki mogu i goli array. */
const dohvatiListu = async (servis) => {
   
  const odgovor = await servis.get();
  const podaci = Array.isArray(odgovor) ? odgovor : odgovor?.data;
  return Array.isArray(podaci) ? podaci : [];
};

/**
 * Broj zapisa u pojedinom servisu. Za razliku od dohvatiListu, ovdje se greška
 * (npr. Firestore pravila ili mreža) propagira umjesto da se pretvori u 0.
 */
const prebrojZapisa = async (servis) => {
  const odgovor = await servis.get();

  if (odgovor && odgovor.success === false) {
    throw new Error(odgovor.message || 'Dohvat podataka nije uspio.');
  }

  const podaci = Array.isArray(odgovor) ? odgovor : odgovor?.data;
  return Array.isArray(podaci) ? podaci.length : 0;
};

const kljucNaziva = (vrijednost) => String(vrijednost ?? '').trim().toLowerCase();

const imaIspravanId = (stavka) => stavka?.id !== undefined && stavka?.id !== null;

const odrezi = (tekst, najvece) => String(tekst ?? '').slice(0, najvece).trim();

const generirajKategorije = async (broj) => {
  const postojece = await dohvatiListu(KategorijeServices);
  const zauzetiNazivi = new Set(postojece.map((kategorija) => kljucNaziva(kategorija?.naziv)));
  const kreirane = [];

  for (let i = 0; i < broj; i += 1) {
    const bazniNaziv = NAZIVI_KATEGORIJA[i % NAZIVI_KATEGORIJA.length];
    let naziv = bazniNaziv;
    let dodatak = 2;
    while (zauzetiNazivi.has(kljucNaziva(naziv))) {
      naziv = `${bazniNaziv} ${dodatak}`;
      dodatak += 1;
    }

    await KategorijeServices.dodaj({
      naziv,
      ikona: IKONE_KATEGORIJA[i % IKONE_KATEGORIJA.length],
      opis: odrezi(faker.commerce.productDescription(), 300),
    });

    zauzetiNazivi.add(kljucNaziva(naziv));
    kreirane.push(naziv);
  }

  return kreirane;
};

const generirajOznake = async (broj) => {
  const postojece = await dohvatiListu(OznakeServices);
  const zauzetiNazivi = new Set(postojece.map((oznaka) => kljucNaziva(oznaka?.naziv)));
  const kreirane = [];

  let pokusaja = 0;
  const najvisePokusaja = broj * 5 + OZNAKE_BAZA.length;

  while (kreirane.length < broj && pokusaja < najvisePokusaja) {
    pokusaja += 1;

    const bazni = OZNAKE_BAZA[pokusaja % OZNAKE_BAZA.length];
    let naziv = bazni;
    let dodatak = 2;
    while (zauzetiNazivi.has(kljucNaziva(naziv))) {
      naziv = `${bazni} ${dodatak}`;
      dodatak += 1;
    }

    await OznakeServices.dodaj({ naziv });
    zauzetiNazivi.add(kljucNaziva(naziv));
    kreirane.push(naziv);
  }

  if (kreirane.length < broj) {
    throw new Error(`Generirano je samo ${kreirane.length} od ${broj} oznaka.`);
  }

  return kreirane;
};

const generirajPredmete = async (broj) => {
  const [kategorije, oznake] = await Promise.all([
    dohvatiListu(KategorijeServices),
    dohvatiListu(OznakeServices),
  ]);

  if (kategorije.length === 0) {
    throw new Error('Nema dostupnih kategorija. Prvo generirajte kategorije.');
  }

  const kategorijeSIdeom = kategorije.filter(imaIspravanId);
  if (kategorijeSIdeom.length === 0) {
    throw new Error('Kategorije nemaju ispravne id-eve. Provjerite servis kategorija.');
  }

  if (oznake.length === 0) {
    throw new Error('Nema dostupnih oznaka. Prvo generirajte oznake.');
  }

  const oznakeSIdeom = [...new Set(oznake.filter(imaIspravanId).map((oznaka) => oznaka.id))];
  if (oznakeSIdeom.length === 0) {
    throw new Error('Oznake nemaju ispravne id-eve. Provjerite servis oznaka.');
  }

  const najvecaGodina = new Date().getFullYear();
  const kreirani = [];

  for (let i = 0; i < broj; i += 1) {
    const kategorija = faker.helpers.arrayElement(kategorijeSIdeom);

    const brojOznaka = faker.number.int({ min: 1, max: Math.min(3, oznakeSIdeom.length) });
    const odabraneOznake = [...new Set(faker.helpers.arrayElements(oznakeSIdeom, brojOznaka))];

    // Polja prate obrazac iz PredmetNovi.jsx (ShemaPredmet: naziv 3–30,
    // opis 10–300, cijena 1–100000), da se generirani predmet kasnije može
    // normalno otvoriti i spremiti u formi.
    let naziv = odrezi(faker.commerce.productName(), 30);
    if (naziv.length < 3) naziv = `${naziv} predmet`.slice(0, 30);

    let opis = odrezi(faker.commerce.productDescription(), 300);
    if (opis.length < 10) opis = `${opis} — generirani opis predmeta.`.slice(0, 300);

    kreirani.push({
      naziv,
      opis,
      godinaNastanka: faker.number.int({ min: 1900, max: najvecaGodina }),
      stanje: faker.helpers.arrayElement(STANJA_PREDMETA),
      pocetnaCijena: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
      dodano: faker.date.past({ years: 1 }).toISOString(),
      zavrsava: faker.date.soon({ days: 14 }).toISOString(),
      kategorija: kategorija.id,
      oznake: odabraneOznake,
      ponude: [],
      slike: null,
      korisnikId: null,
    });

    await PredmetiServices.dodaj(kreirani[kreirani.length - 1]);
  }

  return kreirani;
};

const generirajKorisnike = async (broj) => {
  const postojeci = await dohvatiListu(KorisniciService);
  const postojeciEmailovi = new Set(postojeci.map((korisnik) => kljucNaziva(korisnik?.email)));
  const kreirani = [];

  let pokusaja = 0;
  const najvisePokusaja = broj * 25 + 25;

  while (kreirani.length < broj && pokusaja < najvisePokusaja) {
    pokusaja += 1;

    const email = kljucNaziva(faker.internet.email());
    if (!email || postojeciEmailovi.has(email)) continue;

    const odgovor = await KorisniciService.dodaj({
      email,
      lozinka: DEMO_LOZINKA,
      uloga: 'korisnik',
    });

    if (odgovor && odgovor.success === false) {
      throw new Error(`Korisnika ${email} nije moguće spremiti.`);
    }

    postojeciEmailovi.add(email);
    kreirani.push(email);
  }

  if (kreirani.length < broj) {
    throw new Error(
      `Kreirano je samo ${kreirani.length} od ${broj} korisnika — ponestalo je jedinstvenih e-mailova.`
    );
  }

  return kreirani;
};

const KONFIGURACIJA_BRISANJA = {
  kategorije: {
    servis: KategorijeServices,
    akuzativ: 'sve kategorije',
    prijedlog: 'kategorija',
    napomena: 'Predmeti koji koriste te kategorije ostat će s nevažećom referencom.',
    filtar: null,
  },
  oznake: {
    servis: OznakeServices,
    akuzativ: 'sve oznake',
    prijedlog: 'oznaka',
    napomena: 'Predmeti koji koriste te oznake ostat će s nevažećim referencama.',
    filtar: null,
  },
  predmeti: {
    servis: PredmetiServices,
    akuzativ: 'sve predmete',
    prijedlog: 'predmeta',
    napomena: 'Sve ponude i podaci o predmetima bit će trajno izgubljeni.',
    filtar: null,
  },
  korisnici: {
    servis: KorisniciService,
    akuzativ: 'sve korisnike osim administratora',
    prijedlog: 'korisnika',
    napomena: 'Administratorski računi neće biti obrisani.',
    filtar: (korisnik) => korisnik?.uloga !== 'admin',
  },
};

const obrisiKolekciju = async (kljuc) => {
  const konfiguracija = KONFIGURACIJA_BRISANJA[kljuc];
  const sve = await dohvatiListu(konfiguracija.servis);
  const odabrane = konfiguracija.filtar ? sve.filter(konfiguracija.filtar) : sve;

  let obrisano = 0;
  let preskoceno = 0;

  for (const stavka of odabrane) {
    if (!imaIspravanId(stavka)) {
      preskoceno += 1;
      continue;
    }

    // Id se prosljeđuje točno onakav kakav je došao iz get() — servisi nisu
    // jedinstveni po tipu (memorija vraća brojeve, localStorage stringove).
    const odgovor = await konfiguracija.servis.obrisi(stavka.id);
    if (odgovor && odgovor.success === false) {
      preskoceno += 1;
    } else {
      obrisano += 1;
    }
  }

  return { obrisano, preskoceno };
};

/*
 * Korisnici se presipavaju iz KorisniciData (uključuje bcrypt hasheve), a ne
 * iz KorisniciService.get() koji ih namjerno skriva. Id-evi se pretvaraju u
 * stringove jer KorisniciServiceLocalStorage uspoređuje id strogo (===) i
 * očekuje stringove.
 */
const dohvatiKorisnikeZaPrijenos = () =>
  korisniciMemorije.map((korisnik) => ({ ...korisnik, id: String(korisnik.id) }));

/** Trenutno stanje memorije: kategorije, oznake, predmeti i korisnici (s hashovima). */
const dohvatiMemoriju = async () => {
  const [kategorije, oznake, predmeti] = await Promise.all([
    KategorijeServicesMemorija.get(),
    OznakeServicesMemorija.get(),
    PredmetiServicesMemorija.get(),
    KorisniciServiceMemorija.get()
  ]);

  return {
    kategorije: kategorije?.data ?? [],
    oznake: oznake?.data ?? [],
    predmeti: predmeti?.data ?? [],
    korisnici: dohvatiKorisnikeZaPrijenos(),
  };
};

/** Id iz broja, stringa ili objekta (npr. kategorija: { id: 1 }). */
const dohvatiId = (vrijednost) => {
  if (vrijednost === null || vrijednost === undefined || vrijednost === '') return null;
  if (typeof vrijednost === 'object') {
    return (
      vrijednost.id ?? vrijednost.kategorijaId ?? vrijednost.kategorija_id ?? vrijednost.sifra ?? null
    );
  }
  return vrijednost;
};

/** Stari id -> novi Firestore id; null ako referenca nije pronađena. */
const preslikaj = (mapa, vrijednost) => {
  const id = dohvatiId(vrijednost);
  return id === null ? null : (mapa.get(String(id)) ?? null);
};

function GumbRadnje({
  radnja,
  kljuc,
  tekst,
  tekstUTijeku,
  varijanta = 'primary',
  type = 'button',
  onClick,
  className = 'w-100',
}) {
  const aktivan = radnja === kljuc;

  return (
    <Button
      type={type}
      variant={varijanta}
      onClick={onClick}
      disabled={radnja !== null}
      className={className}
    >
      {aktivan ? (
        <>
          <Spinner as="span" size="sm" animation="border" className="me-2" role="status" aria-hidden="true" />
          {tekstUTijeku}
        </>
      ) : (
        tekst
      )}
    </Button>
  );
}

export default function GeneriranjePodataka() {
  const { showLoading, hideLoading, postaviNaslov } = useLoading()
  useEffect(() => {(postaviNaslov('Generiranje Podataka'))})
  const jeMemorija = DATA_SOURCE === 'memorija';
  const jeLocalStorage = DATA_SOURCE === 'localStorage';
  const jeFirebase = DATA_SOURCE === 'firebase';
  const poznatiIzvor = jeMemorija || jeLocalStorage || jeFirebase;

  const [brojKategorije, setBrojKategorije] = useState(13);
  const [brojPredmeta, setBrojPredmeta] = useState(20);
  const [brojOznaka, setBrojOznaka] = useState(5);
  const [brojKorisnika, setBrojKorisnika] = useState(10);

  const [poruka, setPoruka] = useState(null);
  const [pregledSpremista, setPregledSpremista] = useState(null);
  const [radnja, setRadnja] = useState(null);

  const zauzet = radnja !== null;

  const { potvrdi } = useModal();

  useEffect(() => {
    document.title = `Generiranje podataka · ${APP_NAME}`;
  }, []);

  /** Jedinstvena obrada: spinner na aktivnom gumbu, poruka o uspjehu/grešci, reset stanja. */
  const izvrsi = async (kljuc, fn, porukaUspjeha) => {
    setRadnja(kljuc);
    setPoruka(null);

    try {
      const rezultat = await fn();
      setPoruka({
        tip: 'success',
        tekst: typeof porukaUspjeha === 'function' ? porukaUspjeha(rezultat) : porukaUspjeha,
      });
      return rezultat;
    } catch (greska) {
      setPoruka({ tip: 'danger', tekst: greska?.message ?? String(greska) });
      return null;
    } finally {
      setRadnja(null);
    }
  };

  const naPromjenuBroja = (postavi, min, max) => (dogadaj) => {
    const vrijednost = Number.parseInt(dogadaj.target.value, 10);
    postavi(Number.isNaN(vrijednost) ? min : Math.min(Math.max(vrijednost, min), max));
  };

  const ucitajPregledSpremista = () => {
    const pregled = {};

    for (const [naziv, kljuc] of Object.entries(LOCALSTORAGE_KLJUCEVI)) {
      const sirovo = localStorage.getItem(kljuc);

      if (sirovo === null) {
        pregled[naziv] = null;
        continue;
      }

      try {
        const parsed = JSON.parse(sirovo);
        pregled[naziv] = Array.isArray(parsed) ? parsed.length : -1;
      } catch {
        pregled[naziv] = -1;
      }
    }

    setPregledSpremista(pregled);
    return pregled;
  };

  const opisPregleda = (pregled) =>
    Object.entries(pregled)
      .map(
        ([naziv, broj]) =>
          `${naziv}: ${broj === null ? 'nema ključa' : broj === -1 ? 'neispravan JSON' : `${broj} zapisa`}`
      )
      .join(' · ');

  const handleProvjeriSpremiste = () => {
    const pregled = ucitajPregledSpremista();
    setPoruka({ tip: 'info', tekst: `Stanje localStoragea — ${opisPregleda(pregled)}` });
  };

  const handleProvjeriFirestore = () =>
    izvrsi(
      'provjeri-izvor',
      async () => {
        const [kategorije, oznake, korisnici, predmeti] = await Promise.all([
          prebrojZapisa(KategorijeServices),
          prebrojZapisa(OznakeServices),
          prebrojZapisa(KorisniciService),
          prebrojZapisa(PredmetiServices),
        ]);

        return { kategorije, oznake, korisnici, predmeti };
      },
      (brojevi) =>
        `Firestore: ${brojevi.kategorije} kategorija · ${brojevi.oznake} oznaka · ` +
        `${brojevi.korisnici} korisnika · ${brojevi.predmeti} predmeta.`
    );

  const handleGenerirajKategorije = (dogadaj) => {
    dogadaj.preventDefault();
    izvrsi(
      'generiraj-kategorije',
      () => generirajKategorije(brojKategorije),
      (nazivi) => `Uspješno generirano ${nazivi.length} kategorija.`
    );
  };

  const handleGenerirajPredmete = (dogadaj) => {
    dogadaj.preventDefault();
    izvrsi(
      'generiraj-predmete',
      () => generirajPredmete(brojPredmeta),
      (predmeti) => `Uspješno generirano ${predmeti.length} predmeta.`
    );
  };

  const handleGenerirajOznake = (dogadaj) => {
    dogadaj.preventDefault();
    izvrsi(
      'generiraj-oznake',
      () => generirajOznake(brojOznaka),
      (oznake) => `Uspješno generirano ${oznake.length} oznaka.`
    );
  };

  const handleGenerirajKorisnike = (dogadaj) => {
    dogadaj.preventDefault();
    izvrsi(
      'generiraj-korisnike',
      async () => {
        // Demo računi se osiguravaju prvi, da admin/korisnik uvijek postoje.
        const demo = await osigurajDemoRacune();
        const kreirani = await generirajKorisnike(brojKorisnika);
        return { demo, kreirani };
      },
      ({ demo, kreirani }) =>
        `Uspješno generirano ${kreirani.length} korisnika. ${opisDemoRacuna(demo)}`
    );
  };

  const handleGenerirajDemoRacune = () => {
    izvrsi(
      'generiraj-demo',
      () => osigurajDemoRacune(),
      (rezultat) => opisDemoRacuna(rezultat)
    );
  };

  const handleObrisi = async (kljuc) => {
    const konfiguracija = KONFIGURACIJA_BRISANJA[kljuc];
    const pitanje =
      `Jeste li sigurni da želite obrisati ${konfiguracija.akuzativ}?` +
      (konfiguracija.napomena ? ` ${konfiguracija.napomena}` : '');

    if (!(await potvrdi(pitanje))) {
      return;
    }

    return izvrsi(
      `obrisi-${kljuc}`,
      () => obrisiKolekciju(kljuc),
      ({ obrisano, preskoceno }) =>
        `Uspješno obrisano ${obrisano} ${konfiguracija.prijedlog}.` +
        (preskoceno > 0 ? ` Preskočeno ${preskoceno} zapisa.` : '')
    );
  };

  const handleMemorijaULocalStorage = async () => {
    // if (
    //   !(await potvrdi(
    //     'Jeste li sigurni da želite presipati sve podatke iz memorije u localStorage?'
    //   ))
    // ) {
    //   return;
    // }

    return izvrsi(
      'presipavanje',
      async () => {
        // Uvijek iz memorije: dohvatiListu(servis) bi u firebase načinu vratio
        // Firestore, a ne memoriju.
        const sve = await dohvatiMemoriju();
        const ukupno =
          sve.predmeti.length + sve.kategorije.length + sve.oznake.length + sve.korisnici.length;

        if (ukupno === 0) {
          throw new Error(
            'Izvor (memorija) je prazan — nema se što presipati. Prvo generirajte podatke.'
          );
        }

        for (const kljuc of REDOSLIJED_PISANJA) {
          localStorage.setItem(LOCALSTORAGE_KLJUCEVI[kljuc], JSON.stringify(sve[kljuc]));
        }

        ucitajPregledSpremista();
        return sve;
      },
      (sve) =>
        `Presipano u localStorage: ${sve.kategorije.length} kategorija, ${sve.oznake.length} oznaka, ` +
        `${sve.korisnici.length} korisnika, ${sve.predmeti.length} predmeta. ` +
        `Za korištenje postavite DATA_SOURCE = 'localStorage' i osvježite stranicu.`
    );
  };

  const handleMemorijaUFirebase = async () => {
    // const pitanje =
    //   'Pretočiti sve podatke iz memorije u Firestore? ' +
    //   'Postojeći zapisi se neće obrisati — ako su isti podaci već u Firestoreu, ' +
    //   'ponovnim pretakanjem nastaju duplikati.';

    // if (!(await potvrdi(pitanje))) {
    //   return;
    // }

    return izvrsi(
      'presipavanje-firebase',
      async () => {

  const { kategorije, oznake, predmeti, korisnici } = await dohvatiMemoriju();

        //  const operateriPromises = korisnici.map(e => {
        //         const { id, ...ostatak } = e;
        //         console.log(ostatak)
        //         return KorisniciServiceFirebase.dodajBezHash(ostatak);
        //     });
        //     await Promise.all(operateriPromises);

        //     console.log('Dodao operatere')

      
        const ukupno =
          kategorije.length + oznake.length + predmeti.length + korisnici.length;

        if (ukupno === 0) {
          throw new Error('Memorija je prazna — nema se što pretočiti u Firestore.');
        }




        // 1) Korisnici. Memorija čuva bcrypt hashove, a dodajBezHash ih ne
        //    hashira ponovno — prijava s istom lozinkom zato i dalje radi.
        const mapaKorisnika = new Map();
        for (const korisnik of korisnici) {
          const { id, ...ostalo } = korisnik;
          const odgovor = await KorisniciServiceFirebase.dodajBezHash(ostalo);

          if (!odgovor?.success) {
            throw new Error(
              `Korisnika ${korisnik.email} nije moguće pretočiti: ${odgovor?.message ?? 'nepoznata greška'}`
            );
          }

          mapaKorisnika.set(String(id), odgovor.data?.id ?? null);
        }

        // 2) Kategorije — prije predmeta jer ih predmeti referenciraju.
        const mapaKategorija = new Map();
        for (const kategorija of kategorije) {
          const { id, ...ostalo } = kategorija;
          const odgovor = await KategorijeServicesFirebase.dodaj(ostalo);

          if (!odgovor?.success) {
            throw new Error(
              `Kategoriju "${kategorija.naziv}" nije moguće pretočiti: ${odgovor?.message ?? 'nepoznata greška'}`
            );
          }

          mapaKategorija.set(String(id), odgovor.id ?? null);
        }

        // 3) Oznake — također prije predmeta.
        const mapaOznaka = new Map();
        for (const oznaka of oznake) {
          const { id, ...ostalo } = oznaka;
          const odgovor = await OznakeServicesFirebase.dodaj(ostalo);

          if (!odgovor?.success) {
            throw new Error(
              `Oznaku "${oznaka.naziv}" nije moguće pretočiti: ${odgovor?.message ?? 'nepoznata greška'}`
            );
          }

          mapaOznaka.set(String(id), odgovor.data?.id ?? null);
        }

        // 4) Predmeti — stare id-eve zamjenjujemo novim Firestore id-evima.
        let brojPredmeta = 0;
        for (const predmet of predmeti) {
          const { id, ...ostalo } = predmet;

          const noviPredmet = {
            ...ostalo,
            kategorija: preslikaj(mapaKategorija, predmet.kategorija),
            oznake: Array.isArray(predmet.oznake)
              ? predmet.oznake
                  .map((oznaka) => preslikaj(mapaOznaka, oznaka))
                  .filter((vrijednost) => vrijednost !== null)
              : [],
            ponude: Array.isArray(predmet.ponude)
              ? predmet.ponude.map((ponuda) => ({
                  ...ponuda,
                  korisnik: preslikaj(mapaKorisnika, ponuda?.korisnik),
                }))
              : [],
            omiljeni: Array.isArray(predmet.omiljeni)
              ? predmet.omiljeni
                  .map((korisnik) => preslikaj(mapaKorisnika, korisnik))
                  .filter((vrijednost) => vrijednost !== null)
              : [],
          };

          const odgovor = await PredmetiFirebaseServices.dodaj(noviPredmet);

          if (!odgovor?.success) {
            throw new Error(
              `Predmet "${predmet.naziv}" nije moguće pretočiti: ${odgovor?.message ?? 'nepoznata greška'}`
            );
          }

          brojPredmeta += 1;
        }

        return {
          kategorije: kategorije.length,
          oznake: oznake.length,
          korisnici: korisnici.length,
          predmeti: brojPredmeta,
        };
      },
      (brojevi) =>
        `Pretočeno u Firestore: ${brojevi.kategorije} kategorija, ${brojevi.oznake} oznaka, ` +
        `${brojevi.korisnici} korisnika, ${brojevi.predmeti} predmeta. ` +
        "Za korištenje postavite DATA_SOURCE = 'firebase' i osvježite stranicu."
    );
  };

  const bojaIzvora = jeMemorija
    ? 'secondary'
    : jeLocalStorage
      ? 'success'
      : jeFirebase
        ? 'primary'
        : 'dark';

  return (
    <div className="mt-4">
      <h1>
        Generiranje podataka{' '}
        <Badge bg={bojaIzvora} className="align-middle fs-6">
          {DATA_SOURCE}
        </Badge>
      </h1>
      <p className="text-muted">
        Koristite ovaj alat za generiranje testnih podataka s lažnim (fake) podacima na hrvatskom
        jeziku. Sve radnje idu kroz servis koji odgovara postavci <code>DATA_SOURCE</code> u{' '}
        <code>constants</code> — <code>memorija</code>, <code>localStorage</code> ili{' '}
        <code>firebase</code>.
      </p>

      {!poznatiIzvor && (
        <Alert variant="danger">
          <strong>Nepoznat izvor podataka:</strong> <code>DATA_SOURCE</code> je postavljen na{' '}
          <code>{String(DATA_SOURCE)}</code>, pa servisi vraćaju prazan objekt (PrazanServis). Svi
          gumbi ispod bit će bez učinka dok u <code>constants</code> ne postavite{' '}
          <code>'memorija'</code>, <code>'localStorage'</code> ili <code>'firebase'</code>.
        </Alert>
      )}

      {poruka && (
        <Alert variant={poruka.tip} dismissible onClose={() => setPoruka(null)}>
          {poruka.tekst}
        </Alert>
      )}

      <Row>
        <Col md={3} className="mb-3">
          <Form onSubmit={handleGenerirajKategorije}>
            <Form.Group className="mb-3" controlId="brojKategorija">
              <Form.Label>Broj kategorija</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="50"
                value={brojKategorije}
                onChange={naPromjenuBroja(setBrojKategorije, 1, 50)}
                disabled={zauzet}
              />
            </Form.Group>
            <GumbRadnje
              radnja={radnja}
              kljuc="generiraj-kategorije"
              tekst="Generiraj kategorije"
              tekstUTijeku="Generiranje..."
              type="submit"
            />
          </Form>
        </Col>

        <Col md={3} className="mb-3">
          <Form onSubmit={handleGenerirajOznake}>
            <Form.Group className="mb-3" controlId="brojOznaka">
              <Form.Label>Broj oznaka</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="50"
                value={brojOznaka}
                onChange={naPromjenuBroja(setBrojOznaka, 1, 50)}
                disabled={zauzet}
              />
            </Form.Group>
            <GumbRadnje
              radnja={radnja}
              kljuc="generiraj-oznake"
              tekst="Generiraj oznake"
              tekstUTijeku="Generiranje..."
              type="submit"
            />
          </Form>
        </Col>

        <Col md={3} className="mb-3">
          <Form onSubmit={handleGenerirajPredmete}>
            <Form.Group className="mb-3" controlId="brojPredmeta">
              <Form.Label>Broj predmeta</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="200"
                value={brojPredmeta}
                onChange={naPromjenuBroja(setBrojPredmeta, 1, 200)}
                disabled={zauzet}
              />
            </Form.Group>
            <GumbRadnje
              radnja={radnja}
              kljuc="generiraj-predmete"
              tekst="Generiraj predmete"
              tekstUTijeku="Generiranje..."
              type="submit"
            />
          </Form>
        </Col>

        <Col md={3} className="mb-3">
          <Form onSubmit={handleGenerirajKorisnike}>
            <Form.Group className="mb-3" controlId="brojKorisnika">
              <Form.Label>Broj korisnika</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="50"
                value={brojKorisnika}
                onChange={naPromjenuBroja(setBrojKorisnika, 1, 50)}
                disabled={zauzet}
              />
            </Form.Group>
            <GumbRadnje
              radnja={radnja}
              kljuc="generiraj-korisnike"
              tekst="Generiraj korisnike"
              tekstUTijeku="Generiranje..."
              type="submit"
            />
          </Form>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col md={8}>
          <p className="text-muted mb-2">
            Demo računi <code>{DEMO_ADMIN?.email}</code> (<code>admin</code>) i{' '}
            <code>{DEMO_KORISNIK?.email}</code> (<code>korisnik</code>), lozinka{' '}
            <code>{DEMO_LOZINKA}</code>, u memoriji i localStorageu postoje unaprijed — u Firestoreu
            ih nitko ne stvara. Ovaj gumb ih kreira u aktivnom izvoru, a ako već postoje s drugom
            lozinkom ili ulogom, popravlja ih.
          </p>
        </Col>
        <Col md={4}>
          <GumbRadnje
            radnja={radnja}
            kljuc="generiraj-demo"
            tekst="Generiraj demo račune"
            tekstUTijeku="Kreiranje..."
            varijanta="outline-primary"
            onClick={handleGenerirajDemoRacune}
            className="w-100 mb-2"
          />
        </Col>
      </Row>

      <Alert className="mt-3" style={{ backgroundColor: 'orange' }}>
        <strong>Upozorenje:</strong> Ove akcije će dodati nove podatke u postojeće. Najprije
        generirajte kategorije i oznake, a zatim predmete.
      </Alert>

      <hr className="my-4" />

      <h3>Brisanje podataka</h3>
      <p className="text-muted">Koristite ove opcije za brisanje svih podataka iz aktivnog izvora.</p>

      <Row className="mt-3">
        <Col md={3}>
          <GumbRadnje
            radnja={radnja}
            kljuc="obrisi-kategorije"
            tekst="Obriši sve kategorije"
            tekstUTijeku="Brisanje..."
            varijanta="danger"
            onClick={() => handleObrisi('kategorije')}
            className="w-100 mb-2"
          />
        </Col>
        <Col md={3}>
          <GumbRadnje
            radnja={radnja}
            kljuc="obrisi-oznake"
            tekst="Obriši sve oznake"
            tekstUTijeku="Brisanje..."
            varijanta="danger"
            onClick={() => handleObrisi('oznake')}
            className="w-100 mb-2"
          />
        </Col>
        <Col md={3}>
          <GumbRadnje
            radnja={radnja}
            kljuc="obrisi-predmete"
            tekst="Obriši sve predmete"
            tekstUTijeku="Brisanje..."
            varijanta="danger"
            onClick={() => handleObrisi('predmeti')}
            className="w-100 mb-2"
          />
        </Col>
        <Col md={3}>
          <GumbRadnje
            radnja={radnja}
            kljuc="obrisi-korisnike"
            tekst="Obriši sve korisnike"
            tekstUTijeku="Brisanje..."
            varijanta="danger"
            onClick={() => handleObrisi('korisnici')}
            className="w-100 mb-2"
          />
        </Col>
      </Row>

      {(jeMemorija || jeFirebase) && (
        <>
          <hr className="my-4" />

          <h3>Presipavanje podataka</h3>
          <p className="text-muted">
            Kopira podatke iz <strong>memorije</strong> (početni podaci iz <code>*Data.js</code> plus
            sve što je u ovom pokretanju generirano) u <code>localStorage</code> ili u Firestore.
            Firestore zapisi se ne brišu — ako su isti podaci već tamo, ponovno presipavanje stvara
            duplikate.
          </p>

          <Row className="mt-3">
            <Col md={4}>
              <GumbRadnje
                radnja={radnja}
                kljuc="presipavanje"
                tekst="Iz memorije u localStorage"
                tekstUTijeku="Presipavanje..."
                varijanta="danger"
                onClick={handleMemorijaULocalStorage}
                className="w-100 mb-2"
              />
            </Col>
            <Col md={4}>
              <GumbRadnje
                radnja={radnja}
                kljuc="presipavanje-firebase"
                tekst="Iz memorije u Firebase"
                tekstUTijeku="Pretakanje..."
                varijanta="danger"
                onClick={handleMemorijaUFirebase}
                className="w-100 mb-2"
              />
            </Col>
            <Col md={4}>
              <GumbRadnje
                radnja={radnja}
                kljuc="provjeri-spremiste"
                tekst="Provjeri spremište"
                tekstUTijeku="Provjera..."
                varijanta="outline-secondary"
                onClick={handleProvjeriSpremiste}
                className="w-100 mb-2"
              />
            </Col>
          </Row>
        </>
      )}

      {jeFirebase && (
        <>
          <hr className="my-4" />

          <h3>Firestore</h3>
          <p className="text-muted">
            Podaci se zapisuju izravno u Firestore kolekcije <code>e4.*</code>. Ovdje možete
            provjeriti koliko zapisa servisi stvarno vraćaju. Ako dobijete grešku ili same nule,
            provjerite <code>.env</code> (<code>VITE_FIREBASE_*</code>) i Firestore pravila za te
            kolekcije.
          </p>

          <Row className="mt-3">
            <Col md={3}>
              <GumbRadnje
                radnja={radnja}
                kljuc="provjeri-izvor"
                tekst="Provjeri izvor"
                tekstUTijeku="Provjera..."
                varijanta="outline-primary"
                onClick={handleProvjeriFirestore}
                className="w-100 mb-2"
              />
            </Col>
          </Row>
        </>
      )}

      {jeLocalStorage && (
        <>
          <hr className="my-4" />

          <h3>Spremište (localStorage)</h3>
          <p className="text-muted">
            Podaci se već zapisuju izravno u <code>localStorage</code>, pa presipavanje nije
            potrebno. Ovdje možete provjeriti što se trenutno nalazi u spremištu.
          </p>

          <Row className="mt-3">
            <Col md={3}>
              <GumbRadnje
                radnja={radnja}
                kljuc="provjeri-spremiste"
                tekst="Provjeri spremište"
                tekstUTijeku="Provjera..."
                varijanta="outline-secondary"
                onClick={handleProvjeriSpremiste}
                className="w-100 mb-2"
              />
            </Col>
          </Row>
        </>
      )}

      {pregledSpremista && (
        <div className="mt-3">
          <strong>Stanje localStoragea:</strong>
          <ul className="mb-0">
            {Object.entries(pregledSpremista).map(([naziv, broj]) => (
              <li key={naziv}>
                <code>{LOCALSTORAGE_KLJUCEVI[naziv]}</code>:{' '}
                {broj === null
                  ? 'ključ ne postoji'
                  : broj === -1
                    ? 'neispravan JSON'
                    : `${broj} zapisa`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {jeMemorija && (
        <Alert variant="secondary" className="mt-3">
          <strong>Napomena:</strong> prijelaz u suprotnom smjeru (localStorage → memorija) nije
          moguć kroz postojeće servise jer memorijski servisi nemaju metodu za zamjenu sadržaja.
          Memorija se pri svakom osvježavanju ponovno puni iz <code>*Data.js</code> datoteka.
        </Alert>
      )}

      <Alert variant="danger" className="mt-3">
        <strong>Oprez!</strong> Brisanje podataka je trajna akcija i ne može se poništiti.
      </Alert>
    </div>
  );
}
