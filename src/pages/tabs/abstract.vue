<template>
  <div>
    <div class="abstract-main-content">
      <div class="abstract-form-container">
        <form @submit.prevent="handleAbstractFormSubmit">
          <h2>ABSTRACT FORM</h2>

          <div class="abstract-grid-container">
            <!-- Static fields for particulars and controlNo -->
            <div class="first-row">
              <div class="input-cont">
                <label>Particulars:</label>
                <input id="particulars" v-model="form.particulars" required />
              </div>
              <div class="input-cont">
                <label>Control No.:</label>
                <input v-model="form.controlNo" required />
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

            <!-- Dynamic fields for items -->
            <div v-for="(item, index) in form.items" :key="index" class="abstract-grid-item">
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
              <div class="combi">
                <div class="input-cont">
                  <label>Price 1:</label>
                  <input type="number" v-model="item.price1" required />
                </div>
                <div class="combi">
                  <div class="input-cont">
                    <label>Supplier 2:</label>
                    <input v-model="item.supplier2" required />
                  </div>
                  <div class="input-cont">
                    <label>Price 2:</label>
                    <input type="number" v-model="item.price2" required />
                  </div>
                </div>
                <div class="combi">
                  <div class="input-cont">
                    <label>Supplier 3:</label>
                    <input v-model="item.supplier3" required />
                  </div>
                  <div class="input-cont">
                    <label>Price 3:</label>
                    <input type="number" v-model="item.price3" required />
                  </div>
                </div>
              </div>
              <div class="abstract-total-unit-cost">
                <label>Lowest Price Supplier:</label>
                <span>{{ getLowestPriceSupplier(item) }}</span>
              </div>
            </div>

            <!-- Add Item button -->
            <div>
              <button type="button" @click="addItem">Add Item</button>
            </div>
          </div>

          <!-- Total Amount and Generate PDF button -->
          <button id="generate" type="submit">Generate PDF</button>
          <button @click="uploadPDF">Upload PDF</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { PDFDocument, rgb } from "pdf-lib";
import pdfTemplate from "@/assets/abstract.pdf"; // Ensure your template is in the assets folder
import { storage, db } from "@/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";

export default {
  data() {
    return {
      particulars: "",
      controlNo: "",
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
        let yOffset = 400;
        const yOffsetStep = 20;

        // Draw the form data onto the PDF
        this.form.items.forEach((item, index) => {
          console.log(`Processing item ${index + 1}`);
          if (yOffset < 0) {
            console.warn(
              `yOffset=${yOffset} is out of bounds, skipping item ${index + 1}`
            );
            return;
          }

          // Draw the form data
          firstPage.drawText(this.particulars, {x: 510,y: 510,size: 20,color: rgb(0, 0, 0), });
          firstPage.drawText(this.controlNo, {x: 80,y: 502,size: 10,color: rgb(0, 0, 0), });
          firstPage.drawText(String(item.itemNo), {x: 30,y: 435,size: 10,color: rgb(0, 0, 0),});
          firstPage.drawText(String(item.qty), { x: 60, y: 435, size: 10, color: rgb(0, 0, 0),  });
          firstPage.drawText(item.unit, {x: 95, y: 435, size: 10, color: rgb(0, 0, 0),  });
          firstPage.drawText(item.articleService, {x: 150,y: 435,size: 10,color: rgb(0, 0, 0), });
          firstPage.drawText(item.supplier1, {x: 610,y: 470, size: 10, color: rgb(0, 0, 0),});
          firstPage.drawText(item.supplier2, { x: 750, y: 470, size: 10, color: rgb(0, 0, 0), });
          firstPage.drawText(item.supplier3, { x: 900, y: 470, size: 10, color: rgb(0, 0, 0), });
          firstPage.drawText(String(item.price1), { x: 610, y: 435, size: 10, color: rgb(0, 0, 0), });
          firstPage.drawText(String(item.price2), {x: 750, y: 435, size: 10, color: rgb(0, 0, 0),  });
          firstPage.drawText(String(item.price3), {x: 900, y: 435, size: 10, color: rgb(0, 0, 0),
          });

          // Draw the lowest price supplier
          const lowestPriceSupplier = this.getLowestPriceSupplier(item);
          firstPage.drawText(`${lowestPriceSupplier}`, {
            x: 50,
            y: 297,
            size: 12,
            color: rgb(0, 0, 0),
          });

          yOffset -= yOffsetStep; // Move to the next row
          console.log(`Item ${index + 1} drawn at y=${yOffset}`);
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

        // Create a Blob and open the new PDF in a new window
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        console.log("Opening the PDF in a new window...");
        window.open(url);
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    },
    async handleAbstractFormSubmit() {
      try {
        // Save particulars, controlNo
        const docRef = await addDoc(collection(db, "abstractForms"), {
          particulars: this.particulars,
          controlNo: this.controlNo,
          timestamp: serverTimestamp(),
        });

        // Generate and upload PDF
        await this.generatePdf(docRef);

        // Reset form fields if needed
        this.particulars = "";
        this.controlNo = "";
        this.form.items.forEach(item => {
          item.itemNo = 1;
          item.qty = 1;
          item.unit = "piece";
          item.articleService = "";
          item.supplier1 = "";
          item.supplier2 = "";
          item.supplier3 = "";
          item.price1 = 0;
          item.price2 = 0;
          item.price3 = 0;
        });
      } catch (error) {
        console.error("Error handling form submission:", error);
      }
    },
  },
};
</script>

<style scoped src="../tabs/abstract.css"></style>
