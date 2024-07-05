<template>
  <div class="purchase-request-form">
    <h2>Create Purchase Request</h2>
    <form @submit.prevent="handleSubmit">
      <div class="grid-container">
        <div class="grid-item">
          <label for="prnum">PR Number:</label>
          <input type="text" id="prnum" v-model="form.prnum" required />
        </div>
        <div v-for="(item, index) in form.items" :key="index" class="grid-item">
          <label :for="'stock' + index">Stock No.:</label>
          <input type="text" :id="'stock' + index" v-model="item.stock" required />

          <label :for="'unit' + index">Unit:</label>
          <input type="text" :id="'unit' + index" v-model="item.unit" required />

          <label :for="'itemdesc' + index">Item Description:</label>
          <input type="text" :id="'itemdesc' + index" v-model="item.itemdesc" required />

          <label :for="'quantity' + index">Quantity:</label>
          <input type="number" :id="'quantity' + index" v-model="item.quantity" required />

          <label :for="'unitcost' + index">Unit Cost:</label>
          <input type="number" :id="'unitcost' + index" v-model="item.unitcost" required />

          <label :for="'totalunitcost' + index">Total Unit Cost:</label>
          <span :id="'totalunitcost' + index">{{ item.quantity * item.unitcost }}</span>

          <button class="remove-btn" type="button" @click="removeItem(index)">Remove</button>
        </div>
        <button class="add-btn" type="button" @click="addItem">Add Item</button>
      </div>

      <button class="submit-btn" type="submit">Generate PDF</button>
    </form>
  </div>
</template>

<script>
import { PDFDocument, rgb } from 'pdf-lib';
import prTemplate from '@/assets/pr-template.pdf'; // Adjust path if necessary

export default {
  data() {
    return {
      form: {
        prnum: '',
        items: [
          {
            stock: '',
            unit: '',
            itemdesc: '',
            quantity: 0,
            unitcost: 0,
          }
        ],
      }
    };
  },
  computed: {
    totalAmount() {
      return this.form.items.reduce((sum, item) => sum + (item.quantity * item.unitcost), 0);
    }
  },
  methods: {
    addItem() {
      this.form.items.push({
        stock: '',
        unit: '',
        itemdesc: '',
        quantity: 0,
        unitcost: 0,
      });
    },
    removeItem(index) {
      this.form.items.splice(index, 1);
    },
    async handleSubmit() {
      try {
        // Load the PDF template
        const existingPdfBytes = await fetch(prTemplate).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        // Customize PDF fields (adjust coordinates as necessary)
        firstPage.drawText(this.form.prnum, { x: 300, y: 670, size: 10, color: rgb(0, 0, 0) });

        // Initial y-coordinate for the first item
        let yOffset = 615;
        const rowHeight = 12;

        this.form.items.forEach((item, index) => {
          // Ensure yOffset doesn't go off the page
          if (yOffset < 100) {
            yOffset = 615;
            // Add logic to create a new page if necessary
          }

          firstPage.drawText(item.stock, { x: 60, y: yOffset, size: 10, color: rgb(0, 0, 0) });
          firstPage.drawText(item.unit, { x: 115, y: yOffset, size: 10, color: rgb(0, 0, 0) });
          firstPage.drawText(item.itemdesc, { x: 152, y: yOffset, size: 10, color: rgb(0, 0, 0) });
          firstPage.drawText(item.quantity.toString(), { x: 378, y: yOffset, size: 10, color: rgb(0, 0, 0) });
          firstPage.drawText(item.unitcost.toString(), { x: 430, y: yOffset, size: 10, color: rgb(0, 0, 0) });
          firstPage.drawText((item.quantity * item.unitcost).toString(), { x: 480, y: yOffset, size: 10, color: rgb(0, 0, 0) });

          // Decrease yOffset for the next item
          yOffset -= rowHeight;
        });

        // Draw the total amount
        firstPage.drawText(`Total Amount: ${this.totalAmount}`, { x: 400, y: 100, size: 12, color: rgb(0, 0, 0) });

        // Serialize the PDFDocument to bytes
        const pdfBytes = await pdfDoc.save();

        // Create a Blob from the PDFBytes and create a URL for it
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        // Create a link element, set the URL as the href, and click it to download the file
        const link = document.createElement('a');
        link.href = url;
        link.download = 'filled_pr.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Reset the form
        this.resetForm();
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    },
    resetForm() {
      this.form = {
        prnum: '',
        items: [
          {
            stock: '',
            unit: '',
            itemdesc: '',
            quantity: 0,
            unitcost: 0,
          }
        ],
      };
    }
  }
};
</script>


<style scope src="./prform.css"></style>