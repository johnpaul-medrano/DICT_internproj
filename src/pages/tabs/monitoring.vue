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
              <td>
                <input v-model="row.prNumber" type="text" />
              </td>
              <td>
                <input v-model="row.description" type="text" />
              </td>
              <td>
                <select v-model="row.status">
                  <option value="WAITING FOR ATTACHMENTS">WAITING FOR ATTACHMENTS</option>
                  <option value="ATTACHED">ATTACHED</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </td>
              <td>
                <input type="file" @change="onFileChange($event, index)" />
                <a v-if="row.file" :href="row.file.url" target="_blank">{{ row.file.name }}</a>
              </td>
              <td>
                <input v-model="row.remarks" type="text" />
              </td>
              <td>
                <input v-model="row.nextStep" type="text" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Monitoring',
    data() {
      return {
        tableData: [
          {
            prNumber: '',
            description: '',
            status: '',
            file: null,
            remarks: '',
            nextStep: ''
          },
          {
            prNumber: '',
            description: '',
            status: '',
            file: null,
            remarks: '',
            nextStep: ''
          },
          {
            prNumber: '',
            description: '',
            status: '',
            file: null,
            remarks: '',
            nextStep: ''
          },
          {
            prNumber: '',
            description: '',
            status: '',
            file: null,
            remarks: '',
            nextStep: ''
          },
          {
            prNumber: '',
            description: '',
            status: '',
            file: null,
            remarks: '',
            nextStep: ''
          },
          {
            prNumber: '',
            description: '',
            status: '',
            file: null,
            remarks: '',
            nextStep: ''
          }
        ]
      };
    },
    methods: {
      onFileChange(event, index) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.$set(this.tableData[index], 'file', {
              name: file.name,
              url: e.target.result
            });
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };
  </script>
  
  <!-- Link the external CSS file -->
  <style src="./monitoring.css"></style>
  
