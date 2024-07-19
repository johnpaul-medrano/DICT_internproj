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
    addRow() {
      if (this.newSupplier.name && this.newSupplier.address && this.newSupplier.contactNumber && this.newSupplier.email && this.newSupplier.product) {
        this.newSupplier.id = this.tableData.length + 1;
        this.newSupplier.editing = false;
        this.tableData.unshift({ ...this.newSupplier }); // Add new supplier at the top
        this.resetNewSupplier();
        toast.success("Supplier added successfully!", { 
          position: "bottom-right",
          autoClose: 1000 
        });
      } else {
        toast.error("Please fill in all fields.", { 
          position: "bottom-right",
          autoClose: 1000
        });
      }
    },
    editRow(item) {
      if (item.editing) {
        item.editing = false;
        toast.success("Supplier details edited successfully!", { 
          position: "bottom-right",
          autoClose: 1000
         });
      } else {
        item.editing = true;
      }
    },
    cancelEdit(item) {
      item.editing = false;
    },
    confirmDelete(index) {
      if (confirm("Are you sure you want to delete this row?")) {
        this.deleteRow(index);
      }
    },
    deleteRow(index) {
      this.tableData.splice(index, 1);
      toast.success("Supplier details deleted successfully!", { 
        position: "bottom-right",
        autoClose: 1000
      });
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
    }
  }
};
</script>

<style scoped src="./suppliers-database.css"></style>









