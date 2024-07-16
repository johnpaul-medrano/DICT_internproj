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
            <th id="remarks">Remarks</th>
            <th>Upload Time</th> 
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in paginatedTableData" :key="index">
            <td>{{ row.prnum }}</td>
            <td>{{ row.description }}</td>
            <td>{{ getStatus(row.PDF) }}</td>
            <td><a :href="row.PDF" target="_blank">View PDF</a></td>
            <td>{{ row.remarks || 'No Remark' }}</td>
            <td>{{ formatTimestamp(row.timestamp) }}</td>
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
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export default {
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 15,
      tableData: [],
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
    formatTimestamp(timestamp) {
      if (!timestamp) return 'No Upload';
      const date = timestamp.toDate(); // Convert Firestore timestamp to JS Date
      return date.toLocaleString(); // Customize this format as needed
    },
  },
};
</script>

<style >
* {
  font-family: "Poppins", "sans-serif";
}


.table-container {
  margin-top: 20px;
  overflow-x: auto;
  display: flex;
  justify-content: center;
  padding: 10px;

}

table {
  padding: 50px;
}

.doc-table {
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

.doc-table input,
.doc-table select,
.doc-table textarea {
  width: 100%;
  height: 50px;
  padding: 5px;
  box-sizing: border-box;
  border-radius: 10px;
  border: 0.5px solid rgb(186, 185, 185);
}

.pagination-container {
  margin-top: 20px;
  text-align: center;
}

.pagination-container label {
  margin-right: 10px;
  font-weight: bold;
}

.pagination-container select {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #cccccc;
}

#remarks {
  width: 20%;
}


</style>