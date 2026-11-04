import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

export default function KorisniciPdfGenerator({ korisnici }) {

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
      fetchFontAsBase64('/fonts/Montserrat-Regular.ttf'),
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


    let currentY = 52
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
          textColor: [255,255,255],
          halign: 'center'
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 55 },
          2: { cellWidth: 55 },
          3: { cellWidth: 55 },
        }

       
      }
        
        
      )

      const pageCount = doc.internal.getNumberOfPages()
      
      for (let i = 1; i <= pageCount; i++){

        doc.setPage(i)

        doc.setDrawColor(226,232, 240)
        doc.setLineWidth(0.4)
        doc.line(15, doc.internal.pageSize.getHeight() - 15, 195, doc.internal.pageSize.getHeight() - 15)

        doc.setFont('Montserrat', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(...secondaryColor)

        doc.text(
          `generirano: ${new Date().toLocaleString('hr-HR')}`,
          15,
          doc.internal.pageSize.getHeight() - 8
        )

        doc.text(

          `Stranica ${i} od ${pageCount}`,
          doc.internal.pageSize.getWidth() - 15,
          doc.internal.pageSize.getHeight() - 8,
          {align:'right'}
        )
      }

      const pdfBlob = doc.output('blob')
      const pdfUrl = URL.createObjectURL(pdfBlob)
      window.open(pdfUrl, '_blank')
    }

  }

  return generirajPDF
}