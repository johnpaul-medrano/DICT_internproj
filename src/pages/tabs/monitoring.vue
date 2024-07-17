<template>
  <div>
    <div class="table-container">
      <table class="doc-table">
        <!-- Table headers -->
        <thead>
          <tr>
            <th>PR Number</th>
            <th>Description</th>
            <th>Status</th>
            <th>Action</th>
            <th id="remarks">Remarks</th>
            <th>Upload Time</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <!-- Table rows for paginated data -->
          <tr v-for="(row, index) in paginatedTableData" :key="index">
            <td>{{ row.prnum }}</td>
            <td>{{ row.description }}</td>
            <td>{{ getStatus(row.PDF) }}</td>
            <td><a :href="row.PDF" target="_blank">View PDF</a></td>
            <td>{{ row.remarks || "No Remark" }}</td>
            <td>{{ formatTimestamp(row.timestamp) }}</td>
            <td><button @click="showDetails(row.prnum)">Details</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pagination controls -->
    <div class="pagination-container">
      <label for="pageSelect">Choose Page: </label>
      <select id="pageSelect" v-model="currentPage" @change="updatePage">
        <option v-for="page in totalPages" :key="page" :value="page">
          {{ page }}
        </option>
      </select>
    </div>

    <!-- Details modal -->
    <TransactionDetails
      v-if="detailsModalOpen"
      :prnum="selectedPRNum"
      :detailedTableData="detailedTableData"
      @close="closeDetailsModal"
    />
  </div>
</template>

<script>
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import TransactionDetails from "../Transaction_details.vue"; // Adjust path as per your project structure

export default {
  components: {
    TransactionDetails
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 15,
      tableData: {},
      detailedTableData: [],
      project: this.$route.params.logo,
      detailsModalOpen: false,
      selectedPRNum: null
    };
  },
  computed: {
    sortedTableData() {
      return Object.values(this.tableData).sort((a, b) => b.timestamp - a.timestamp);
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
      const collectionPaths = [
        `${this.project}/${this.project}_data/generated_forms`,
        `${this.project}/${this.project}_data/purchase_requests`,
        `${this.project}/${this.project}_data/TOD_tab`,
        `${this.project}/${this.project}_data/Budget_tab`,
        `${this.project}/${this.project}_data/RD_tab`,
      ];

      collectionPaths.forEach((path) => {
        const q = query(collection(db, path), orderBy("timestamp", "desc"));
        onSnapshot(q, (snapshot) => {
          const data = [];
          snapshot.forEach((doc) => {
            data.push({ id: doc.id, collectionName: path, ...doc.data() });
          });
          this.updateTableData(data);
        });
      });
    },
    updateTableData(newData) {
      const detailedData = [...this.detailedTableData];

      newData.forEach((item) => {
        if (!this.tableData[item.prnum] || item.timestamp > this.tableData[item.prnum].timestamp) {
          this.tableData[item.prnum] = item;
        }
        detailedData.push(item);
      });

      this.detailedTableData = detailedData;
    },
    getStatus(downloadURL) {
      return downloadURL ? "Completed" : "Waiting for Attachment";
    },
    updatePage() {
      this.currentPage = parseInt(this.currentPage);
    },
    formatTimestamp(timestamp) {
      if (!timestamp) return "No Upload";
      const date = timestamp.toDate(); // Convert Firestore timestamp to JS Date
      return date.toLocaleString(); // Customize this format as needed
    },
    showDetails(prnum) {
      this.selectedPRNum = prnum;
      this.detailsModalOpen = true;
    },
    closeDetailsModal() {
      this.detailsModalOpen = false;
    },
  },
};
</script>
<style>
* {
  font-family: "Poppins", "sans-serif";
}

.table-container {
  margin-top: 30px;
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
