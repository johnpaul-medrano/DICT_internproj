<template>
  <div>
    <div class="table-container">
      <table class="doc-table">
        <thead>
          <tr>
            <th>PO No.</th>
            <th>Date</th>
            <th>Supplier</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!purchaseOrders.length">
            <td colspan="6">No purchase orders available.</td>
          </tr>
          <tr v-for="po in purchaseOrders" :key="po.id">
            <td>{{ po.poNo }}</td>
            <td>{{ po.date }}</td>
            <td>{{ po.supplier }}</td>
            <td>{{ po.totalAmount }}</td>
            <td>
              <select v-model="po.status" @change="updateStatus(po)">
                <option value="Pending for Supplier's Signature">
                  Pending for Supplier's Signature
                </option>
                <option value="Submitted to COA">Submitted to COA</option>
                <option value="Submitted to Budget for Obligation/ORS">
                  Submitted to Budget for Obligation/ORS
                </option>
              </select>
            </td>
            <td>
              <a :href="po.downloadURL" target="_blank"
                ><button id="download">Download PDF</button></a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export default {
  computed: {
    ...mapState({
      purchaseOrders: (state) => state.purchaseOrders,
    }),
  },
  methods: {
    ...mapActions(["fetchInitialPurchaseOrders", "listenToPurchaseOrders"]),
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

<style scoped>
* {
  font-family: "Poppins", "sans-serif";
}

.table-container {
  overflow-x: auto;
  display: flex;
  justify-content: center;
  padding: 10px;
}

table {
  padding: 50px;
}

.doc-table {
  border-radius: 20px;
  border-collapse: collapse;
  width: 90%;
}

.doc-table th,
.doc-table td {
  border: 1px solid #cccccc;
  padding: 10px;
  text-align: center;
}

.doc-table th {
  background-color: #003366;
  color: white;
  font-weight: 400;
}

.doc-table td {
  padding-left: 20px;
  background-color: #dedede;
}

.doc-table select {
  width: 100%;
  height: 50px;
  padding: 5px;
  box-sizing: border-box;
  border-radius: 10px;
  border: 0.5px solid rgb(186, 185, 185);
}

#download {
  width: 150px;
  height: 35px;
  background-color: #004387;
  color: white;
  border-radius: 5px;
  border: none;
}

#download:hover {
  background-color: #003366;
  cursor: pointer;
}
</style>
