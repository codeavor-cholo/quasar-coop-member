<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="bg-teal text-white">
      <q-toolbar>
        <!-- <q-btn dense flat round icon="menu" @click="left = !left" /> -->

        <q-toolbar-title >
          <q-avatar>
            <img src="statics/New-GSIS-Cooperative.png">
          </q-avatar>
          <span style="font-size:.8em" class="q-pl-sm">New GSIS Cooperative</span>
        </q-toolbar-title>
        <q-btn color="white" flat icon="settings" dense/>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" side="left" overlay bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-grey-3 text-grey-8" >
        <q-tabs
          v-model="tab"
          no-caps
          dense
        >
          <q-route-tab name="mails" icon="home" label="Home" class="tabs1" to="/"/>
          <q-route-tab name="movies" icon="payment" label="Transactions" class="tabs1" to="/transactions"/>
          <q-route-tab name="alarms" icon="notifications" label="Notifications" class="tabs1" to="/notifications"/>
          <q-tab name="menu" icon="menu" label="Menu" class="tabs1"/>
        </q-tabs>
    </q-footer>

  </q-layout>
</template>
<style>
  
  .tabs1 div .q-tab__label {
    font-size: .7em;
  }
</style>
<script>
export default {
  data () {
    return {
      left: false,
      tab: 'mails'
    }
  }
}
</script>