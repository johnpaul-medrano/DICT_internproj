<template>
  <div>
    <h1>Abstract Form</h1>
    <form @submit.prevent="generatePdf">
      <div v-for="(item, index) in form.items" :key="index">
        <h3>Item {{ index + 1 }}</h3>
        <label>
          Particulars:
          <input v-model="item.particulars" required>
        </label>
        <label>
          Control No.:
          <input v-model="item.controlNo" required>
        </label>
        <label>
          Item No.:
          <input type="number" v-model="item.itemNo" required>
        </label>
        <label>
          Quantity:
          <input type="number" v-model="item.qty" required>
        </label>
        <label>
          Unit:
          <input v-model="item.unit" required>
        </label>
        <label>
          Article/Service:
          <input v-model="item.articleService" required>
        </label>
        <label>
          Supplier 1:
          <input v-model="item.supplier1" required>
        </label>
        <label>
          Supplier 2:
          <input v-model="item.supplier2" required>
        </label>
        <label>
          Supplier 3:
          <input v-model="item.supplier3" required>
        </label>
        <label>
          Price 1:
          <input type="number" v-model="item.price1" required>
        </label>
        <label>
          Price 2:
          <input type="number" v-model="item.price2" required>
        </label>
        <label>
          Price 3:
          <input type="number" v-model="item.price3" required>
        </label>
      </div>
      <button type="button" @click="addItem">Add Item</button>
      <button type="submit">Generate PDF</button>
    </form>
  </div>
</template>

<script>
import { PDFDocument, rgb } from 'pdf-lib';
import pdfTemplate from '@/assets/abstract.pdf'; // Ensure your template is in the assets folder

export default {
  data() {
    return {
      form: {
        items: [
          {
            particulars: 'title',
            controlNo: '011',
            itemNo: 1,
            qty: 1,
            unit: 'piece',
            articleService: 'van rental',
            supplier1: 'bdo',
            supplier2: 'dswd',
            supplier3: 'bpi',
            price1: 2500,
            price2: 1500,
            price3: 1200,
          },
        ],
      },
    };
  },
  methods: {
    addItem() {
      this.form.items.push({
        particulars: '',
        controlNo: '',
        itemNo: this.form.items.length + 1,
        qty: 1,
        unit: '',
        articleService: '',
        supplier1: '',
        supplier2: '',
        supplier3: '',
        price1: 0,
        price2: 0,
        price3: 0,
      });
    },
    async generatePdf() {
      try {
        console.log('Fetching the PDF template...');
        const response = await fetch(pdfTemplate);
        if (!response.ok) throw new Error('Failed to fetch PDF template');
        const existingPdfBytes = await response.arrayBuffer();
        console.log('PDF template fetched successfully');

        console.log('Loading the existing PDF...');
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        console.log('PDF document loaded successfully');

        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();
        console.log(`Page size: width=${width}, height=${height}`);

        // Initial y-coordinate and step size for each row
        let yOffset = 400;
        const yOffsetStep = 20;

        // Draw the form data onto the PDF
        this.form.items.forEach((item, index) => {
          console.log(`Processing item ${index + 1}`);
          if (yOffset < 0) {
            console.warn(`yOffset=${yOffset} is out of bounds, skipping item ${index + 1}`);
            return;
          }
          firstPage.drawText(item.particulars, { x: 510, y: 510, size: 20, color: rgb(0, 0, 0) });
          firstPage.drawText(item.controlNo, { x: 80, y: 502, size: 10, color: rgb(0, 0, 0) });
          firstPage.drawText(String(item.itemNo), { x: 30, y: 435, size: 10, color: rgb(0, 0, 0) });
          firstPage.drawText(String(item.qty), { x: 60, y: 435, size: 10, color: rgb(0, 0, 0) });
          firstPage.drawText(item.unit, { x: 95, y: 435, size: 10, color: rgb(0, 0, 0) });
          firstPage.drawText(item.articleService, { x: 150, y: 435, size: 10, color: rgb(0, 0, 0) });
          firstPage.drawText(item.supplier1, { x: 610, y: 470, size: 10, color: rgb(0, 0, 0) });
          firstPage.drawText(item.supplier2, { x: 750, y: 470, size: 10, color: rgb(0, 0, 0) });
          firstPage.drawText(item.supplier3, { x: 900, y: 470, size: 10, color: rgb(0, 0, 0) });
          firstPage.drawText(String(item.price1), { x: 610, y: 435, size: 10, color: rgb(0, 0, 0) });
          firstPage.drawText(String(item.price2), { x: 750, y: 435, size: 10, color: rgb(0, 0, 0) });
          firstPage.drawText(String(item.price3), { x: 900, y: 435, size: 10, color: rgb(0, 0, 0) });
          firstPage.drawText(String(item.price1), { x: 610, y: 335, size: 10, color: rgb(0, 0, 0) });
          firstPage.drawText(String(item.price2), { x: 750, y: 335, size: 10, color: rgb(0, 0, 0) });
          firstPage.drawText(String(item.price3), { x: 900, y: 335, size: 10, color: rgb(0, 0, 0) });

          yOffset -= yOffsetStep; // Move to the next row
          console.log(`Item ${index + 1} drawn at y=${yOffset}`);
        });

        console.log('Saving the modified PDF...');
        const pdfBytes = await pdfDoc.save();
        console.log('PDF document saved successfully');

        // Create a Blob and open the new PDF in a new window
        console.log('Creating a Blob from the PDF bytes...');
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        console.log('Opening the PDF in a new window...');
        window.open(url);

      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    },
  }
};
</script>

<style scoped>
form {
  display: grid;
  gap: 1em;
}
label {
  display: block;
  margin-bottom: 0.5em;
}
input {
  width: 100%;
  padding: 0.5em;
}
button {
  padding: 0.5em 1em;
}
</style>
