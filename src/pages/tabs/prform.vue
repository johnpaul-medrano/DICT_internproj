<template>
  <div class="main-content">
    <div class="purchase-request-form">
      <h2>Create Purchase Request</h2>
      <form @submit.prevent="handleSubmit">
        <div class="grid-container">
          <div class="grid-item">
            <label for="prnum">PR Number:</label>
            <input type="text" id="prnum" v-model="form.prnum" required />
          </div>
          <div
            v-for="(item, index) in form.items"
            :key="index"
            class="grid-item"
          >
            <label :for="'stock' + index">Stock No.:</label>
            <input
              type="text"
              :id="'stock' + index"
              v-model="item.stock"
              required
            />

            <label :for="'unit' + index">Unit:</label>
            <input
              type="text"
              :id="'unit' + index"
              v-model="item.unit"
              required
            />

            <label :for="'itemdesc' + index">Item Description:</label>
            <input
              type="text"
              :id="'itemdesc' + index"
              v-model="item.itemdesc"
              required
            />

            <label :for="'quantity' + index">Quantity:</label>
            <input
              type="number"
              :id="'quantity' + index"
              v-model="item.quantity"
              required
            />

            <label :for="'unitcost' + index">Unit Cost:</label>
            <input
              type="number"
              :id="'unitcost' + index"
              v-model="item.unitcost"
              required
            />

            <label :for="'totalunitcost' + index">Total Unit Cost:</label>
            <input
              type="number"
              :id="'totalunitcost' + index"
              v-model="item.totalunitcost"
              required
            />

            <button type="button" @click="removeItem(index)">Remove</button>
          </div>
          <button type="button" @click="addItem">Add Item</button>
        </div>

        <button type="submit">Generate PDF</button>
      </form>
    </div>
  </div>
</template>

<script>
import { PDFDocument, rgb } from "pdf-lib";
import prTemplate from "@/assets/pr-template.pdf";

export default {
  data() {
    return {
      add,
      remove,
      form: {
        prnum: "",
        items: [
          {
            stock: "",
            unit: "",
            itemdesc: "",
            quantity: "",
            unitcost: "",
            totalunitcost: "",
          },
        ],
      },
    };
  },
  computed: {
    totalAmount() {
      return this.form.items.reduce(
        (sum, item) => sum + item.quantity * item.unitcost,
        0
      );
    },
  },
  methods: {
    addItem() {
      this.form.items.push({
        stock: "",
        unit: "",
        itemdesc: "",
        quantity: "",
        unitcost: "",
        totalunitcost: "",
      });
    },
    removeItem(index) {
      this.form.items.splice(index, 1);
    },
    async handleSubmit() {
      try {
        const existingPdfBytes = await fetch(prTemplate).then((res) =>
          res.arrayBuffer()
        );
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        firstPage.drawText(this.form.prnum, {
          x: 300,
          y: 670,
          size: 10,
          color: rgb(0, 0, 0),
        });

        let yOffset = 615;
        const rowHeight = 12;

        this.form.items.forEach((item, index) => {
          // Ensure yOffset doesn't go off the page
          if (yOffset < 100) {
            yOffset = 615;
            // Add logic to create a new page if necessary
          }

          firstPage.drawText(item.stock, {
            x: 60,
            y: yOffset,
            size: 10,
            color: rgb(0, 0, 0),
          });
          firstPage.drawText(item.unit, {
            x: 115,
            y: yOffset,
            size: 10,
            color: rgb(0, 0, 0),
          });
          firstPage.drawText(item.itemdesc, {
            x: 152,
            y: yOffset,
            size: 10,
            color: rgb(0, 0, 0),
          });
          firstPage.drawText(item.quantity.toString(), {
            x: 378,
            y: yOffset,
            size: 10,
            color: rgb(0, 0, 0),
          });
          firstPage.drawText(item.unitcost.toString(), {
            x: 430,
            y: yOffset,
            size: 10,
            color: rgb(0, 0, 0),
          });
          firstPage.drawText(item.totalunitcost.toString(), {
            x: 480,
            y: yOffset,
            size: 10,
            color: rgb(0, 0, 0),
          });

          yOffset -= rowHeight;
        });

        const pdfBytes = await pdfDoc.save();

        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "filled_pr.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Reset the form
        this.resetForm();
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    },
    resetForm() {
      this.form = {
        prnum: "",
        items: [
          {
            stock: "",
            unit: "",
            itemdesc: "",
            quantity: "",
            unitcost: "",
            totalunitcost: "",
          },
        ],
      };
    },
  },
};
</script>

<style scoped>
.main-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
}

.purchase-request-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  grid-gap: 10px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.grid-item label {
  margin-bottom: 5px;
}
</style>
