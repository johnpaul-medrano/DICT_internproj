<template>
    <div>
      <form @submit.prevent="generatePDF" class="purchase-request-form">
        <div v-for="(label, key) in fields" :key="key" class="grid-item">
          <label :for="key">{{ label }}:</label>
          <input type="text" :id="key" v-model="form[key]" />
        </div>
        <button type="submit" id="generate">Generate PDF</button>
      </form>
    </div>
  </template>
  
  <script>
  import { PDFDocument, rgb } from 'pdf-lib';
  import templateUrl from '@/assets/po-template.pdf';
  import '@/pages/tabs/SO_poform.css';
  
  export default {
    data() {
      return {
        form: {
          supplier: '',
          address: '',
          tin: '',
          poNo: '',
          date: '',
          modeOfProcurement: '',
          stockNo: '',
          unit: '',
          description: '',
          quantity: '',
          unitCost: '',
          amount: '',
          totalAmount: '',
          totalAmountinWords: ''
        },
        fields: {
          supplier: 'Supplier',
          address: 'Address',
          tin: 'TIN',
          poNo: 'P.O No.',
          date: 'Date',
          modeOfProcurement: 'Mode of Procurement',
          stockNo: 'Stock No.',
          unit: 'Unit',
          description: 'Description',
          quantity: 'Quantity',
          unitCost: 'Unit Cost',
          amount: 'Amount',
          totalAmount: 'Total Amount',
          totalAmountinWords: 'Total Amount in Words'
        }
      };
    },
    methods: {
      async generatePDF() {
        const formValues = this.form;
        const existingPdfBytes = await fetch(templateUrl).then(res => res.arrayBuffer());
  
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
  
        firstPage.drawText(formValues.supplier, { 
            x: 65, 
            y: 670, 
            size: 10 });
        firstPage.drawText(formValues.address, { 
            x: 65, 
            y: 655, 
            size: 10 });
        firstPage.drawText(formValues.tin, { 
            x: 42, 
            y: 640, 
            size: 10 });
        firstPage.drawText(formValues.poNo, { 
            x: 466, 
            y: 670, 
            size: 10 });
        firstPage.drawText(formValues.date, { 
            x: 450, 
            y: 655, 
            size: 10 });
        firstPage.drawText(formValues.modeOfProcurement, { 
            x: 523, 
            y: 640, 
            size: 10 });
        firstPage.drawText(formValues.stockNo, { 
            x: 50, 
            y: 510, 
            size: 10 });
        firstPage.drawText(formValues.unit, { 
            x: 110, 
            y: 510, 
            size: 10 });
        firstPage.drawText(formValues.description, { 
            x: 150, 
            y: 540, 
            size: 10 });
        firstPage.drawText(formValues.quantity, { 
            x: 435, 
            y: 510, 
            size: 10 });
        firstPage.drawText(formValues.unitCost, { 
            x: 485, 
            y: 510, 
            size: 10 });
        firstPage.drawText(formValues.amount, { 
            x: 545, 
            y: 510, 
            size: 10 });
        firstPage.drawText(formValues.totalAmount, { 
            x: 539, 
            y: 410, 
            size: 10 });
        firstPage.drawText(formValues.totalAmountinWords, { 
            x: 145, 
            y: 396, 
            size: 10 });
        firstPage.drawText(formValues.supplier, { 
            x: 105, 
            y: 275, 
            size: 10 });
  
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
  
        // Trigger automatic download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated-po.pdf';
        a.click();
  
        URL.revokeObjectURL(url); // Free up the object URL
      }
    }
  };
  </script>
  
  <style scoped>
  /* Optional scoped styles can still be added here if needed */
  </style>
  