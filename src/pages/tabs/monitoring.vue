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
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in paginatedTableData" :key="index">
            <td>{{ row.prnum }}</td>
            <td>{{ row.description }}</td>
            <td>{{ getStatus(row.PDF) }}</td>
            <td><a :href="row.PDF" target="_blank">View PDF</a></td>
            <td id="remarks">
              <select v-model="row.remark" @change="addRemark($event, row)">
                <option value="">Select Remark</option>
                <option>Form Generated</option>
                <option>Received by TOD</option>  
                <option>Received by Budget Division</option>
                <option>Received by RD</option>
                <option>Received by SO</option>
                <option>ERROR DOCS</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination-container">
      <label for="pageSelect">Choose Page: </label>
      <select id="pageSelect" v-model="currentPage" @change="refreshPage">
        <option v-for="page in totalPages" :key="page" :value="page">{{ page }}</option>
      </select>
    </div>
  </div>
</template>


<script>
import { onSnapshot, collection, query, orderBy, updateDoc, doc } from "firebase/firestore";
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
      const collections = ["purchase_requests", "TOD_tab", "Budget_tab", "RD_tab"];
      collections.forEach((collectionName) => {
        const q = query(collection(db, collectionName), orderBy("timestamp", "desc"));
        onSnapshot(q, (snapshot) => {
          const data = [];
          snapshot.forEach(doc => {
            data.push({ id: doc.id, collectionName, ...doc.data() });
          });
          this.tableData = this.removeDuplicates([...this.tableData, ...data]);
        });
      });
    },
    removeDuplicates(array) {
      const seen = new Set();
      return array.filter(item => {
        const duplicate = seen.has(item.id);
        seen.add(item.id);
        return !duplicate;
      });
    },
    getStatus(downloadURL) {
      return downloadURL ? 'Completed' : 'Waiting for Attachment';
    },
    updatePage() {
      this.currentPage = parseInt(this.currentPage);
    },
    async addRemark(event, row) {
      const remark = event.target.value;
      if (remark) {
        try {
          // Update the specific document in the relevant collection
          await updateDoc(doc(db, row.collectionName, row.id), {
            remark
          });
          
          toast.success("Remark added successfully", {
            position: "bottom-right",
            autoClose: 2000,
          });

          // Update the local data without causing duplicates
          this.tableData = this.tableData.map(item => {
            if (item.id === row.id) {
              return { ...item, remark };
            }
            return item;
          });

        } catch (error) {
          console.error("Error adding remark:", error);
          toast.error("Error adding remark", {
            position: "bottom-right",
            autoClose: 2000,
          });
        }
      }
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
          const storageRef = ref(storage, `Budget_tab/${row.id}.pdf`);
          const uploadTaskSnapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);

          await updateDoc(doc(db, "Budget_tab", row.id), {
            nextStepPdf: downloadURL,
            timestamp: new Date(),
          });

          toast.update(loadingToastId, {
            position: "bottom-right",
            render: "PDF uploaded successfully",
            type: toast.TYPE.SUCCESS,
            isLoading: false,
          });

          // Update the local data without causing duplicates
          this.tableData = this.tableData.map(item => {
            if (item.id === row.id) {
              return { ...item, nextStepPdf: downloadURL };
            }
            return item;
          });

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
