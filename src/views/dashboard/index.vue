<template>
  <div class="dashboard-container">
    <el-row :gutter="8">
      <chat />
    </el-row>
  </div>
</template>

<script>
import Chat from './components/Chat'
export default {
  name: 'Dashboard',
  components: {
    Chat
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 30px 55px;
  background-color: rgb(255, 255, 255);
  position: relative;
}
</style>
