import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

export default function KorisniciPdfgenerator({ korisnici }) {

  const fetchFontAsBase64 = async (url) => {
    const response = await fetch(url)

    if (!response.ok) throw new Error(`Font nije pronađen ${url}`)
    const blob = await response.blob()

    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result.split(',')[1])
      reader.readAsDataURL(blob)
    })
  }

  const generirajPDF = async () => {
    const [regBase64, boldBase64] = await Promise.all([
      fetchFontAsBase64('/fonts/Montserrat/Regular.ttf'),
      fetchFontAsBase64('/fonts/Montserrat-Bold.ttf')
    ])

    const doc = new jsPDF()

    doc.addFileToVFS('Montserrat-Regular.ttf', regBase64);
    doc.addFont('Montserrat-Regular.ttf', 'Montserrat', 'normal');
    doc.addFileToVFS('Montserrat-Bold.ttf', boldBase64);
    doc.addFont('Montserrat-Bold.ttf', 'Montserrat', 'bold');

    const primaryColor = [26, 53, 128]
    const secondaryColor = [72, 86, 206]
    const textColor = [89, 92, 95]

    doc.setFont('Montserrat', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(...primaryColor);
    doc.text('Aukcije', 15, 20);

    doc.setFont('Montserrat', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...secondaryColor)
    doc.text('Popis Korisnika', 15, 26)

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.8);
    doc.line(15, 30, 195, 30);

    doc.setFont('Montserrat', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...textColor);
    doc.text(`Izvješće za grupu: ${korisnici?.naziv || 'N/A'}`, 15, 42);

    let currentY = 52

    autoTable(doc, {
      startY: currentY,
      margin: { left: 15, right: 15 },
      theme: 'plain',
      styles: { font: 'Montserrat', fontSize: 9.5, textColor: textColor, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: primaryColor, width: 85 },
        1: { fontStyle: 'bold', textColor: primaryColor, width: 85 }
      },
      head: [['PODATCI O KORISNICIMA']],
      body: [
        [`Ime: ${korisnici?.ime || 'N/A'}`],
        [`Email: ${korisnici?.email || 'N/A'}`],
        [`Dodano: ${korisnici?.dodano || 'N/A'}`]
      ],

      didParseCell: (data) => {
        if (data.section === 'head') {
          data.cell.styles.fillColor = [241, 245, 249];
          data.cell.styles.textColor = primaryColor;
          data.cell.styles.fontStyle = 'bold';
        }
      }

    })

    currentY = doc.lastAutoTable.finalY + 12
    doc.setFont('Montserrat', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(...textColor)
    doc.text('Popis registriranih korisnika', 15, currentY)
    currentY += 5

    if (korisnici && korisnici.length > 0) {

      const tableData = korisnici.map((k, index) => [

        index + 1,
        k.ime || '',
        k.prezime || '',
        k.email || ''
      ])

      autoTable(doc, {

        startY: currentY,
        margin: { left: 15, right: 15 },
        head: [['#', 'Ime', 'Prezime', 'Email']],
        body: tableData,
        fontSize: 9,
        textColor: textColor,
        cellPadding: 4,
        overflow: 'linebreak',
        headStyles: {
          font: 'Montserrat',
          fontStyle: 'bold',
          fillColor: primaryColor,
          textColor: [0, 0, 255],
          halign: 'left'
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 50 },
          2: { cellWidth: 55 },
          3: { cellWidth: 65 },
        }
      }
      )
    }

  }

  return { generirajPDF }
}