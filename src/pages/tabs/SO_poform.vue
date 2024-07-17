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
import { PDFDocument } from "pdf-lib";
import templateUrl from "@/assets/po-template.pdf";
import "@/pages/tabs/SO_poform.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebaseConfig"; // Ensure the correct path to your firebaseConfig file
import { doc, setDoc, updateDoc } from "firebase/firestore";
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
        stockNo: "",
        unit: "",
        description: "",
        quantity: "",
        unitCost: "",
        amount: "",
        totalAmount: "",
        totalAmountinWords: "",
      },
      fields: {
        supplier: "Supplier",
        address: "Address",
        tin: "TIN",
        poNo: "P.O No.",
        date: "Date",
        modeOfProcurement: "Mode of Procurement",
        stockNo: "Stock No.",
        unit: "Unit",
        description: "Description",
        quantity: "Quantity",
        unitCost: "Unit Cost",
        amount: "Amount",
        totalAmount: "Total Amount",
        totalAmountinWords: "Total Amount in Words",
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

      firstPage.drawText(formValues.supplier, { x: 65, y: 670, size: 10 });
      firstPage.drawText(formValues.address, { x: 65, y: 655, size: 10 });
      firstPage.drawText(formValues.tin, { x: 42, y: 640, size: 10 });
      firstPage.drawText(formValues.poNo, { x: 466, y: 670, size: 10 });
      firstPage.drawText(formValues.date, { x: 450, y: 655, size: 10 });
      firstPage.drawText(formValues.modeOfProcurement, {
        x: 523,
        y: 640,
        size: 10,
      });
      firstPage.drawText(formValues.stockNo, { x: 50, y: 510, size: 10 });
      firstPage.drawText(formValues.unit, { x: 110, y: 510, size: 10 });
      firstPage.drawText(formValues.description, { x: 150, y: 540, size: 10 });
      firstPage.drawText(formValues.quantity, { x: 435, y: 510, size: 10 });
      firstPage.drawText(formValues.unitCost, { x: 485, y: 510, size: 10 });
      firstPage.drawText(formValues.amount, { x: 545, y: 510, size: 10 });
      firstPage.drawText(formValues.totalAmount, { x: 539, y: 410, size: 10 });
      firstPage.drawText(formValues.totalAmountinWords, {
        x: 145,
        y: 396,
        size: 10,
      });
      firstPage.drawText(formValues.supplier, { x: 105, y: 275, size: 10 });

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
  },
  async created() {
    console.log("Component created");
    await this.fetchInitialPurchaseOrders();
    this.listenToPurchaseOrders();
  },
  watch: {
    purchaseOrders(newVal) {
      console.log("Purchase Orders updated:", newVal);
    },
  },
};
</script>

<style scoped src="./SO_poform.css"></style>
