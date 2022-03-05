import { Box, H3, Button } from '@adminjs/design-system'
import React, { useEffect, useState } from 'react'
//import { PDFDocument } from 'pdf-lib'

const CustomDashboard = () => {
  const [pdfInfo, setPdfInfo] = useState([])
  const generateReport = async () => {
    //const formUrl = 'https://oh-estore.s3.amazonaws.com/testpdf.pdf'
    //const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer())
    //const blob = new Blob([formPdfBytes], {type: 'application/pdf'})
    //const docUrl = URL.createObjectURL(blob)
    //setPdfInfo(docUrl)
    //const pdfDoc = await PDFDocument.load(formPdfBytes)
    //const form = pdfDoc.getForm()
    //const nameField = form.getTextField('Name')
    //nameField.setText('Gordon Cheng')
    //const emailField = form.getTextField('Email')
    //emailField.setText('trgordonb@gmail.com')
    //const mobileField = form.getTextField('Mobile')
    //mobileField.setText('92334925')
    //const pdfBytes = await pdfDoc.save()
  }

  useEffect(() => {
    const loadPdf = async () => {
      //const formUrl = 'https://oh-estore.s3.amazonaws.com/testpdf.pdf'
      //const formPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer())
      //const pdfDoc = await PDFDocument.load(formPdfBytes)
      //const blob = new Blob([formPdfBytes], {type: 'application/pdf'})
      //const docUrl = URL.createObjectURL(blob)
      //setPdfInfo(docUrl)
    }
    //loadPdf()
  },[])

  return (
    <Box variant="grey">
      <Box variant="white">
          <H3>Here you can specify a totally custom dashboard</H3>
          <Box>
            <Button onClick={()=>{}}>PDF View</Button>
          </Box>
          {
            //<iframe width={1200} height={800} src={pdfInfo} type="application/pdf"/>
          }
      </Box>
    </Box>
  )
}

export default CustomDashboard
