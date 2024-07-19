<template>
  <div class="add-container">
    <div class="uploadbox">
      <div
        class="uploadcont"
        @dragover.prevent="handleDragOver"
        @dragleave="handleDragLeave"
        @drop.prevent="handleDrop"
        :class="{ 'drag-over': isDragOver }"
      >
        <img :src="upload" alt="Upload Icon" />
        <p>Drag & Drop your file here or</p>
        <input
          type="file"
          ref="fileInput"
          @change="handleFileChange"
          style="display: none"
        />
        <button @click="chooseFile">Choose File</button>
        <p v-if="fileName">{{ truncatedFileName }}</p>
      </div>
      <div class="idkanymore">
        <input v-model="templateName" type="text" placeholder="Template Name" />
        <button @click="uploadTemplate">Upload Template</button>
      </div>
    </div>

    <div class="template-table">
      <h2>Uploaded Templates</h2>
      <table>
        <thead>
          <tr>
            <th>Template Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="template in templates" :key="template.id">
            <td>{{ template.templateName }}</td>
            <td>
              <button @click="removeTemplate(template.id)">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import upload from "@/assets/upload.png";
import { storage, db } from "@/firebaseConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  data() {
    return {
      upload,
      file: null,
      fileName: "",
      templateName: "",
      templates: [],
      loading: false, // Track loading state for remove operation
      isDragOver: false,
    };
  },
  computed: {
    truncatedFileName() {
      const maxLength = 20; // Example maximum length
      if (this.fileName.length > maxLength) {
        return this.fileName.substring(0, maxLength) + "...";
      } else {
        return this.fileName;
      }
    },
  },
  async created() {
    await this.fetchTemplates();
  },
  methods: {
    chooseFile() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.file = file;
        this.fileName = file.name;
      } else {
        this.file = null;
        this.fileName = "";
      }
    },
    async uploadTemplate() {
      if (!this.file || !this.templateName) {
        toast.error("Please choose a file and enter a template name.", {
          position: "bottom-right",
          duration: 5000,
        });
        return;
      }

      const loadingToast = toast.loading("Uploading template...", {
        position: "bottom-right",
        hideProgressBar: true,
      });

      try {
        const storageRef = ref(storage, `templates/${this.fileName}`);

        const snapshot = await uploadBytes(storageRef, this.file);

        const downloadURL = await getDownloadURL(snapshot.ref);

        const docRef = await addDoc(collection(db, "templates"), {
          fileName: this.fileName,
          templateName: this.templateName,
          downloadURL,
          timestamp: new Date(),
        });

        toast.update(loadingToast, {
          render: "Uploaded!",
          type: toast.TYPE.SUCCESS,
          autoClose: 2000,
          isLoading: false,
        });

        // Add newly uploaded template to the local array
        this.templates.push({
          id: docRef.id,
          fileName: this.fileName,
          templateName: this.templateName,
        });

        // Reset the form after uploading
        this.file = null;
        this.fileName = "";
        this.templateName = "";
        this.$refs.fileInput.value = "";
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Error uploading file. Please try again.", {
          position: "bottom-right",
          duration: 5000,
        });
      }
    },
    async fetchTemplates() {
      try {
        const querySnapshot = await getDocs(collection(db, "templates"));
        this.templates = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching templates:", error);
        toast.error("Error fetching templates. Please try again.", {
          position: "bottom-right",
          duration: 5000,
        });
      }
    },
    async removeTemplate(templateId) {
      try {
        this.loading = true; // Set loading state to true

        // Display loading toast
        const loadingToast = toast.loading("Removing template...", {
          position: "bottom-right",
          hideProgressBar: true,
        });

        // Remove template from Firestore
        await deleteDoc(doc(db, "templates", templateId));

        // Update local array to reflect the removal
        this.templates = this.templates.filter(
          (template) => template.id !== templateId
        );

        toast.update(loadingToast, {
          render: "Removed!",
          type: toast.TYPE.SUCCESS,
          autoClose: 2000,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error removing template:", error);
        toast.error("Error removing template. Please try again.", {
          position: "bottom-right",
          duration: 5000,
        });
      } finally {
        this.loading = false;
        toast.clear(loadingToast);
      }
    },
    handleDragOver(event) {
      event.preventDefault();
      this.isDragOver = true;
    },
    handleDragLeave() {
      this.isDragOver = false;
    },
    handleDrop(event) {
      const file = event.dataTransfer.files[0];
      if (file) {
        this.file = file;
        this.fileName = file.name;
      }
      this.isDragOver = false;
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

.add-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.uploadbox {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: aliceblue;
  width: 900px;
  height: 300px;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0px 10px 50px 6px rgba(0, 0, 0, 0.1);
  margin: 20px 0px 40px 0px;
  gap: 20px;
}

.uploadbox img {
  width: 80px;
  margin-bottom: 20px;
}

.uploadbox button {
  padding: 10px 20px;
  background-color: #42498c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  margin: 10px 0;
  height: 40px;
}

.uploadbox button:hover {
  background-color: #30357f;
}

.uploadbox input[type="text"] {
  padding: 10px;
  margin-top: 20px;
  width: 400px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.uploadcont {
  border: 2px dashed gray;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  min-width: 350px;
  max-width: 3500px;
  height: 240px;
  border-radius: 20px;
}

.uploadcont.drag-over {
  border-color: #30357f;
  background-color: rgba(66, 73, 140, 0.1);
}

.uploadcont button {
  width: 200px;
}

.idkanymore {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.template-table {
  margin-top: 20px;
  background-color: aliceblue;
  padding: 30px;
  border-radius: 20px;
  margin-bottom: 20px;
}

.template-table h2 {
  text-align: center;
  margin-bottom: 10px;
}

table {
  width: 1000px;
  margin: 0 auto;
  border-collapse: collapse;
}

table th {
  color: #30357f;
}

table th,
table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

table th {
  background-color: #f2f2f2;
  text-align: center;
}

table td button {
  display: block;
  margin: 0 auto;
  padding: 8px 16px;
  background-color: #42498c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

table td button:hover {
  background-color: #30357f;
}
</style>
