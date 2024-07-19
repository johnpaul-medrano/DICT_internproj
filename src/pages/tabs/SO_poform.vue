<template>
  <div class="main-content">
    <div class="purchase-request-form">
      <h2>PURCHASE ORDER</h2>
      <form @submit.prevent="handlePOFORMSubmit">
        <div class="grid-container">
          <!-- Original fields from SO_poform.vue -->
          <div class="left">
            <div class="prnum-container">
              <div class="cont">
                <label for="supplier">Supplier:</label>
                <input type="text" id="supplier" v-model="form.supplier" required />
              </div>
              <div class="cont">
                <label for="date">Date:</label>
                <DatePicker v-model="form.date" format="YYYY-MM-DD" />
              </div>
            </div>
            <div class="prnum-container">
              <div class="cont">
                <label for="address">Address:</label>
                <input type="text" id="address" v-model="form.address" required />
              </div>
            </div>
            <div class="prnum3-container">
              <div class="cont">
                <label for="tin">TIN:</label>
                <input type="text" id="tin" v-model="form.tin" required />
              </div>
              <div class="cont">
                <label for="poNo">P.O. No.:</label>
                <input type="text" id="poNo" v-model="form.poNo" required />
              </div>
              <div class="cont">
                <label for="modeOfProcurement">Mode of Procurement:</label>
                <input type="text" id="modeOfProcurement" v-model="form.modeOfProcurement" required />
              </div>
            </div>
          </div>

          <!-- Items section similar to prform.vue -->
          <div
            v-for="(item, index) in form.items"
            :key="`item-${index}`"
            :ref="'item' + index"
            class="grid-item"
          >
            <div class="first-row">
              <div class="cont">
                <label :for="'stockNo' + index">Stock No.:</label>
                <input
                  type="text"
                  :id="'stockNo' + index"
                  v-model="item.stockNo"
                  required
                />
              </div>
              <div class="cont">
                <label :for="'unit' + index">Unit:</label>
                <input
                  placeholder="Pieces / Set"
                  type="text"
                  :id="'unit' + index"
                  v-model="item.unit"
                  required
                />
              </div>
            </div>
            <div class="second-row">
              <div class="cont">
                <label :for="'description' + index">Description:</label>
                <input
                  id="description_input"
                  type="text"
                  :id="'description' + index"
                  v-model="item.description"
                  required
                />
              </div>
              <div class="abstract-item-buttons">
                <button
                  id="remove"
                  type="button"
                  @click="removeItem(index)"
                  v-if="form.items.length > 1"
                >
                  <img :src="remove" alt="Remove" />
                </button>
                <button
                  id="add"
                  type="button"
                  @click="addItem"
                  v-if="index === form.items.length - 1"
                >
                  <img :src="add" alt="Add" />
                </button>
              </div>
            </div>
            <div class="third-row">
              <div class="cont">
                <label :for="'quantity' + index">Quantity:</label>
                <input
                  type="number"
                  :id="'quantity' + index"
                  v-model="item.quantity"
                  @input="updateAmount(index)"
                  required
                />
              </div>
              <div class="cont">
                <label :for="'unitCost' + index">Unit Cost:</label>
                <input
                  type="number"
                  :id="'unitCost' + index"
                  v-model="item.unitCost"
                  @input="updateAmount(index)"
                  required
                />
              </div>
            </div>
            <div class="total-amount">
              <label :for="'amount' + index">Amount:</label>
              <span :id="'amount' + index">{{ item.amount }}</span>
            </div>
          </div>
        </div>

        <button id="generate" type="submit">Generate PDF</button>
      </form>
    </div>
  </div>
</template>

<script>
import DatePicker from 'vue3-datepicker';
import add from "@/assets/add.png";
import remove from "@/assets/close.png";
import { PDFDocument, rgb } from "pdf-lib";
import pdfTemplate from "@/assets/abstract.pdf";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebaseConfig";
import { collection, addDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { mapState, mapActions } from "vuex";
import "@/pages/tabs/SO_poform.css";

export default {
  components: {
    DatePicker,
  },
  data() {
    return {
      add,
      remove,
      form: {
        date: '',
        supplier: "",
        address: "",
        tin: "",
        poNo: "",
        modeOfProcurement: "",
        items: [
          {
            stockNo: "",
            unit: "",
            description: "",
            quantity: 0,
            unitCost: 0,
            amount: 0,
          },
        ],
        totalAmount: 0,
      },
    };
  },
  computed: {
    ...mapState({
      purchaseOrders: (state) => state.purchaseOrders,
    }),
  },
  methods: {
    updateTotalAmount() {
      this.form.totalAmount = this.form.items.reduce(
        (total, item) => total + item.amount,
        0
      );
    },
    async generatePDF(docRef) {
      try{
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


      // Adjust text placement as per your PDF template
      firstPage.drawText(formValues.supplier, { x: 65, y: 670, size: 10 });
      firstPage.drawText(formValues.address, { x: 65, y: 655, size: 10 });
      firstPage.drawText(formValues.tin, { x: 42, y: 640, size: 10 });
      firstPage.drawText(formValues.poNo, { x: 466, y: 670, size: 10 });
      firstPage.drawText(formValues.date, { x: 450, y: 655, size: 10 });
      firstPage.drawText(formValues.modeOfProcurement, { x: 523, y: 640, size: 10 });

      let yOffset = 510;
      const rowHeight = 12;

      formValues.items.forEach((item) => {
        if (yOffset < 100) {
          yOffset = 510;
        }

        firstPage.drawText(item.stockNo, { x: 50, y: yOffset, size: 10 });
        firstPage.drawText(item.unit, { x: 110, y: yOffset, size: 10 });
        firstPage.drawText(item.description, { x: 150, y: yOffset + 30, size: 10 });
        firstPage.drawText(item.quantity.toString(), { x: 435, y: yOffset, size: 10 });
        firstPage.drawText(item.unitCost.toString(), { x: 485, y: yOffset, size: 10 });
        firstPage.drawText(item.amount.toString(), { x: 545, y: yOffset, size: 10 });

        yOffset -= rowHeight;
      });

      firstPage.drawText(formValues.totalAmount.toString(), { x: 539, y: 410, size: 10 });

        console.log("Saving the modified PDF...");
        const pdfBytes = await pdfDoc.save();
        console.log("PDF document saved successfully");

        // Upload PDF to Firebase Storage
        const storageRef = ref(storage, `purchase_orders/${docRef.id}.pdf`);
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
        a.download = `purchase_orders_${docRef.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up the URL object

      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    },
    async handlePOFORMSubmit() {
      try {
        // Save particulars, controlNo
        const docRef = await addDoc(collection(db, "purchase_orders"), {
          poNo: this.form.poNo,
          date: this.form.date,
          supplier: this.form.supplier,
          totalAmount: this.form.totalAmount,
          status: "Pending for Supplier's Signature",
        });

        // Generate and upload PDF
        await this.generatePDF(docRef);

        // Reset form fields if needed
        this.resetForm();
      } catch (error) {
        console.error("Error handling form submission:", error);
      }
    },
    resetForm() {
      this.form = {
        date: '',
        supplier: "",
        address: "",
        tin: "",
        poNo: "",
        modeOfProcurement: "",
        items: [
          {
            stockNo: "",
            unit: "",
            description: "",
            quantity: 0,
            unitCost: 0,
            amount: 0,
          },
        ],
        totalAmount: 0,
      };
    },
    addItem() {
      this.form.items.push({
        stockNo: "",
        unit: "",
        description: "",
        quantity: 0,
        unitCost: 0,
        amount: 0,
      });
    },
    removeItem(index) {
      this.form.items.splice(index, 1);
      this.updateTotalAmount();
    },
    updateAmount(index) {
      const item = this.form.items[index];
      item.amount = item.quantity * item.unitCost;
      this.updateTotalAmount();
    },

  },
};
</script>

<style scoped src="./SO_poform.css"></style>
