<template>
  <div class="main-content">
    <div class="purchase-request-form">
      <h2>Create Purchase Order </h2>
      <form @submit.prevent="generatePDF">
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
                <input type="text" id="date" v-model="form.date" required />
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
                  type="text"
                  :id="'unit' + index"
                  v-model="item.unit"
                  required
                />
              </div>
            </div>

            <label :for="'description' + index">Description:</label>
            <input
              type="text"
              :id="'description' + index"
              v-model="item.description"
              required
            />
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
import { PDFDocument } from "pdf-lib";
import templateUrl from "@/assets/po-template.pdf";
import "@/pages/tabs/SO_poform.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      form: {
        supplier: "",
        address: "",
        tin: "",
        poNo: "",
        date: "",
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
    ...mapActions(["fetchInitialPurchaseOrders", "listenToPurchaseOrders"]),
    async generatePDF() {
      const formValues = this.form;
      const existingPdfBytes = await fetch(templateUrl).then((res) =>
        res.arrayBuffer()
      );

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

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

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const fileName = `PO-${formValues.poNo}-${new Date().getTime()}.pdf`;

      // Upload the PDF to Firebase Storage
      await this.uploadPDFToFirebase(blob, fileName, formValues);
    },
    async uploadPDFToFirebase(blob, fileName, formValues) {
      try {
        const storageRef = ref(storage, `purchase_orders/${fileName}`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        console.log("PDF uploaded successfully. Download URL:", downloadURL);

        // Store the details in Firestore
        await setDoc(doc(db, "purchase_orders", fileName), {
          poNo: formValues.poNo,
          date: formValues.date,
          supplier: formValues.supplier,
          totalAmount: formValues.totalAmount,
          status: "Pending for Supplier's Signature",
          downloadURL: downloadURL,
        });

        alert("PDF uploaded and details saved successfully");
      } catch (error) {
        console.error("Error uploading PDF:", error);
        alert("Error uploading PDF");
      }
    },
    async updateStatus(po) {
      console.log("Updating status for PO:", po);
      const poDocRef = doc(db, "purchase_orders", po.id);
      await updateDoc(poDocRef, { status: po.status });
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
    updateTotalAmount() {
      this.form.totalAmount = this.form.items.reduce(
        (total, item) => total + item.amount,
        0
      );
    },
  },
  async created() {
    console.log("Component created");
    await this.fetchInitialPurchaseOrders();
    this.listenToPurchaseOrders();
  },
};
</script>

<style scoped src="./SO_poform.css"></style>