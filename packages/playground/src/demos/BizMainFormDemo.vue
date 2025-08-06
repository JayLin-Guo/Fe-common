<template>
  <div class="demo-container">
    <div class="demo-section">
      <h4>基础表单容器</h4>
      <div class="demo-item">
        <BizMainForm>
          <el-form :model="formData" label-width="120px">
            <el-form-item label="用户名">
              <el-input
                v-model="formData.username"
                placeholder="请输入用户名"
              />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="formData.email" placeholder="请输入邮箱" />
            </el-form-item>
            <el-form-item label="角色">
              <el-select v-model="formData.role" placeholder="请选择角色">
                <el-option label="管理员" value="admin" />
                <el-option label="用户" value="user" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary">提交</el-button>
              <el-button>重置</el-button>
            </el-form-item>
          </el-form>
        </BizMainForm>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const formData = ref({
  username: '',
  email: '',
  role: '',
});
</script>

<style lang="scss" scoped>
.demo-container {
  .demo-section {
    h4 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
      color: #374151;
    }

    .demo-item {
      padding: 20px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
  }
}
</style>
