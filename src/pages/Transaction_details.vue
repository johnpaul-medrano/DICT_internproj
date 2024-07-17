<template>
  <div class="transaction-details-modal">
    <div class="modal-content">
      <h2>Transaction Details - PR Number: {{ prnum }}</h2>
      <div v-for="(transaction, index) in filteredTransactions" :key="index" class="transaction-card">
        <div class="transaction-info">
          <div class="info-column">
            <p><strong>Description:</strong> {{ transaction.description }}</p>
            <p><strong>Status:</strong> {{ transaction.PDF ? 'Completed' : 'Waiting for Attachment' }}</p>
          </div>
          <div class="info-column">
            <p><strong>Remarks:</strong> {{ transaction.remarks || 'No Remark' }}</p>
            <p><strong>Upload Time:</strong> {{ formatTimestamp(transaction.timestamp) }}</p>
          </div>
          <p><strong>PDF:</strong> <a :href="transaction.PDF" target="_blank">View PDF</a></p>
        </div>
      </div>
      <button @click="close">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    prnum: {
      type: String,
      required: true
    },
    detailedTableData: {
      type: Array,
      required: true
    }
  },
  computed: {
    filteredTransactions() {
      return this.detailedTableData.filter(item => item.prnum === this.prnum);
    }
  },
  methods: {
    formatTimestamp(timestamp) {
      if (!timestamp) return "No Upload";
      const date = timestamp.toDate();
      return date.toLocaleString();
    },
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
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
  border-radius: 8px;
  width: 80%;
  max-width: 800px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.transaction-card {
  display: flex;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}

.transaction-info {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.info-column {
  flex: 1;
  margin-right: 20px; /* Adjust spacing between columns */
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
</style>
