<template>
  <div class="main-content">
    <div class="purchase-request-form">
      <h2>Create Purchase Request - SVP</h2>
      <form @submit.prevent="handleSubmit">
        <div class="grid-container">
          <div class="left">
            <div class="prnum">
              <div class="cont">
                <label for="prnum">PR Number:</label>
                <input type="text" id="prnum" v-model="form.prnum" required />
              </div>
            </div>

            <div class="cont">
              <label for="subaro">Sub ARO No.:</label>
              <input type="text" id="subaro" v-model="form.subaro" required />
            </div>
          </div>

          <div v-for="(item, index) in form.items" :key="`item-${index}`" :ref="'item' + index" class="grid-item">
            <div class="first-row">
              <div class="cont">
                <label :for="'stock' + index">Stock No.:</label>
                <input type="text" :id="'stock' + index" v-model="item.stock" required />
              </div>
              <div class="cont">
                <label :for="'unit' + index">Unit:</label>
                <input type="text" :id="'unit' + index" v-model="item.unit" required />
              </div>
            </div>

            <label :for="'itemdesc' + index">Item Description:</label>
            <input id="desc" type="text" :id="'itemdesc' + index" v-model="item.itemdesc" required />
            <div class="third-row">
              <div class="cont">
                <label :for="'quantity' + index">Quantity:</label>
                <input type="number" :id="'quantity' + index" v-model="item.quantity" required />
              </div>
              <div class="cont">
                <label :for="'unitcost' + index">Unit Cost:</label>
                <input type="number" :id="'unitcost' + index" v-model="item.unitcost" required />
              </div>
            </div>

            <div class="total-unit-cost">
              <label :for="'totalunitcost' + index">Total Unit Cost:</label>
              <span :id="'totalunitcost' + index">{{ item.quantity * item.unitcost }}</span>
            </div>

            <div class="item-buttons">
              <button id="remove" type="button" @click="removeItem(index)" v-if="form.items.length > 1">
                <img :src="remove" alt="" />
              </button>
              <button id="add" v-if="index === form.items.length - 1" type="button" @click="addItem">
                <img :src="add" alt="" />
              </button>
            </div>
          </div>
        </div>

        <div class="total-amount">
          <label for="totalAmount">Total Amount:</label>
          <span id="totalAmount">{{ totalAmount }}</span>
        </div>
        <button id="generate" type="submit">Generate PDF</button>
      </form>
    </div>
  </div>
</template>

<script>
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import prTemplate from "@/assets/pr-template.pdf";
import add from "@/assets/add.png";
import remove from "@/assets/close.png";

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
    async handleSubmit() {
      try {
        const existingPdfBytes = await fetch(prTemplate).then((res) =>
          res.arrayBuffer()
        );
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        firstPage.drawText(this.form.prnum, {
          x: 305,
          y: 673,
          size: 11,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });

        firstPage.drawText(this.form.subaro, {
          x: 205,
          y: 407,
          size: 11,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
        });
        let yOffset = 615;
        const rowHeight = 12;

        this.form.items.forEach((item) => {
          if (yOffset < 100) {
            yOffset = 615;
          }

          firstPage.drawText(item.stock, {
            x: 60,
            y: yOffset,
            size: 10,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          firstPage.drawText(item.unit, {
            x: 115,
            y: yOffset,
            size: 10,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          firstPage.drawText(item.itemdesc, {
            x: 152,
            y: yOffset,
            size: 10,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          firstPage.drawText(item.quantity.toString(), {
            x: 378,
            y: yOffset,
            size: 10,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          firstPage.drawText(item.unitcost.toString(), {
            x: 430,
            y: yOffset,
            size: 10,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
          firstPage.drawText((item.quantity * item.unitcost).toString(), {
            x: 480,
            y: yOffset,
            size: 10,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });

          yOffset -= rowHeight;
        });

        firstPage.drawText(`${this.totalAmount}`, {
          x: 482,
          y: 286,
          size: 11,
          font: timesRomanFont,
          color: rgb(0, 0, 0),
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

        this.resetForm();
      } catch (error) {
        console.error("Error generating PDF:", error);
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
    },
  },
};
</script>

<style scoped src="./prform.css"></style>
