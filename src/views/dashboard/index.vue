<template>
  <div class="dashboard-container">
    <el-row :gutter="8">
      <el-col :span="6"><el-link type="primary" href="https://github.com/bigfool-cn/vue-element-admin-express">Node版github仓库</el-link></el-col>
      <el-col :span="6"><el-link type="primary" href="https://gitee.com/bigfool-cn/vue-element-admin-express">Node版gitee仓库</el-link></el-col>
      <el-col :span="6"><el-link type="success" href="https://github.com/bigfool-cn/go-element-admin">Golang版github仓库</el-link></el-col>
      <el-col :span="6"><el-link type="success" href="https://gitee.com/bigfool-cn/go-element-admin">Golang版gitee仓库</el-link></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
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
