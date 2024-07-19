<template>
  <div class="transaction-details-modal">
    <div class="modal-content">
      <h2>Transaction Details - PR Number: {{ prnum }}</h2>
      <div
        v-for="(transaction, index) in filteredTransactions"
        :key="index"
        class="transaction-card"
      >
        <div class="transaction-info">
          <div class="info-column1">
            <p><strong>Description:</strong> {{ transaction.description }}</p>
            <p>
              <strong>Status:</strong>
              {{ transaction.PDF ? "Completed" : "Waiting for Attachment" }}
            </p>
          </div>
          <div class="info-column2">
            <p>
              <strong>Remarks:</strong> {{ transaction.remarks || "No Remark" }}
            </p>
            <p>
              <strong>Upload Time:</strong>
              {{ formatTimestamp(transaction.timestamp) }}
            </p>
          </div>
          <p>
            <a :href="transaction.PDF" target="_blank"
              ><button id="view">
                <img :src="view" id="view-icon" />View PDF
              </button></a
            >
          </p>
        </div>
      </div>
      <button @click="close">Close</button>
    </div>
  </div>
</template>

<script>
import view from "@/assets/pdf.png";
export default {
  data() {
    return {
      view,
    };
  },
  props: {
    prnum: {
      type: String,
      required: true,
    },
    detailedTableData: {
      type: Array,
      required: true,
    },
  },
  computed: {
    filteredTransactions() {
      return this.detailedTableData.filter((item) => item.prnum === this.prnum);
    },
  },
  methods: {
    formatTimestamp(timestamp) {
      if (!timestamp) return "No Upload";
      const date = timestamp.toDate();
      return date.toLocaleString();
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
* {
  font-family: Poppins;
}
.transaction-details-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  width: 80%;
  max-width: 800px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.transaction-card {
  display: flex;
  border: 1px solid #ccc;
  padding: 20px 50px;
  margin-bottom: 10px;
  border-radius: 15px;
}

.transaction-info {
  display: flex;
  justify-content: space-between;
}

.info-column1 {
  width: 220px;
  /* background-color: pink; */
  margin-right: 5px; /* Adjust spacing between columns */
}

.info-column2 {
  width: 280px;
  /* background-color: pink; */
  margin-right: 5px; /* Adjust spacing between columns */
}

button {
  padding: 10px 20px;
  background-color: #003366;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

#view {
  width: 120px;
  height: 35px;
  background-color: #a51010;
  color: white;
  border-radius: 5px;
  border: none;
  margin-left: 50px;
}

#view:hover {
  background-color: #542424;
  cursor: pointer;
}

#view-icon {
  width: 15px;
  margin-right: 5px;
}
</style>
