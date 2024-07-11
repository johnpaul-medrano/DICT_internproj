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
          <tr v-for="(row, index) in tableData" :key="index">
            <td>{{ row.prnum }}</td>
            <td>{{ row.description }}</td>
            <td>{{ getStatus(row.downloadURL) }}</td>
            <td><a :href="row.downloadURL" target="_blank">View PDF</a></td>
            <td>Attendance Submitted</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState({
      tableData: state => state.tableData,
    }),
  },
  async mounted() {
    await this.fetchInitialTableData();
    this.listenToTableData();
  },
  methods: {
    ...mapActions(['fetchInitialTableData', 'listenToTableData']),
    getStatus(downloadURL) {
      return downloadURL ? 'Completed' : 'Waiting for Attachment';
    },
  },
};
</script>

<style src="./monitoring.css"></style>
