<template>
  <div class="main-content">
    <div class="purchase-request-form">
      <h2>Create Purchase Request - FB</h2>
      <form @submit.prevent="handleUpload">
        <div class="grid-container">
          <div class="left">
            <div class="prnum-container">
              <div class="cont">
                <label for="prnum">PR Number:</label>
                <input type="text" id="prnum" v-model="form.prnum" required />
              </div>
              <div class="cont">
                <label for="subaro">SUB ARO No.:</label>
                <input type="text" id="subaro" v-model="form.subaro" required />
              </div>
            </div>
          </div>

          <div
            v-for="(item, index) in form.items"
            :key="`item-${index}`"
            :ref="'item' + index"
            class="grid-item"
          >
            <div class="first-row">
              <div class="cont">
                <label :for="'stock' + index">Stock No.:</label>
                <input
                  type="text"
                  :id="'stock' + index"
                  v-model="item.stock"
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

            <label :for="'itemdesc' + index">Item Description:</label>
            <input
              id="desc"
              type="text"
              :id="'itemdesc' + index"
              v-model="item.itemdesc"
              required
            />
            <div class="third-row">
              <div class="cont">
                <label :for="'quantity' + index">Quantity:</label>
                <input
                  type="number"
                  :id="'quantity' + index"
                  v-model="item.quantity"
                  required
                />
              </div>
              <div class="cont">
                <label :for="'unitcost' + index">Unit Cost:</label>
                <input
                  type="number"
                  :id="'unitcost' + index"
                  v-model="item.unitcost"
                  required
                />
              </div>
            </div>

            <div class="total-unit-cost">
              <label :for="'totalunitcost' + index">Total Unit Cost:</label>
              <span :id="'totalunitcost' + index">{{
                item.quantity * item.unitcost
              }}</span>
            </div>

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

        <div class="total-amount">
          <label for="totalAmount">Total Amount:</label>
          <span id="totalAmount">{{ totalAmount }}</span>
        </div>
        
        <div class="file-input">
          <label for="additionalFile">Quatation File:</label Required>
          <input type="file" id="additionalFile" @change="handleFileChange" Required/>
        </div>

        <button id="upload" type="submit">GENERATE</button>
      </form>
    </div>
  </div>
</template>

<script>
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import prTemplate from "@/assets/pr-template.pdf";
import add from "@/assets/add.png";
import remove from "@/assets/close.png";
import { storage, db } from "@/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  data() {
    return {
      add,
      remove,
      form: {
        prnum: "",
        subaro: "",
        items: [
          {
            stock: "",
            unit: "",
            itemdesc: "",
            quantity: 0,
            unitcost: 0,
          },
        ],
      },
      additionalFile: null, // Add this line
    };
  },
  computed: {
    totalAmount() {
      return this.form.items.reduce(
        (sum, item) => sum + item.quantity * item.unitcost,
        0
      );
    },
    project() {
      return this.$route.params.logo; // Get the selected project from the route parameter
    },
  },
  methods: {
    handleFileChange(event) {
      this.additionalFile = event.target.files[0];
    },
    addItem() {
      this.form.items.push({
        stock: "",
        unit: "",
        itemdesc: "",
        quantity: 0,
        unitcost: 0,
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
    async generatePDF() {
      try {
        const existingPdfBytes = await fetch(prTemplate).then((res) =>
          res.arrayBuffer()
        );
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        firstPage.drawText(this.form.prnum, {x: 305,y: 673,size: 11,font: timesRomanFont,color: rgb(0, 0, 0),});
        firstPage.drawText(this.form.subaro, {x: 205,y: 407,size: 11,font: timesRomanFont,color: rgb(0, 0, 0),});

        let yOffset = 615;
        const rowHeight = 12;
        this.form.items.forEach((item) => {
          if (yOffset < 100) { yOffset = 615;}

          firstPage.drawText(item.stock, {x: 60,y: yOffset,size: 10,font: timesRomanFont,color: rgb(0, 0, 0),});
          firstPage.drawText(item.unit, { x: 115, y: yOffset, size: 10, font: timesRomanFont, color: rgb(0, 0, 0), });
          firstPage.drawText(item.itemdesc, { x: 152, y: yOffset, size: 10, font: timesRomanFont, color: rgb(0, 0, 0), });
          firstPage.drawText(item.quantity.toString(), {x: 378,y: yOffset,size: 10, font: timesRomanFont, color: rgb(0, 0, 0),});
          firstPage.drawText(item.unitcost.toString(), { x: 430, y: yOffset, size: 10, font: timesRomanFont, color: rgb(0, 0, 0),});
          firstPage.drawText((item.quantity * item.unitcost).toString(), {x: 485,y: yOffset,size: 10,font: timesRomanFont,color: rgb(0, 0, 0), });
          yOffset -= rowHeight;
        });

        firstPage.drawText(`${this.totalAmount}`, {x: 482,y: 286,size: 11,font: timesRomanFont,color: rgb(0, 0, 0),
        });

        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
      } catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
      }
    },
    async handleUpload() {
      const loadingToastId = toast.loading("Uploading PDF and file...", {
        position: "bottom-right",
        transition: "flip",
        hideProgressBar: true,
      });

      try {
        // Upload the additional file if it exists
        let additionalFileDownloadURL = null;
        if (this.additionalFile) {
          const additionalFileRef = ref(
            storage,
            `additional_files/${this.form.prnum}_${this.additionalFile.name}`
          );
          const additionalFileSnapshot = await uploadBytes(
            additionalFileRef,
            this.additionalFile
          );
          additionalFileDownloadURL = await getDownloadURL(
            additionalFileSnapshot.ref
          );
        }

        // Generate and upload the PDF
        const pdfBytes = await this.generatePDF();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });

        const generatedFormsCollectionPath = `${this.project}/${this.project}_data/generated_forms`;
        const generatedFormsPdfRef = ref(
          storage,
          `generated_forms/${this.form.prnum}.pdf`
        );
        const generatedFormsUploadTaskSnapshot = await uploadBytes(
          generatedFormsPdfRef,
          blob
        );

        // Get the PDF download URL for the generated form
        const generatedFormsDownloadURL = await getDownloadURL(
          generatedFormsUploadTaskSnapshot.ref
        );

        // Save the download URL to Firestore for the generated form
        await addDoc(collection(db, generatedFormsCollectionPath), {
          prnum: this.form.prnum,
          subaro: this.form.subaro,
          description: this.form.items
            .map((item) => item.itemdesc)
            .join(", "),
          status: "Generated",
          remarks: "Generated Form",
          PDF: generatedFormsDownloadURL,
          timestamp: serverTimestamp(),
          additionalFile: additionalFileDownloadURL, // Save the additional file URL if exists
        });

        // Define the correct Firestore collection path
        const collectionPath = `${this.project}/${this.project}_data/purchase_requests`;
        const pdfRef = ref(storage, `purchase_requests/${this.form.prnum}.pdf`);
        const uploadTaskSnapshot = await uploadBytes(pdfRef, blob);

        // Get the PDF download URL
        const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);

        // Save the download URL to Firestore
        await addDoc(collection(db, collectionPath), {
          prnum: this.form.prnum,
          subaro: this.form.subaro,
          description: this.form.items.map((item) => item.itemdesc).join(", "),
          status: "Generated",
          remarks: "Routed To TOD HEAD",
          PDF: downloadURL,
          timestamp: serverTimestamp(),
          additionalFile: additionalFileDownloadURL, // Save the additional file URL if exists
        });

        toast.update(loadingToastId, {
          position: "bottom-right",
          render: "PDF and file uploaded successfully",
          type: toast.TYPE.SUCCESS,
          autoClose: 2000,
          isLoading: false,
        });

        this.resetForm();
      } catch (error) {
        console.error("Error uploading PDF and file:", error);

        toast.update(loadingToastId, {
          position: "bottom-right",
          render: "Error uploading PDF and file",
          type: toast.TYPE.ERROR,
          autoClose: 2000,
          isLoading: false,
        });
      }
    },
    resetForm() {
      this.form = {
        prnum: "",
        subaro: "",
        items: [
          {
            stock: "",
            unit: "",
            itemdesc: "",
            quantity: 0,
            unitcost: 0,
          },
        ],
      };
      this.additionalFile = null; // Reset additional file
    },
  },
};
</script>



<style scoped src="./prform.css"></style>
