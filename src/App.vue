<template>
  <div id="q-app">
    <router-view :key="$route.params.type !== undefined ? $route.fullPath : ''"/>
  </div>
</template>

<script >
export default {
  name: 'App'
}
</script>
