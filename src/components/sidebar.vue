<template>
  <div class="sidebarbox">
    <div class="logocontainer">
      <img
        :src="'/src/assets/' + currentLogo + 'y.png'"
        alt="ILCDB logo"
        class="logo"
        @click="navigateToProjects"
      />
    </div>
    <div class="bottom">
      <ul>                
        <div class="menu">
          <router-link v-if="canAccess('Abstract')" :to="`/mainpage/${currentLogo}/abstract`" class="lol">
            <li :class="{ active: isActive('/mainpage/' + currentLogo + '/abstract') }">
              <img :src="icon6" alt="icon" />
              Abstract
            </li>
          </router-link>
        </div>
        <div class="menu">
          <router-link v-if="canAccess('For Approval C')" :to="`/mainpage/${currentLogo}/RD_approval`" class="lol">
            <li :class="{ active: isActive('/mainpage/' + currentLogo + '/RD_approval') }">
              <img :src="icon6" alt="icon" />
              For Approval
            </li>
          </router-link>
        </div>
        <div class="menu">
          <router-link v-if="canAccess('For Approval')" :to="`/mainpage/${currentLogo}/TOD_approval`" class="lol">
            <li :class="{ active: isActive('/mainpage/' + currentLogo + '/TOD_approval') }">
              <img :src="icon6" alt="icon" />
              For Approval
            </li>
          </router-link>
        </div>
        <div class="menu">
          <router-link v-if="canAccess('For Approval B')" :to="`/mainpage/${currentLogo}/budget_approval`" class="lol">
            <li :class="{ active: isActive('/mainpage/' + currentLogo + '/budget_approval') }">
              <img :src="icon6" alt="icon" />
              For Approval 
            </li>
          </router-link>
        </div>
        <!-- Purchase Request, visible to ILCDB -->
        <li v-if="canAccess('Purchase Request')" @click="toggleSubMenu" :class="{ active: isActive('/mainpage/' + currentLogo + '/prform') }">
          <img :src="icon1" alt="icon" />
          Purchase Request
        </li>
        <ul v-if="isSubMenuVisible && canAccess('Purchase Request')" class="sub-menu">
          <router-link :to="`/mainpage/${currentLogo}/prformsvp`" class="sub-menu-link">
            <li :class="{ active: isActive('/mainpage/' + currentLogo + '/prformsvp') }">
              Small Value Procurement
            </li>
          </router-link>
          <router-link :to="`/mainpage/${currentLogo}/prformfb`" class="sub-menu-link">
            <li :class="{ active: isActive('/mainpage/' + currentLogo + '/prformfb') }">
              For Bidding
            </li>
          </router-link>
        </ul>
        <!-- Monitoring, visible to all roles -->
        <div class="menu">
          <router-link v-if="canAccess('Monitoring')" :to="`/mainpage/${currentLogo}/monitoring`" class="lol">
            <li :class="{ active: isActive('/mainpage/' + currentLogo + '/monitoring') }">
              <img :src="icon2" alt="icon" />
              Monitoring
            </li>
          </router-link>
        </div>
        <!-- Suppliers Database, visible to ILCDB -->
        <div class="menu">
          <router-link v-if="canAccess('Database')" :to="`/mainpage/${currentLogo}/suppliers-database`" class="lol">
            <li :class="{ active: isActive('/mainpage/' + currentLogo + '/suppliers-database') }">
              <img :src="icon3" alt="icon" />
              Suppliers Database
            </li>
          </router-link>
        </div>
        <!-- Templates, visible to ILCDB -->
        <div class="menu">
          <router-link v-if="canAccess('Templates')" :to="`/mainpage/${currentLogo}/templates`" class="lol">
            <li :class="{ active: isActive('/mainpage/' + currentLogo + '/templates') }">
              <img :src="icon4" alt="icon" />
              Templates
            </li>
          </router-link>
        </div>
        <!-- Request, visible to ILCDB -->
        <div class="menu">
          <router-link v-if="canAccess('Request')" :to="`/mainpage/${currentLogo}/request`" class="lol">
            <li :class="{ active: isActive('/mainpage/' + currentLogo + '/request') }">
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
import { mapGetters } from "vuex";
import workforce from "@/assets/workforcey.png";
import icon1 from "@/assets/purchase-req 1.png";
import icon2 from "@/assets/monitoring 1.png";
import icon3 from "@/assets/database 1.png";
import icon4 from "@/assets/templates 1.png";
import icon5 from "@/assets/application 1.png";
import icon6 from "@/assets/approval.png";

export default {
  data() {
    return {
      workforce,
      icon1,
      icon2,
      icon3,
      icon4,
      icon5,
      icon6,
      isSubMenuVisible: false,
    };
  },
  computed: {
    ...mapGetters(["currentLogo"]),
    userRole() {
      return localStorage.getItem("userRole");
    }
  },
  methods: {
    canAccess(feature) {
      const roleFeatures = {
        "ILCDB": ["Purchase Request", "Monitoring", "Database", "Templates", "Request", ],
        "TOD Head": ["For Approval","Monitoring"],
        "Budget Division": ["For Approval B","Monitoring"],
        "RD": ["For Approval C","Monitoring"],
        "Supply Office": ["Monitoring", "Abstract"]
      };
      return roleFeatures[this.userRole].includes(feature);
    },
    toggleSubMenu() {
      this.isSubMenuVisible = !this.isSubMenuVisible;
    },
    isActive(route) {
      return this.$route.path.startsWith(route);
    },
    navigateToProjects() {
      this.$router.push({ name: "Projects" });
    },
  },
  watch: { 
    $route(to) {
      if (!to.path.startsWith(`/mainpage/${this.currentLogo}/prform`)) {
        this.isSubMenuVisible = false;
      }
    },
  },
};
</script>

<style scoped src="./sidebar.css"></style>
