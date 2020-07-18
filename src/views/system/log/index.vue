<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="登录时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button v-permission="['system:log:query']" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-permission="['system:log:del']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除
        </el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="logList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" prop="user_log_id" width="100" />
      <el-table-column label="用户帐号" prop="user.user_name" width="100" />
      <el-table-column label="IP" prop="ip" width="120" />
      <el-table-column label="UA" prop="ua" :show-overflow-tooltip="true" />
      <el-table-column label="登录时间" prop="create_time" width="150" />
    </el-table>
    <pagination
      :total="total"
      :page="queryParams.page"
      :limit="queryParams.limit"
      @pagination="handlePageChange"
    />
  </div>
</template>

<script>
import { listLog, delLog } from '@/api/system/user-log'
import Pagination from '@/components/Pagination'
export default {
  name: 'Log',
  components: { Pagination },
  data() {
    return {
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 日期
      dateRange: [],
      // 查询参数
      queryParams: {
        page: 1,
        limit: 20,
        date: []
      },
      // 总数
      total: 0,
      // 日志列表
      logList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.queryParams.date = this.dateRange
      listLog(this.queryParams).then(response => {
        this.logList = response.data.logs
        this.total = response.data.total
        this.loading = false
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.user_log_id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 分页改变 */
    handlePageChange(arg) {
      this.queryParams.page = arg.page
      this.queryParams.limit = arg.limit
      this.getList()
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const log_ids = row.user_log_id ? [row.user_log_id] : this.ids
      this.$confirm('是否确认删除日志编号为"' + log_ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delLog(log_ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    }
  }
}
</script>

