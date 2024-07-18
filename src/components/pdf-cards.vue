<template>
  <div class="pdf-card">
    <img src="@/assets/pdfff.png" alt="PDF Icon" class="pdf-icon" />
    <div class="pdf-info">
      <h3>{{ title }}</h3>
      <button id="download" @click="downloadPdf">Download</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    pdfPath: {
      type: String,
      required: true,
    },
    downloadName: {
      type: String,
      required: true,
    },
  },
  methods: {
    downloadPdf() {
      const link = document.createElement("a");
      link.href = this.pdfPath;
      link.download = this.downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
};
</script>

<style scoped>
* {
  font-family: Poppins;
}
.pdf-card {
  border: 0.5px solid #230776;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 300px;
  height: 310px;
  border-radius: 20px;
  background-color: aliceblue;
  transition: all 0.3s;
}

.pdf-card:hover {
  transform: translateY(-20px);
  cursor: pointer;
  background-color: rgb(230, 229, 248);
}

.pdf-icon {
  width: 150px;
  height: 150px;
}

.pdf-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  font-size: 17px;
}

#download {
  width: 120px;
  height: 45px;
  background-color: #004387;
  color: white;
  border-radius: 10px;
  border: none;
  margin-top: 20px;
}

#download:hover {
  background-color: #003366;
  cursor: pointer;
}
</style>
