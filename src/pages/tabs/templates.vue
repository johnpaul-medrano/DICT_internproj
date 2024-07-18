<template>
  <div class="templates-container">
    <div class="pdf-list">
      <div v-if="loading" class="loading-indicator">Loading templates...</div>
      <PdfCards
        v-else
        v-for="pdf in pdfs"
        :key="pdf.id"
        :title="pdf.templateName"
        :pdfPath="pdf.downloadURL"
        :downloadName="pdf.fileName"
      />
    </div>
  </div>
</template>

<script>
import PdfCards from "@/components/pdf-cards.vue";
import { db } from "@/firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default {
  components: {
    PdfCards,
  },
  data() {
    return {
      pdfs: [],
      loading: true, // Loading indicator state
    };
  },
  async created() {
    await this.fetchTemplates();
  },
  methods: {
    async fetchTemplates() {
      try {
        const q = query(
          collection(db, "templates"),
          orderBy("timestamp", "asc")
        );
        const querySnapshot = await getDocs(q);
        const templates = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        this.pdfs = templates;
        this.loading = false; // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error fetching templates:", error);
        // Handle error if needed
      }
    },
  },
};
</script>

<style scoped>
* {
  font-family: "Poppins", "sans-serif";
}

.templates-container {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  padding: 10px;
}

.pdf-list {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
  width: 90%;
  height: 100%;
}

.loading-indicator {
  margin: 20px;
  font-size: 1.2rem;
  color: #666;
}
</style>
