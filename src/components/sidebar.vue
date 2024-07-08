<template>
  <div class="sidebarbox">
    <div class="logocontainer">
      <img
        :src="'/src/assets/' + currentLogo + 'y.png'"
        alt="ILCDB logo"
        class="logo"
      />
    </div>
    <div class="bottom">
      <ul>
        <li
          @click="toggleSubMenu"
          :class="{ active: isActive('/mainpage/' + currentLogo + '/prform') }"
        >
          <img :src="icon1" alt="icon" />
          Purchase Request
        </li>
        <ul v-if="isSubMenuVisible" class="sub-menu">
          <router-link
            :to="`/mainpage/${currentLogo}/prformsvp`"
            class="sub-menu-link"
          >
            <li
              :class="{
                active: isActive('/mainpage/' + currentLogo + '/prformsvp'),
              }"
            >
              SVP
            </li>
          </router-link>
          <router-link
            :to="`/mainpage/${currentLogo}/prformfb`"
            class="sub-menu-link"
          >
            <li
              :class="{
                active: isActive('/mainpage/' + currentLogo + '/prformfb'),
              }"
            >
              For Bidding
            </li>
          </router-link>
        </ul>
        <div class="menu">
          <router-link :to="`/mainpage/${currentLogo}/monitoring`" class="lol">
            <li
              :class="{
                active: isActive('/mainpage/' + currentLogo + '/monitoring'),
              }"
            >
              <img :src="icon2" alt="icon" />
              Monitoring
            </li>
          </router-link>
        </div>
        <div class="menu">
          <router-link
            :to="`/mainpage/${currentLogo}/suppliers-database`"
            class="lol"
          >
            <li
              :class="{
                active: isActive(
                  '/mainpage/' + currentLogo + '/suppliers-database'
                ),
              }"
            >
              <img :src="icon3" alt="icon" />
              Suppliers Database
            </li>
          </router-link>
        </div>
        <div class="menu">
          <router-link :to="`/mainpage/${currentLogo}/templates`" class="lol">
            <li
              :class="{
                active: isActive('/mainpage/' + currentLogo + '/templates'),
              }"
            >
              <img :src="icon4" alt="icon" />
              Templates
            </li>
          </router-link>
        </div>
        <div class="menu">
          <router-link :to="`/mainpage/${currentLogo}/request`" class="lol">
            <li
              :class="{
                active: isActive('/mainpage/' + currentLogo + '/request'),
              }"
            >
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
  computed: {
    ...mapGetters(["currentLogo"]),
  },
  watch: {
    $route(to) {
      if (!to.path.startsWith(`/mainpage/${this.currentLogo}/prform`)) {
        this.isSubMenuVisible = false;
      }
    },
  },
  methods: {
    toggleSubMenu() {
      this.isSubMenuVisible = !this.isSubMenuVisible;
    },
    isActive(route) {
      return this.$route.path.startsWith(route);
    },
  },
};
</script>

<style scoped src="./sidebar.css"></style>
