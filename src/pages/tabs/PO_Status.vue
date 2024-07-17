<template>
    <div>
      <h1>Purchase Order Monitoring</h1>
      <table>
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
                <option value="Pending for Supplier's Signature">Pending for Supplier's Signature</option>
                <option value="Submitted to COA">Submitted to COA</option>
                <option value="Submitted to Budget for Obligation/ORS">Submitted to Budget for Obligation/ORS</option>
              </select>
            </td>
            <td><a :href="po.downloadURL" target="_blank">Download PDF</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import { mapState, mapActions } from 'vuex';
  import { doc, updateDoc } from "firebase/firestore";
  import { db } from "@/firebaseConfig";
  
  export default {
    computed: {
      ...mapState({
        purchaseOrders: state => state.purchaseOrders
      })
    },
    methods: {
      ...mapActions(['fetchInitialPurchaseOrders', 'listenToPurchaseOrders']),
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
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  th {
    background-color: #f2f2f2;
  }
  </style>
  