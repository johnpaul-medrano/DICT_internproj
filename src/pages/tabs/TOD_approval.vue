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
              <th>Next Step</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in paginatedTableData" :key="index">
              <td>{{ row.prnum }}</td>
              <td>{{ row.description }}</td>
              <td>{{ getStatus(row.downloadURL) }}</td>
              <td><a :href="row.downloadURL" target="_blank">View PDF</a></td>
              <td>Attendance Submitted</td>
              <td>
                <button @click="openFileInput(row)">Upload Next Step PDF</button>
                <input type="file" ref="fileInput" @change="uploadNextStepPdf($event, row)" style="display: flex;" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination-container">
        <label for="pageSelect">Choose Page: </label>
        <select id="pageSelect" v-model="currentPage" @change="updatePage">
          <option v-for="page in totalPages" :key="page" :value="page">{{ page }}</option>
        </select>
      </div>
    </div>
  </template>
  
  <script>
  import { onSnapshot, collection, query, orderBy, addDoc } from "firebase/firestore";
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
        currentRowData: null,
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
        const q = query(collection(db, "purchase_requests"), orderBy("timestamp", "desc"));
        onSnapshot(q, (snapshot) => {
          const data = [];
          snapshot.forEach(doc => {
            data.push({ id: doc.id, ...doc.data() });
          });
          this.tableData = data;
        });
      },
      getStatus(downloadURL) {
        return downloadURL ? 'Completed' : 'Waiting for Attachment';
      },
      updatePage() {
        this.currentPage = parseInt(this.currentPage);
      },
      openFileInput(row) {
        this.currentRowData = row;
        this.$refs.fileInput.click();
      },
      async uploadNextStepPdf(event, row) {
        const file = event.target.files[0];
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
  
            // Add document to 'Budget_tab' collection in Firestore
            await addDoc(collection(db, "TOD_tab"), {
              prnum: row.prnum,
              description: row.description,
              status: "Budget Division Monitoring",
              nextStepPdf: downloadURL,
              timestamp: new Date(), // Optional timestamp
            });
  
            toast.update(loadingToastId, {
              position: "bottom-right",
              render: "PDF uploaded successfully",
              type: toast.TYPE.SUCCESS,
              autoClose: 2000,
              isLoading: false,
            });
  
            // Optionally update local tableData or fetch updated data from Firestore
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
    },
  };
  </script>
  
  <style src="./monitoring.css"></style>
  