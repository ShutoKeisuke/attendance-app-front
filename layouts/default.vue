<template>
  <v-app light>
    <!-- <v-card
      class="overflow-hidden"
    > -->
      <v-app-bar max-height="80">
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Title</v-toolbar-title>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        absolute
        temporary
      >
        <v-list
          nav
          dense
        >
          <v-list-item-group
            v-model="group"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Acouont</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>

      </v-navigation-drawer>
    <!-- </v-card> -->
    <!-- <div>{{drawer}}</div>
    <div>{{group}}</div> -->
    <Nuxt />
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      group: null  // list-item-groupの中のitemのどれを選択したのか（選択時に値が格納される）
    }
  }
}
</script>
