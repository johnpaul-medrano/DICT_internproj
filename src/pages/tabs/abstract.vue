<template>
  <div>
    <div class="abstract-main-content">
      <div class="abstract-form-container">
        <form @submit.prevent="handleAbstractFormSubmit">
          <h2>ABSTRACT FORM</h2>

          <div class="abstract-grid-container">
            <div class="first-row">
              <div class="input-cont">
                <label> Particulars:</label>
                <input id="particulars" v-model="form.particulars" required />
              </div>
              <div class="input-cont">
                <label> Control No.:</label>
                <input v-model="form.controlNo" required />
              </div>
            </div>
            <div
              v-for="(item, index) in form.items"
              :key="index"
              class="abstract-grid-item"
            >
              <div class="third-row">
                <div class="input-cont">
                  <label> Item No.:</label>
                  <input type="number" :value="index + 1" readonly />
                </div>
                <div class="input-cont">
                  <label> Quantity:</label>
                  <input type="number" v-model="item.qty" required />
                </div>
                <div class="input-cont">
                  <label> Unit:</label>
                  <input v-model="item.unit" required />
                </div>
              </div>

              <div class="input-cont">
                <label> Article/Service:</label>
                <input v-model="item.articleService" id="article" required />
              </div>
              <div class="suppliers-cont">
                <div class="combi">
                  <div class="input-cont">
                    <label>Supplier 1:</label>
                    <input v-model="form.supplier1" required />
                  </div>
                  <div class="input-cont">
                    <label>Price 1:</label>
                    <input id="price" type="number" v-model="item.price1" required />
                  </div>
                </div>
                <div class="combi">
                  <div class="input-cont">
                    <label>Supplier 2:</label>
                    <input v-model="form.supplier2" required />
                  </div>
                  <div class="input-cont">
                    <label>Price 2:</label>
                    <input id="price" type="number" v-model="item.price2" required />
                  </div>
                </div>
                <div class="combi">
                  <div class="input-cont">
                    <label>Supplier 3:</label>
                    <input v-model="form.supplier3" required />
                  </div>
                  <div class="input-cont">
                    <label>Price 3:</label>
                    <input id="price" type="number" v-model="item.price3" required />
                  </div>
                </div>
                <div class="abstract-item-buttons">
                  <button id="remove" type="button" @click="removeItem(index)" v-if="form.items.length > 1">
                    <img :src="remove" alt="" />
                  </button>
                  <button id="add" v-if="index === form.items.length - 1" type="button" @click="addItem">
                    <img :src="add" alt="" />
                  </button>
                </div>
              </div>
              <div class="abstract-total-unit-cost">
                <label>Lowest Price Supplier:</label>
                <span>{{ getLowestPriceSupplier(item) }}</span>
              </div>
            </div>
          </div>
          <div class="abstract-total-amount">
            <label>Total Amount:</label>
            <span>{{ totalAmount }}</span>
          </div>
          <button id="generate" type="submit">Generate PDF</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import add from "@/assets/add.png";
import remove from "@/assets/close.png";
import { PDFDocument, rgb } from "pdf-lib";
import pdfTemplate from "@/assets/abstract.pdf"; // Ensure your template is in the assets folder
import { storage, db } from "@/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";

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
            itemNo: 1,
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
      const suppliers = [this.form.supplier1, this.form.supplier2, this.form.supplier3];
      const minPriceIndex = prices.indexOf(Math.min(...prices));
      return suppliers[minPriceIndex];
    },
    async generatePdf(docRef) {
      try {
        console.log("Fetching the PDF template...");
        const response = await fetch(pdfTemplate);
        if (!response.ok) throw new Error("Failed to fetch PDF template");
        const existingPdfBytes = await response.arrayBuffer();
        console.log("PDF template fetched successfully");

        console.log("Loading the existing PDF...");
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        console.log("PDF document loaded successfully");

        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();
        console.log(`Page size: width=${width}, height=${height}`);

        // Initial y-coordinate and step size for each row
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

          total1 += item.price1;
          total2 += item.price2;
          total3 += item.price3;

          yOffset -= yOffsetStep; // Move to the next row
        });

        // Calculate lowest total and corresponding supplier
        let lowestTotal = Math.min(total1, total2, total3);
        let lowestPriceSupplier = "";
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
          y: 335,
          size: 12,
          color: rgb(0, 0, 0),
        });
        firstPage.drawText(`${total2}`, {
          x: 750,
          y: 335,
          size: 12,
          color: rgb(0, 0, 0),
        });
        firstPage.drawText(`${total3}`, {
          x: 900,
          y: 335,
          size: 12,
          color: rgb(0, 0, 0),
        });
        firstPage.drawText(`${lowestPriceSupplier}`, {
          x: 50,
          y: 297,
          size: 12,
          color: rgb(0, 0, 0),
        });

        console.log("Saving the modified PDF...");
        const pdfBytes = await pdfDoc.save();
        console.log("PDF document saved successfully");

        // Upload PDF to Firebase Storage
        const storageRef = ref(storage, `abstractForms/${docRef.id}.pdf`);
        await uploadBytes(storageRef, pdfBytes);
        console.log("PDF uploaded successfully");

        // Get download URL of uploaded PDF
        const downloadURL = await getDownloadURL(storageRef);
        console.log("PDF download URL:", downloadURL);

        // Update database with download URL
        await updateDoc(docRef, {
          pdfUrl: downloadURL,
        });
        console.log("PDF URL saved to database");

        // Create a Blob and trigger a download
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `abstractForm_${docRef.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up the URL object

      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    },
    async handleAbstractFormSubmit() {
      try {
        // Save particulars, controlNo
        const docRef = await addDoc(collection(db, "abstractForms"), {
          particulars: this.form.particulars,
          controlNo: this.form.controlNo,
          timestamp: serverTimestamp(),
        });

        // Generate and upload PDF
        await this.generatePdf(docRef);

        // Reset form fields if needed
        this.resetForm();
      } catch (error) {
        console.error("Error handling form submission:", error);
      }
    },
    resetForm() {
      this.form.particulars = "";
      this.form.controlNo = "";
      this.form.items = [
        {
          itemNo: 1,
          qty: 1,
          unit: "piece",
          articleService: "",
          price1: 0,
          price2: 0,
          price3: 0,
        },
      ];
      this.form.supplier1 = "";
      this.form.supplier2 = "";
      this.form.supplier3 = "";
    },
    addItem() {
      this.form.items.push({
        itemNo: this.form.items.length + 1,
        qty: null,
        unit: "",
        articleService: "",
        price1: 0,
        price2: 0,
        price3: 0,
      });
    },
    removeItem(index) {
      this.form.items.splice(index, 1);
    },
  },
};
</script>

<style scoped src="../tabs/abstract.css"></style>
