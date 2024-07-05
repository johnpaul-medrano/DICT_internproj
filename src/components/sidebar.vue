<template>
  <div class="sidebarbox">
    <div class="logocontainer">
      <img :src="workforce" alt="ILCDB logo" class="logo" />
    </div>
    <div class="bottom">
      <ul>
        <li @click="toggleSubMenu">
          <img :src="icon1" alt="icon" />
          Purchase Request
        </li>
        <ul v-if="isSubMenuVisible" class="sub-menu">
          <router-link class="haha" to="/mainpage/prform">
            <div class="menu">
              <li>SVP</li>
            </div>
          </router-link>
          <router-link class="haha" to="/mainpage/prform">
            <div class="menu">
              <li>For bidding</li>
            </div>
          </router-link>
        </ul>
        <div class="menu">
          <router-link class="lol" to="/mainpage/monitoring">
            <li>
              <img :src="icon2" alt="icon" />
              Monitoring
            </li>
          </router-link>
        </div>
        <div class="menu">
          <router-link class="lol" to="/mainpage/suppliers-database">
            <li>
              <img :src="icon3" alt="icon" />
              Suppliers Database
            </li>
          </router-link>
        </div>
        <div class="menu">
          <router-link class="lol" to="/mainpage/templates">
            <li>
              <img :src="icon4" alt="icon" />
              Templates
            </li>
          </router-link>
        </div>
        <div class="menu">
          <router-link class="lol" to="/mainpage/request">
            <li>
              <img :src="icon5" alt="icon" />
              Request
            </li>
          </router-link>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
import workforce from "@/assets/workforcey.png";
import icon1 from "@/assets/purchase-req 1.png";
import icon2 from "@/assets/monitoring 1.png";
import icon3 from "@/assets/database 1.png";
import icon4 from "@/assets/templates 1.png";
import icon5 from "@/assets/application 1.png";

export default {
  data() {
    return {
      workforce,
      icon1,
      icon2,
      icon3,
      icon4,
      icon5,
      isSubMenuVisible: false,
    };
  },
  methods: {
    toggleSubMenu() {
      this.isSubMenuVisible = !this.isSubMenuVisible;
    },
  },
};
</script>

<style scoped src="./sidebar.css"></style>
