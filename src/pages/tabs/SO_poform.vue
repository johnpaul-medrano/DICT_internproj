<template>
  <div>
    <form @submit.prevent="generatePDF" class="purchase-request-form">
      <div class="grid-item">
        <label for="supplier">Supplier:</label>
        <input type="text" id="supplier" v-model="form.supplier" />
      </div>
      <div class="grid-item">
        <label for="address">Address:</label>
        <input type="text" id="address" v-model="form.address" />
      </div>
      <div class="grid-item">
        <label for="tin">TIN:</label>
        <input type="text" id="tin" v-model="form.tin" />
      </div>
      <div class="grid-item">
        <label for="poNo">P.O No.:</label>
        <input type="text" id="poNo" v-model="form.poNo" />
      </div>
      <div class="grid-item">
        <label for="date">Date:</label>
        <input type="text" id="date" v-model="form.date" />
      </div>
      <div class="grid-item">
        <label for="modeOfProcurement">Mode of Procurement:</label>
        <input type="text" id="modeOfProcurement" v-model="form.modeOfProcurement" />
      </div>
      <div class="grid-item">
        <label for="stockNo">Stock No.:</label>
        <input type="text" id="stockNo" v-model="form.stockNo" />
      </div>
      <div class="grid-item">
        <label for="unit">Unit:</label>
        <input type="text" id="unit" v-model="form.unit" />
      </div>
      <div class="grid-item">
        <label for="description">Description:</label>
        <input type="text" id="description" v-model="form.description" />
      </div>
      <div class="grid-item">
        <label for="quantity">Quantity:</label>
        <input type="text" id="quantity" v-model="form.quantity" />
      </div>
      <div class="grid-item">
        <label for="unitCost">Unit Cost:</label>
        <input type="text" id="unitCost" v-model="form.unitCost" />
      </div>
      <div class="grid-item">
        <label for="amount">Amount:</label>
        <input type="text" id="amount" v-model="form.amount" />
      </div>
      <div class="grid-item">
        <label for="totalAmount">Total Amount:</label>
        <input type="text" id="totalAmount" v-model="form.totalAmount" />
      </div>
      <div class="grid-item">
        <label for="totalAmountinWords">Total Amount in Words:</label>
        <input type="text" id="totalAmountinWords" v-model="form.totalAmountinWords" />
      </div>
      <button type="submit" id="generate">Generate PDF</button>
    </form>
  </div>
</template>

<script>
import { PDFDocument } from 'pdf-lib';
import templateUrl from '@/assets/po-template.pdf';
import '@/pages/tabs/SO_poform.css';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebaseConfig"; // Ensure the correct path to your firebaseConfig file
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { mapState, mapActions } from 'vuex';

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
  computed: {
    ...mapState({
      purchaseOrders: state => state.purchaseOrders
    })
  },
  methods: {
    ...mapActions(['fetchInitialPurchaseOrders', 'listenToPurchaseOrders']),
    async generatePDF() {
      const formValues = this.form;
      const existingPdfBytes = await fetch(templateUrl).then(res => res.arrayBuffer());

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      firstPage.drawText(formValues.supplier, { x: 65, y: 670, size: 10 });
      firstPage.drawText(formValues.address, { x: 65, y: 655, size: 10 });
      firstPage.drawText(formValues.tin, { x: 42, y: 640, size: 10 });
      firstPage.drawText(formValues.poNo, { x: 466, y: 670, size: 10 });
      firstPage.drawText(formValues.date, { x: 450, y: 655, size: 10 });
      firstPage.drawText(formValues.modeOfProcurement, { x: 523, y: 640, size: 10 });
      firstPage.drawText(formValues.stockNo, { x: 50, y: 510, size: 10 });
      firstPage.drawText(formValues.unit, { x: 110, y: 510, size: 10 });
      firstPage.drawText(formValues.description, { x: 150, y: 540, size: 10 });
      firstPage.drawText(formValues.quantity, { x: 435, y: 510, size: 10 });
      firstPage.drawText(formValues.unitCost, { x: 485, y: 510, size: 10 });
      firstPage.drawText(formValues.amount, { x: 545, y: 510, size: 10 });
      firstPage.drawText(formValues.totalAmount, { x: 539, y: 410, size: 10 });
      firstPage.drawText(formValues.totalAmountinWords, { x: 145, y: 396, size: 10 });
      firstPage.drawText(formValues.supplier, { x: 110, y: 275, size: 10 });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const fileName = `PO-${formValues.poNo}-${new Date().getTime()}.pdf`;

      // Upload the PDF to Firebase Storage
      await this.uploadPDFToFirebase(blob, fileName, formValues);
    },
    async uploadPDFToFirebase(blob, fileName, formValues) {
      try {
        const storageRef = ref(storage, `purchase_orders/${fileName}`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        console.log('PDF uploaded successfully. Download URL:', downloadURL);

        // Store the details in Firestore
        await setDoc(doc(db, "purchase_orders", fileName), {
          poNo: formValues.poNo,
          date: formValues.date,
          supplier: formValues.supplier,
          totalAmount: formValues.totalAmount,
          status: 'Pending for Supplier\'s Signature',
          downloadURL: downloadURL
        });

        alert('PDF uploaded and details saved successfully');
      } catch (error) {
        console.error('Error uploading PDF:', error);
        alert('Error uploading PDF');
      }
    },
    async updateStatus(po) {
      console.log('Updating status for PO:', po);
      const poDocRef = doc(db, "purchase_orders", po.id);
      await updateDoc(poDocRef, { status: po.status });
    }
  },
  async created() {
    console.log('Component created');
    await this.fetchInitialPurchaseOrders();
    this.listenToPurchaseOrders();
  },
  watch: {
    purchaseOrders(newVal) {
      console.log('Purchase Orders updated:', newVal);
    }
  }
};
</script>

<style scoped>

</style>
