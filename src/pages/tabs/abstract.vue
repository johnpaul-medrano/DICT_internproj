<template>
  <div class="abstract-main-content">
    <div class="abstract-form-container">
      <form @submit.prevent="generatePdf">
        <h2>Abstract</h2>

        <div class="up">
          <div class="abstract-grid-container">
            <!-- Static fields for particulars and controlNo -->
            <div class="first-row">
              <div class="input-cont">
                <label>Particulars:</label>
                <input id="particulars" v-model="form.particulars" required />
              </div>
              <div class="input-cont">
                <label>Control No.:</label>
                <input id="control" v-model="form.controlNo" required />
              </div>
            </div>

            <!-- Static fields for suppliers -->
            <div class="suppliers-cont">
              <div class="combi">
                <div class="input-cont">
                  <label>Supplier 1:</label>
                  <input v-model="form.supplier1" required />
                </div>
              </div>
              <div class="combi">
                <div class="input-cont">
                  <label>Supplier 2:</label>
                  <input v-model="form.supplier2" required />
                </div>
              </div>
              <div class="combi">
                <div class="input-cont">
                  <label>Supplier 3:</label>
                  <input v-model="form.supplier3" required />
                </div>
              </div>
            </div>
          </div>

          <!-- Dynamic fields for items -->
          <div
            v-for="(item, index) in form.items"
            :key="index"
            class="abstract-grid-item"
            :ref="'item' + index"
          >
            <div class="third-row">
              <div class="input-cont">
                <label>Item No.:</label>
                <input type="number" :value="index + 1" readonly />
              </div>
              <div class="input-cont">
                <label>Quantity:</label>
                <input type="number" v-model="item.qty" required />
              </div>
              <div class="input-cont">
                <label>Unit:</label>
                <input v-model="item.unit" required />
              </div>
            </div>

            <div class="input-cont">
              <label>Article/Service:</label>
              <input v-model="item.articleService" id="article" required />
            </div>
            <div class="combi1">
              <div class="input-cont">
                <label>Price 1:</label>
                <input type="number" v-model="item.price1" required />
              </div>
              <div class="input-cont">
                <label>Price 2:</label>
                <input type="number" v-model="item.price2" required />
              </div>
              <div class="input-cont">
                <label>Price 3:</label>
                <input type="number" v-model="item.price3" required />
              </div>
            </div>
            <div class="abstract-total-unit-cost">
              <label>Lowest Price Supplier:</label>
              <span>{{ getLowestPriceSupplier(item) }}</span>
            </div>

            <!-- Add Item button -->
            <div class="item-buttons">
              <button
                id="remove"
                type="button"
                @click="removeItem(index)"
                v-if="form.items.length > 1"
              >
                <img :src="remove" alt="" />
              </button>
              <button
                id="add"
                v-if="index === form.items.length - 1"
                type="button"
                @click="addItem"
              >
                <img :src="add" alt="" />
              </button>
            </div>
          </div>
        </div>

        <!-- Total Amount and Generate PDF button -->
        <div class="buttons">
          <button id="generate" type="submit">Generate PDF</button>
          <button id="upload" @click="uploadPDF">Upload PDF</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { PDFDocument, rgb } from "pdf-lib";
import pdfTemplate from "@/assets/abstract.pdf";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebaseConfig"; // Adjust path as per your setup
import add from "@/assets/add.png";
import remove from "@/assets/close.png";

export default {
  data() {
    return {
      add,
      remove,
      form: {
        particulars: "",
        controlNo: "",
        supplier1: "",
        supplier2: "",
        supplier3: "",
        items: [
          {
            qty: 1,
            unit: "piece",
            articleService: "",
            price1: 0,
            price2: 0,
            price3: 0,
          },
        ],
      },
    };
  },

  methods: {
    getLowestPriceSupplier(item) {
      const prices = [item.price1, item.price2, item.price3];
      const suppliers = [
        this.form.supplier1,
        this.form.supplier2,
        this.form.supplier3,
      ];
      const minPriceIndex = prices.indexOf(Math.min(...prices));
      return suppliers[minPriceIndex];
    },
    addItem() {
      this.form.items.push({
        qty: 1,
        unit: "piece",
        articleService: "",
        price1: 0,
        price2: 0,
        price3: 0,
      });
      this.$nextTick(() => {
        const newItemIndex = this.form.items.length - 1;
        const newItemRef = this.$refs[`item${newItemIndex}`];
        if (newItemRef && newItemRef[0]) {
          newItemRef[0].scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    },
    removeItem(index) {
      const itemElement = this.$refs[`item${index}`][0];
      if (itemElement) {
        itemElement.classList.add("collapsing");
        setTimeout(() => {
          this.form.items.splice(index, 1);
        }, 300);
      }
    },
    async generatePdf() {
      try {
        const response = await fetch(pdfTemplate);
        if (!response.ok) throw new Error("Failed to fetch PDF template");
        const existingPdfBytes = await response.arrayBuffer();
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        // Draw the form data onto the PDF
    firstPage.drawText(this.form.particulars, {
      x: 510,
      y: 510,
      size: 20,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(this.form.controlNo, {
      x: 80,
      y: 502,
      size: 10,
      color: rgb(0, 0, 0),
    });

    // Draw suppliers' information once
    firstPage.drawText(this.form.supplier1, {
      x: 610,
      y: 470,
      size: 10,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(this.form.supplier2, {
      x: 750,
      y: 470,
      size: 10,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(this.form.supplier3, {
      x: 900,
      y: 470,
      size: 10,
      color: rgb(0, 0, 0),
    });

    let yOffset = 430; // Base y-coordinate for the first item
    const yOffsetStep = 30; // Reduced vertical spacing between items

    let total1 = 0;
    let total2 = 0;
    let total3 = 0;

    this.form.items.forEach((item, index) => {
      if (yOffset < 0) {
        return;
      }
      
      // Draw item details
      firstPage.drawText(String(index + 1), {
        x: 30,
        y: yOffset,
        size: 10,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(String(item.qty), {
        x: 60,
        y: yOffset,
        size: 10,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(item.unit, {
        x: 95,
        y: yOffset,
        size: 10,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(item.articleService, {
        x: 150,
        y: yOffset,
        size: 10,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(String(item.price1), {
        x: 610,
        y: yOffset,
        size: 10,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(String(item.price2), {
        x: 750,
        y: yOffset,
        size: 10,
        color: rgb(0, 0, 0),
      });
      firstPage.drawText(String(item.price3), {
        x: 900,
        y: yOffset,
        size: 10,
        color: rgb(0, 0, 0),
      });

      // Calculate totals
      total1 += item.price1;
      total2 += item.price2;
      total3 += item.price3;

      yOffset -= yOffsetStep; // Move to the next item
    });

    // Calculate lowest total and corresponding supplier
    let lowestTotal = Math.min(total1, total2, total3);
    let lowestPriceSupplier = '';
    if (lowestTotal === total1) {
      lowestPriceSupplier = this.form.supplier1;
    } else if (lowestTotal === total2) {
      lowestPriceSupplier = this.form.supplier2;
    } else if (lowestTotal === total3) {
      lowestPriceSupplier = this.form.supplier3;
    }

    // Draw totals
    firstPage.drawText(`${total1}`, {
      x: 610,
      y: 335, // Adjust y-coordinate as needed
      size: 12,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`${total2}`, {
      x: 750,
      y: 335, // Adjust y-coordinate as needed
      size: 12,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(`${total3}`, {
      x: 900,
      y: 335, // Adjust y-coordinate as needed
      size: 12,
      color: rgb(0, 0, 0),
    });
    // Draw lowest price supplier
    firstPage.drawText(`${lowestPriceSupplier}`, {
      x: 50,
      y: 297, // Adjusted for lowest price supplier below totals
      size: 12,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
        this.pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
        this.fileName = `Abstract-${this.form.controlNo}-${Date.now()}.pdf`;
        

        alert("PDF generated successfully!");
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Error generating PDF");
      }
},

async uploadPDF() {
      if (!this.pdfBlob || !this.fileName) {
        alert("Please generate the PDF first.");
        return;
      }

      try {
        const storageRef = ref(storage, `abstractForms/${this.fileName}`);
        await uploadBytes(storageRef, this.pdfBlob);
        const downloadURL = await getDownloadURL(storageRef);
        console.log("PDF uploaded successfully. Download URL:", downloadURL);
        window.open(downloadURL);
        alert("PDF uploaded successfully!");
      } catch (error) {
        console.error("Error uploading PDF:", error);
        alert("Error uploading PDF");
      }
    },
  },
};
</script>

<style scoped src="./abstract.css"></style>