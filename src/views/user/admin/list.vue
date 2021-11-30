<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="userQuery.name" placeholder="用户名" />
      </el-form-item>

      <el-form-item>
        <el-input v-model="userQuery.phone" placeholder="手机号" />
      </el-form-item>

      <el-form-item>
        <el-select v-model="userQuery.level" clearable placeholder="用户头衔">
          <el-option :value="0" label="普通用户" />
          <el-option :value="1" label="带会员" />
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="userQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="userQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button
        type="primary"
        icon="el-icon-search"
        @click="getUserPageQuery()"
        >查询</el-button
      >
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (current - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="phone" label="手机号" width="150" />

      <el-table-column prop="name" label="昵称" width="150" />

      <el-table-column label="头衔" width="100">
        <template slot-scope="scope">
          {{ scope.row.member == 1 ? "带会员" : "普通用户" }}
        </template>
      </el-table-column>

      <el-table-column prop="intro" label="个人签名" width="280"/>

      <el-table-column label="用户头像" width="180">
        <template slot-scope="scope">
          <el-image style="width: 100px; height: 100px" :src="scope.row.avatar">
          </el-image>
        </template>
      </el-table-column>

      <el-table-column prop="gmtCreate" label="添加时间" width="160" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/user/add/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >修改</el-button
            >
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="current"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center"
      layout="total, prev, pager, next, jumper"
      @current-change="getUserPageQuery"
    />
  </div>
</template>

<script>
import user from "@/api/user";
export default {
  data() {
    return {
      current: 1, //页码
      limit: 10, //每页多少行
      userQuery: {}, //查询条件
      list: [], //列表数据
      total: 0, //总记录数
    };
  },
  created() {
    this.getUserPageQuery();
  },
  methods: {
    resetData() {
      this.userQuery = {};
      this.getuserPageQuery();
    },
    getUserPageQuery(current = 1) {
      this.current = current;
      user
        .getUserPage(this.current, this.limit, this.userQuery)
        .then((response) => {
          console.log(response);
          this.list = response.data.list;
          this.total = response.total;
        });
    },
    //删除用户
    removeDataById(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          user.delUser(id).then((response) => {
            //删除成功
            console.log("删除成功");
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            //刷新表格
            this.getUserPageQuery();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
