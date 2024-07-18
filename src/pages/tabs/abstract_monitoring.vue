<template>
    <div>
      <div class="table-container">
        <table class="doc-table">
          <!-- Table headers -->
          <thead>
            <tr>
              <th>Particulars</th>
              <th>Control NO.</th>
              <th>Download PDF</th>
              <th>Time Upload</th>
            </tr>
          </thead>
          <tbody>
            <!-- Table rows for all data -->
            <tr v-for="(row, index) in tableData" :key="index">
              <td>{{ row.particulars }}</td>
              <td>{{ row.controlNo }}</td>
              <td>
                <a :href="row.pdfUrl" target="_blank">
                  <button class="btn-view" >
                    <img :src="view" alt="icon" class="view-icon" /> PDF 
                  </button>
                </a>
              </td>
              <td>{{ formatTimestamp(row.timestamp) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      

    </div>
    <div class="pagination-container">
        <label for="pageSelect">Choose Page: </label>
        <select id="pageSelect" v-model="currentPage" @change="updatePage">
          <option v-for="page in totalPages" :key="page" :value="page">
            {{ page }}
          </option>
        </select>
      </div>
  </template>
  
  <script>
  import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
  import { db } from "@/firebaseConfig";
  import view from "@/assets/pdf.png";
  
  export default {
    data() {
      return {
        currentPage: 1,
        itemsPerPage: 15,
        tableData: [], // Array to store all table data
        view,
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.tableData.length / this.itemsPerPage);
      },
    },
    async mounted() {
      await this.fetchInitialTableData();
    },
    methods: {
      async fetchInitialTableData() {
        try {
          const path = "abstractForms"; // Assuming "abstractForms" is your collection path
          const q = query(collection(db, path), orderBy("timestamp", "desc"));
          const snapshot = await onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            this.tableData = data;
          });
        } catch (error) {
          console.error("Error fetching table data:", error);
        }
      },
      formatTimestamp(timestamp) {
        if (!timestamp) return "No Upload";
        const date = timestamp.toDate(); // Convert Firestore timestamp to JS Date
        return date.toLocaleString(); // Customize this format as needed
      },
      updatePage() {
        this.currentPage = parseInt(this.currentPage);
      },
    },
  };
  </script>
  
  <style scoped>
  * {
    font-family: "Poppins", "sans-serif";
  }
  
  .table-container {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    padding: 10px;
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
  
  .btn-view {
    font-size: 18px;
    width: 100px;
    height: 35px;
    background-color: #a51010;
    color: white;
    border-radius: 5px;
    border: none;
  }
  
  .btn-view:hover {
    background-color: #003366;
    cursor: pointer;
  }
  
  .view-icon {
    width: 15px;
    margin-right: 5px;
  }
  </style>
  