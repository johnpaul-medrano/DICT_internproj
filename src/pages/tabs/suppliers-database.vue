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
          <th>BIR</th>
          <th>PHILGEPS</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <!-- Input Row for Adding New Supplier -->
        <tr>
          <td><input v-model="newSupplier.name" placeholder="Name of Supplier" required /></td>
          <td><input v-model="newSupplier.address" placeholder="Address" required /></td>
          <td><input v-model="newSupplier.contactNumber" placeholder="Contact Number" required /></td>
          <td><input v-model="newSupplier.email" placeholder="Email" required /></td>
          <td><input v-model="newSupplier.product" placeholder="Product" required /></td>
          <td><input type="file" @change="handleFileUpload($event, 'bir')" required /></td>
          <td><input type="file" @change="handleFileUpload($event, 'philgeps')" required /></td>
          <td><button id="add-row" @click="addRow" class="add-button">Add</button></td>
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
            <input v-if="item.editing" type="file" @change="handleFileUpload($event, 'bir', item)" />
            <span v-else>
              <button id="button_BIR" v-if="item.birFileUrl" @click="viewPDF(item.birFileUrl)" class="action-button view-button">View BIR</button>
              <span v-else>No File</span>
            </span>
          </td>
          <td>
            <input v-if="item.editing" type="file" @change="handleFileUpload($event, 'philgeps', item)" />
            <span v-else>
              <button id="button_BIR" v-if="item.philgepsFileUrl" @click="viewPDF(item.philgepsFileUrl)" class="action-button view-button">View PHILGEPS</button>
              <span v-else>No File</span>
            </span>
          </td>
          <td>
            <button :class="[item.editing ? 'save-button' : 'edit-button']" @click="editRow(item)">
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
import { db, storage } from "@/firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

export default {
  data() {
    return {
      tableData: [],
      newSupplier: {
        name: '',
        address: '',
        contactNumber: '',
        email: '',
        product: '',
        birFile: null,
        philgepsFile: null,
        birFileUrl: '',
        philgepsFileUrl: ''
      }
    };
  },
  methods: {
    async addRow() {
      if (this.newSupplier.name && this.newSupplier.address && this.newSupplier.contactNumber && this.newSupplier.email && this.newSupplier.product && this.newSupplier.birFile && this.newSupplier.philgepsFile) {
        try {
          // Upload files and get URLs
          const birFileUrl = this.newSupplier.birFile ? await this.uploadFile(this.newSupplier.birFile, 'bir') : '';
          const philgepsFileUrl = this.newSupplier.philgepsFile ? await this.uploadFile(this.newSupplier.philgepsFile, 'philgeps') : '';

          // Add document to Firestore
          const docRef = await addDoc(collection(db, "suppliers"), { 
            name: this.newSupplier.name,
            address: this.newSupplier.address,
            contactNumber: this.newSupplier.contactNumber,
            email: this.newSupplier.email,
            product: this.newSupplier.product,
            birFileUrl, 
            philgepsFileUrl 
          });
          console.log("Document written with ID: ", docRef.id);

          // Fetch updated data and reset form
          await this.fetchSuppliers();
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
        toast.error("Please fill in all fields and upload BIR and PHILGEPS files.", { 
          position: "bottom-right",
          autoClose: 1000
        });
      }
    },
    async editRow(item) {
      if (item.editing) {
        try {
          // Handle file uploads for editing
          const birFileUrl = item.birFile ? await this.uploadFile(item.birFile, 'bir') : item.birFileUrl;
          const philgepsFileUrl = item.philgepsFile ? await this.uploadFile(item.philgepsFile, 'philgeps') : item.philgepsFileUrl;

          // Update document in Firestore
          await updateDoc(doc(db, "suppliers", item.id), {
            name: item.name,
            address: item.address,
            contactNumber: item.contactNumber,
            email: item.email,
            product: item.product,
            birFileUrl,
            philgepsFileUrl
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
        name: '',
        address: '',
        contactNumber: '',
        email: '',
        product: '',
        birFile: null,
        philgepsFile: null,
        birFileUrl: '',
        philgepsFileUrl: ''
      };
    },
    async fetchSuppliers() {
      const querySnapshot = await getDocs(collection(db, "suppliers"));
      this.tableData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), editing: false }));
    },
    async uploadFile(file, type) {
      try {
        const uniqueFileName = `${type}_${uuidv4()}_${file.name}`;
        const storageRef = ref(storage, `suppliers/${type}/${uniqueFileName}`);
        const uploadSnapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(uploadSnapshot.ref);
      } catch (e) {
        console.error("Error uploading file: ", e);
        toast.error(`Error uploading ${type} file.`, { 
          position: "bottom-right",
          autoClose: 1000 
        });
        return '';
      }
    },
    viewPDF(url) {
      window.open(url, '_blank');
    },
    handleFileUpload(event, type, item = null) {
      const file = event.target.files[0];
      if (type === 'bir') {
        this.newSupplier.birFile = file;
        if (item) {
          item.birFile = file;
        }
      } else if (type === 'philgeps') {
        this.newSupplier.philgepsFile = file;
        if (item) {
          item.philgepsFile = file;
        }
      }
    }
  },
  mounted() {
    this.fetchSuppliers();
  }
};
</script>

<style scoped src="./suppliers-database.css"></style>









