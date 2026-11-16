import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

const REGULAR_FONT = "Montserrat-Regular.ttf"
const BOLD_FONT = "Montserrat-Bold.ttf"

async function fetchFontAsBase64(url) {
  const response = await fetch(url)

  if (!response.ok) throw new Error(`Font nije pronađen: ${url}`)

  const blob = await response.blob()

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const rezultat = String(reader.result || "")
      const zarez = rezultat.indexOf(",")
      resolve(zarez === -1 ? "" : rezultat.slice(zarez + 1))
    }
    reader.onerror = () => reject(new Error(`Font nije moguće pročitati: ${url}`))
    reader.readAsDataURL(blob)
  })
}

function normalizirajKorisnike(korisnici) {
  if (Array.isArray(korisnici)) return korisnici.filter(Boolean)
  return korisnici ? [korisnici] : []
}

function tekst(vrijednost, rezerva = "-") {
  if (vrijednost === null || vrijednost === undefined) return rezerva
  const ocisceno = String(vrijednost).trim()
  return ocisceno === "" ? rezerva : ocisceno
}

function sigurnoImeDatoteke(vrijednost) {
  return String(vrijednost || "korisnik")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Generira PDF popis korisnika.
 *
 * - `generirajKorisniciPDF(sviKorisnici)` → PDF sa svim proslijeđenim korisnicima.
 * - `generirajKorisniciPDF([korisnik])` → PDF samo za tog korisnika.
 *
 * Izgled i stilovi PDF-a ostaju isti u oba slučaja.
 */
export async function generirajKorisniciPDF(korisnici, opcije = {}) {
  const lista = normalizirajKorisnike(korisnici)

  if (lista.length === 0) {
    throw new Error("Nema korisnika za generiranje PDF-a.")
  }

  const osnovniPut = import.meta.env.BASE_URL || "/"

  const [regBase64, boldBase64] = await Promise.all([
    fetchFontAsBase64(`${osnovniPut}fonts/${REGULAR_FONT}`),
    fetchFontAsBase64(`${osnovniPut}fonts/${BOLD_FONT}`)
  ])

  const doc = new jsPDF()

  doc.addFileToVFS(REGULAR_FONT, regBase64)
  doc.addFont(REGULAR_FONT, "Montserrat", "normal")
  doc.addFileToVFS(BOLD_FONT, boldBase64)
  doc.addFont(BOLD_FONT, "Montserrat", "bold")

  const primaryColor = [26, 53, 128]
  const secondaryColor = [72, 86, 206]
  const textColor = [89, 92, 95]

  const pojedinacni = lista.length === 1
  const naslov =
    opcije.naslov ?? (pojedinacni ? "Podaci o korisniku" : "Popis registriranih korisnika")
  const podnaslov = opcije.podnaslov ?? (pojedinacni ? "Korisnik" : "Popis Korisnika")

  doc.setFont("Montserrat", "bold")
  doc.setFontSize(22)
  doc.setTextColor(...primaryColor)
  doc.text("Aukcije", 15, 20)

  doc.setFont("Montserrat", "bold")
  doc.setFontSize(9)
  doc.setTextColor(...secondaryColor)
  doc.text(podnaslov, 15, 26)

  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.8)
  doc.line(15, 30, 195, 30)

  let currentY = 52
  doc.setFont("Montserrat", "bold")
  doc.setFontSize(13)
  doc.setTextColor(...textColor)
  doc.text(naslov, 15, currentY)
  currentY += 5

  const imaOsobnePodatke = lista.some(
    (k) => tekst(k.ime, "") !== "" || tekst(k.prezime, "") !== ""
  )

  const zaglavlje = imaOsobnePodatke
    ? ["#", "Ime", "Prezime", "Email", "Uloga"]
    : ["#", "Email", "Uloga"]

  const tijelo = lista.map((k, index) => {
    if (imaOsobnePodatke) {
      return [
        index + 1,
        tekst(k.ime),
        tekst(k.prezime),
        tekst(k.email),
        tekst(k.uloga)
      ]
    }

    return [index + 1, tekst(k.email), tekst(k.uloga)]
  })

  autoTable(doc, {
    startY: currentY,
    margin: { left: 15, right: 15 },
    head: [zaglavlje],
    body: tijelo,
    styles: {
      font: "Montserrat"
    },
    fontSize: 9,
    textColor: textColor,
    cellPadding: 4,
    overflow: "linebreak",
    headStyles: {
      fontStyle: "bold",
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      halign: "center"
    },
    columnStyles: imaOsobnePodatke
      ? {
          0: { cellWidth: 10, halign: "center" },
          1: { cellWidth: 35 },
          2: { cellWidth: 35 },
          3: { cellWidth: 60 },
          4: { cellWidth: 40 }
        }
      : {
          0: { cellWidth: 12, halign: "center" },
          1: { cellWidth: 118 },
          2: { cellWidth: 50 }
        }
  })

  const pageCount = doc.internal.getNumberOfPages()

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)

    doc.setDrawColor(226, 232, 240)
    doc.setLineWidth(0.4)
    doc.line(
      15,
      doc.internal.pageSize.getHeight() - 15,
      195,
      doc.internal.pageSize.getHeight() - 15
    )

    doc.setFont("Montserrat", "normal")
    doc.setFontSize(8)
    doc.setTextColor(...secondaryColor)

    doc.text(
      `generirano: ${new Date().toLocaleString("hr-HR")}`,
      15,
      doc.internal.pageSize.getHeight() - 8
    )

    doc.text(
      `Stranica ${i} od ${pageCount}`,
      doc.internal.pageSize.getWidth() - 15,
      doc.internal.pageSize.getHeight() - 8,
      { align: "right" }
    )
  }

  const nazivDatoteke = pojedinacni
    ? `korisnik-${sigurnoImeDatoteke(lista[0].email || lista[0].id)}.pdf`
    : `korisnici-${new Date().toISOString().slice(0, 10)}.pdf`

  const pdfUrl = doc.output("bloburl")
  const noviProzor = window.open(pdfUrl, "_blank")

  // Ako je preglednik blokirao novi prozor, ponudi preuzimanje datoteke.
  if (!noviProzor) {
    doc.save(nazivDatoteke)
  }
}

export default generirajKorisniciPDF
