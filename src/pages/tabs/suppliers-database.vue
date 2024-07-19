<template>
  <div class="table-container">
    <table class="doc-table">
      <thead>
        <tr>
          <th>Name of Supplier</th>
          <th>Address</th>
          <th>Contact Number</th>
          <th>Email</th>
          <th>Product</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Input Row for Adding New Supplier -->
        <tr>
          <td><input v-model="newSupplier.name" placeholder="Name of Supplier" /></td>
          <td><input v-model="newSupplier.address" placeholder="Address" /></td>
          <td><input v-model="newSupplier.contactNumber" placeholder="Contact Number" /></td>
          <td><input v-model="newSupplier.email" placeholder="Email" /></td>
          <td><input v-model="newSupplier.product" placeholder="Product" /></td>
          <td><button id="add-row" @click="addRow">Add</button></td>
        </tr>

        <!-- Existing Rows -->
        <tr v-for="(item, index) in tableData" :key="item.id">
          <td>
            <input v-if="item.editing" v-model="item.name" />
            <span v-else>{{ item.name }}</span>
          </td>
          <td>
            <input v-if="item.editing" v-model="item.address" />
            <span v-else>{{ item.address }}</span>
          </td>
          <td>
            <input v-if="item.editing" v-model="item.contactNumber" />
            <span v-else>{{ item.contactNumber }}</span>
          </td>
          <td>
            <input v-if="item.editing" v-model="item.email" />
            <span v-else>{{ item.email }}</span>
          </td>
          <td>
            <input v-if="item.editing" v-model="item.product" />
            <span v-else>{{ item.product }}</span>
          </td>
          <td>
            <button :class="['action-button', item.editing ? 'save-button' : 'edit-button']" @click="editRow(item)">
              {{ item.editing ? 'Save' : 'Edit' }}
            </button>
            <button v-if="item.editing" class="cancel-button" @click="cancelEdit(item)">Cancel</button>
            <button class="delete-button" @click="confirmDelete(index)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { db } from "@/firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  data() {
    return {
      tableData: [],
      newSupplier: {
        id: null,
        name: '',
        address: '',
        contactNumber: '',
        email: '',
        product: ''
      }
    };
  },
  methods: {
    async addRow() {
      if (this.newSupplier.name && this.newSupplier.address && this.newSupplier.contactNumber && this.newSupplier.email && this.newSupplier.product) {
        try {
          const docRef = await addDoc(collection(db, "suppliers"), this.newSupplier);
          console.log("Document written with ID: ", docRef.id);
          this.fetchSuppliers();
          this.resetNewSupplier();
          toast.success("Supplier added successfully!", { 
            position: "bottom-right",
            autoClose: 1000 
          });
        } catch (e) {
          console.error("Error adding document: ", e);
          toast.error("Error adding supplier.", { 
            position: "bottom-right",
            autoClose: 1000 
          });
        }
      } else {
        toast.error("Please fill in all fields.", { 
          position: "bottom-right",
          autoClose: 1000
        });
      }
    },
    async editRow(item) {
      if (item.editing) {
        // Save the edited item to Firestore
        try {
          await updateDoc(doc(db, "suppliers", item.id), {
            name: item.name,
            address: item.address,
            contactNumber: item.contactNumber,
            email: item.email,
            product: item.product
          });
          item.editing = false;
          toast.success("Supplier details edited successfully!", { 
            position: "bottom-right",
            autoClose: 1000 
          });
        } catch (e) {
          console.error("Error editing document: ", e);
          toast.error("Error editing supplier details.", { 
            position: "bottom-right",
            autoClose: 1000 
          });
        }
      } else {
        item.editing = true;
      }
    },
    cancelEdit(item) {
      item.editing = false;
    },
    async confirmDelete(index) {
      if (confirm("Are you sure you want to delete this row?")) {
        await this.deleteRow(index);
      }
    },
    async deleteRow(index) {
      const item = this.tableData[index];
      try {
        await deleteDoc(doc(db, "suppliers", item.id));
        this.tableData.splice(index, 1);
        toast.success("Supplier details deleted successfully!", { 
          position: "bottom-right",
          autoClose: 1000 
        });
      } catch (e) {
        console.error("Error deleting document: ", e);
        toast.error("Error deleting supplier.", { 
          position: "bottom-right",
          autoClose: 1000 
        });
      }
    },
    resetNewSupplier() {
      this.newSupplier = {
        id: null,
        name: '',
        address: '',
        contactNumber: '',
        email: '',
        product: ''
      };
    },
    async fetchSuppliers() {
      const querySnapshot = await getDocs(collection(db, "suppliers"));
      this.tableData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), editing: false }));
    }
  },
  async mounted() {
    await this.fetchSuppliers();
  }
};
</script>

<style scoped src="./suppliers-database.css"></style>









