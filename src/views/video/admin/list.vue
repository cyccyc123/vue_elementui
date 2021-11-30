<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline" ref="refs">
      <el-form-item>
        <el-input v-model="videoQuery.title" placeholder="标题" />
      </el-form-item>

      <el-form-item>
        <el-input v-model="videoQuery.author" placeholder="作者" />
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="videoQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="videoQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button
        type="primary"
        icon="el-icon-search"
        @click="getVideoPageQuery()"
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

      <el-table-column prop="vid" label="视频ID" width="100" />

      <el-table-column prop="title" label="视频标题" width="100" />

      <el-table-column prop="author" label="作者" width="80" />

      <el-table-column prop="intro" label="视频简介" />

      <el-table-column prop="image" label="视频封面">
        <template slot-scope="scope">
          <el-image style="width: 100px; height: 100px" :src="scope.row.image">
          </el-image>
        </template>
      </el-table-column>

      <el-table-column prop="" label="视频预览">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="playVideo(scope.row.vid)"
            ref="btn"
            size="mini"
          >
            播 放
          </el-button>
        </template>
      </el-table-column>

      <el-dialog
      :title="videoTitle"
        :visible.sync="dialogVisible"
        width="680px"
        heigth="400px"
        top="15vh"
        :before-close="handleClose"
        :append-to-body="true"
      >
        <video
          :src="videoUrl"
          :poster="videoImage"
          controls
          class="video"
          :ref="dialogVideo"
          width="100%"
        ></video>
      </el-dialog>

      <el-table-column prop="gmtCreate" label="添加时间" width="160" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.vid)"
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
      @current-change="getVideoPageQuery"
    />
  </div>
</template>

<script>
import video from "@/api/video";

export default {
  data() {
    return {
      videoTitle: "",
      videoImage: "",
      videoUrl: "",
      dialogVisible: false,
      current: 1, //页码
      limit: 10, //每页多少行
      videoQuery: {}, //查询条件
      list: [], //列表数据
      total: 0, //总记录数
    };
  },
  created() {
    this.getVideoPageQuery();
  },

  mounted() {
    this.$refs.btn.onclik(function () {
      if (this.$refs.dialogVideo.paused) {
        this.$refs.dialogVideo.play();
      } else {
        this.$refs.dialogVideo.pause();
      }
    });
  },
  methods: {
    resetData() {
      this.videoQuery = {};
      this.getVideoPageQuery();
    },
    getVideoPageQuery(current = 1) {
      this.current = current;
      video
        .getVideoPage(this.current, this.limit, this.videoQuery)
        .then((response) => {
          console.log(response);
          this.list = response.data.list;
          this.total = response.total;
        });
    },

    //删除视频
    removeDataById(vid) {
      this.$confirm("此操作将永久删除该视频, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          video.delVideo(vid).then((response) => {
            //删除成功
            console.log("删除成功");
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            //刷新表格
            this.getVideoPageQuery();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //播放视频
    playVideo(vid) {
      video.getUrl(vid).then((response) => {
        this.videoUrl = response.data.url;
      });
      video.getVideoById(vid).then((response) => {
        this.videoImage = response.data.video.image;
        this.videoTitle = response.data.video.title;
      });
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
      this.videoUrl = "";
    },
  },
};
</script>
