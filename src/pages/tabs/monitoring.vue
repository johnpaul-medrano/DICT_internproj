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
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in tableData" :key="index">
            <td>
              <input v-model="row.prNumber" @change="updateRow(index)" type="text" />
            </td>
            <td>
              <input v-model="row.description" @change="updateRow(index)" type="text" />
            </td>
            <td>
              <select v-model="row.status" @change="updateRow(index)">
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
              <input v-model="row.remarks" @change="updateRow(index)" type="text" />
            </td>
            <td>
              <input v-model="row.nextStep" @change="updateRow(index)" type="text" />
            </td>
            <td>
              <button @click="deleteRow(index)">Delete</button>
            </td>
          </tr>
          <tr>
            <td colspan="7">
              <button @click="addRow">Add Row</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import { initializeApp } from 'firebase/app';
  import { getAuth } from 'firebase/auth';
  import { getFirestore, doc, setDoc, getDocs, collection, addDoc, deleteDoc } from 'firebase/firestore';
  import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  
  
  const firebaseConfig = {
    apiKey: "AIzaSyB49eQ4TrCod9HyTAcNJqCFido3Sb9WPHI",
    authDomain: "dictapp-21983.firebaseapp.com",
    projectId: "dictapp-21983",
    storageBucket: "dictapp-21983.appspot.com",
    messagingSenderId: "672180765503",
    appId: "1:672180765503:web:de6516c6516a13707b498a",
    measurementId: "G-RQJ0PNMW5D"
  };
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  
  export default {
    name: 'Monitoring',
    data() {
      return {
        tableData: []
      };
    },
    async mounted() {
      const storedData = localStorage.getItem('tableData');
      if (storedData) {
        this.tableData = JSON.parse(storedData);
      } else {
        await this.fetchTableData();
      }
    },
    methods: {
      async fetchTableData() {
        try {
          const querySnapshot = await getDocs(collection(db, 'purchaseRequests'));
          this.tableData = querySnapshot.docs.map(doc => doc.data());
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      },
      async updateRow(index) {
        const prNumber = this.tableData[index].prNumber;
        if (!prNumber) {
          console.error('PR Number is required');
          return;
        }
        try {
          const prDocRef = doc(db, 'purchaseRequests', prNumber);
          await setDoc(prDocRef, this.tableData[index]);
        } catch (error) {
          console.error('Error updating row:', error);
        }
      },
      async onFileChange(event, index) {
        const file = event.target.files[0];
        const prNumber = this.tableData[index].prNumber;
        if (!file || !prNumber) {
          console.error('PR Number and file are required');
          return;
        }
        try {
          const storageRef = ref(storage, `attachments/${file.name}`);
          await uploadBytes(storageRef, file);
          const fileURL = await getDownloadURL(storageRef);
  
          this.tableData[index].file = {
            name: file.name,
            url: fileURL
          };
  
          await this.updateRow(index);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      },
      async deleteRow(index) {
        const prId = this.tableData[index].id;
        try {
          if (prId) {
            await deleteDoc(doc(db, 'purchaseRequests', prId));
          }
          this.tableData.splice(index, 1);
        } catch (error) {
          console.error('Error deleting row:', error);
        }
      },
      addRow() {
        this.tableData.push({
          prNumber: '',
          description: '',
          status: '',
          file: null,
          remarks: '',
          nextStep: ''
        });
      }
    }
  };
  </script>
  
  <style src="./monitoring.css"></style>
