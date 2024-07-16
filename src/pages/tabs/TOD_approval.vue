<template>
    <div>
      <div class="table-container">
        <table class="doc-table">
          <thead>
            <tr>
              <th>PR Number</th>
              <th>Description</th>
              <th>Status</th>
              <th>Action</th>
              <th>Remarks</th>
              <th>Upload Time</th> 
              <th>Next Step</th>
              
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in paginatedTableData" :key="index">
              <td>{{ row.prnum }}</td>
              <td>{{ row.description }}</td>
              <td>{{ getStatus(row.PDF) }}</td>
              <td><a :href="row.PDF" target="_blank">View PDF</a></td>
              <td>Purchase Request Received</td>
              <td>{{ formatTimestamp(row.timestamp) }}</td> <!-- Display Upload Time -->
              <td>
                <div class="file-input-container">
                  <input
                    type="file"
                    :ref="'fileInput' + index"
                    @change="(event) => handleFileChange(event, index)"
                    :disabled="fileInputDisabled[index]"
                  />
                  <button
                    v-if="!fileInputDisabled[index] && !chosenFiles[index]"
                    @click="() => openFileInput(index)"
                  >
                    Choose File
                  </button>
                  <button
                    v-if="chosenFiles[index] && !fileInputDisabled[index]"
                    class="confirm-upload-button"
                    @click="() => confirmUpload(row, index)"
                  >
                    Confirm Upload
                  </button>
                  <button
                    v-if="chosenFiles[index] && !fileInputDisabled[index]"
                    class="clear-file-button"
                    @click="() => clearFile(index)"
                  >
                    Clear File
                  </button>
                  <span v-if="uploadComplete[index]" class="checkmark">✔️</span>
                  <span v-if="chosenFiles[index]" class="chosen-file-name">{{
                    chosenFiles[index].name
                  }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination-container">
        <label for="pageSelect">Choose Page: </label>
        <select id="pageSelect" v-model="currentPage" @change="updatePage">
          <option v-for="page in totalPages" :key="page" :value="page">
            {{ page }}
          </option>
        </select>
      </div>
    </div>
  </template>
  

<script>
import {
  onSnapshot,
  collection,
  query,
  orderBy,
  addDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebaseConfig";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 20,
      tableData: [],
      fileInputDisabled: [], // Track disabled state of file
      chosenFiles: [], // Track chosen files for each row
    };
  },
  computed: {
    sortedTableData() {
      return [...this.tableData].sort((a, b) => b.timestamp - a.timestamp);
    },
    paginatedTableData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedTableData.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.sortedTableData.length / this.itemsPerPage);
    },
  },
  async mounted() {
    this.fetchInitialTableData();
  },
  methods: {
    fetchInitialTableData() {
      const q = query(
        collection(db, "purchase_requests"),
        orderBy("timestamp", "desc")
      );
      onSnapshot(q, (snapshot) => {
        const data = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        this.tableData = data;
        // Initialize arrays
        this.fileInputDisabled = Array(this.tableData.length).fill(false);
        this.uploadComplete = Array(this.tableData.length).fill(false);
        this.chosenFiles = Array(this.tableData.length).fill(null);
      });
    },
    getStatus(downloadURL) {
      return downloadURL ? "Completed" : "Waiting for Attachment";
    },
    updatePage() {
      this.currentPage = parseInt(this.currentPage);
    },
    openFileInput(index) {
      this.$refs["fileInput" + index][0].click();
    },
    handleFileChange(event, index) {
      const file = event.target.files[0];
      if (file) {
        // Store the chosen file and enable the Confirm Upload button
        this.chosenFiles[index] = file;
        this.fileInputDisabled[index] = false; // Enable the Confirm Upload button
      } else {
        this.chosenFiles[index] = null;
        this.fileInputDisabled[index] = true;
      }
    },
    clearFile(index) {
      this.chosenFiles[index] = null;
      this.fileInputDisabled[index] = false; // Re-enable the file input
      this.uploadComplete[index] = false; // Reset the upload completion state
      this.$refs["fileInput" + index][0].value = null; // Clear the file input field
    },
    async confirmUpload(row, index) {
      const file = this.chosenFiles[index];
      if (file) {
        const loadingToastId = toast.loading("Uploading PDF...", {
          position: "bottom-right",
          transition: "flip",
          hideProgressBar: true,
        });

        try {
          // Upload PDF file to Firebase Storage
          const storageRef = ref(storage, `TOD_tab/${row.id}.pdf`);
          const uploadTaskSnapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);

          const timestamp = new Date(); // Get the current timestamp

          // Add document to 'TOD_tab' collection in Firestore
          await addDoc(collection(db, "TOD_tab"), {
            prnum: row.prnum,
            description: row.description,
            PDF: downloadURL,
            remarks: "Sent to Budget Division",
            timestamp: timestamp, // Save the timestamp
          });

          toast.update(loadingToastId, {
            position: "bottom-right",
            render: "PDF uploaded successfully",
            type: toast.TYPE.SUCCESS,
            autoClose: 2000,
            isLoading: false,
          });

          // Disable the file input and mark upload as complete
          this.fileInputDisabled[index] = true;
          this.uploadComplete[index] = true;

          // Optionally refetch data or update the local tableData
          this.fetchInitialTableData(); // Refetch data to include the newly added document
        } catch (error) {
          console.error("Error uploading PDF:", error);

          toast.update(loadingToastId, {
            position: "bottom-right",
            render: "Error uploading PDF",
            type: toast.TYPE.ERROR,
            autoClose: 2000,
            isLoading: false,
          });
        }
      }
    },
    formatTimestamp(timestamp) {
      if (!timestamp) return 'No Upload';
      const date = new Date(timestamp.seconds * 1000); // Firestore timestamp is in seconds
      return date.toLocaleString(); // Customize this format as needed
    },
  },
};
</script>

<style src="./TOD_approval.css"></style>
