<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline" ref="refs">
      <el-form-item>
        <el-input v-model="dynamicQuery.author" placeholder="作者" />
      </el-form-item>

      <el-form-item>
        <el-input v-model="dynamicQuery.text" placeholder="内容" />
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="dynamicQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="dynamicQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button
        type="primary"
        icon="el-icon-search"
        @click="getDynamicPageQuery()"
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

      <el-table-column prop="author" label="作者" width="80" />

      <el-table-column prop="text" label="动态内容" />

      <el-table-column label="图片墙">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="showImage(scope.row.images)"
            ref="btn"
            size="mini"
          >
            查看图片
          </el-button>
        </template>
      </el-table-column>

      <el-dialog
        :visible.sync="imageVisible"
        width="50%"
        height="50%"
        :before-close="handleCloseImage"
        :append-to-body="true"
      >
        <el-carousel indicator-position="outside">
          <el-carousel-item v-for="item in imageList" :key="item" style="text-align:center">
            <el-image
              style="width: 60%; height: 100%"
              :src="item"
              :fit="fit"
            ></el-image>
          </el-carousel-item>
        </el-carousel>
      </el-dialog>

      <el-table-column label="动态视频">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="playVideo(scope.row.video)"
            ref="btn"
            size="mini"
          >
            播 放
          </el-button>
        </template>
      </el-table-column>

      <el-dialog
        :title="videoTitle"
        :visible.sync="videoVisible"
        width="680px"
        heigth="400px"
        top="15vh"
        :before-close="handleCloseVideo"
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
      @current-change="getDynamicPageQuery"
    />
  </div>
</template>

<script>
import dynamic from "@/api/dynamic";
import video from "@/api/video";

export default {
  data() {
    return {
      imageList: [],
      videoTitle: "",
      videoImage: "",
      videoUrl: "",
      imageVisible: false,
      videoVisible: false,
      current: 1, //页码
      limit: 10, //每页多少行
      dynamicQuery: {}, //查询条件
      list: [], //列表数据
      total: 0, //总记录数
    };
  },
  created() {
    this.getDynamicPageQuery();
  },
  methods: {
    resetData() {
      this.dynamicQuery = {};
      this.getDynamicPageQuery();
    },
    getDynamicPageQuery(current = 1) {
      this.current = current;
      dynamic
        .getDynamicPage(this.current, this.limit, this.dynamicQuery)
        .then((response) => {
          console.log(response);
          this.list = response.data.list;
          this.total = response.total;
        });
    },

    //删除视频
    removeDataById(id) {
      this.$confirm("此操作将永久删除该动态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          dynamic.delDynamic(id).then((response) => {
            //删除成功
            console.log("删除成功");
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            //刷新表格
            this.getDynamicPageQuery();
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
      this.videoVisible = true;
    },
    handleCloseVideo() {
      this.videoVisible = false;
      this.videoUrl = "";
    },

    //展示图片墙
    showImage(images) {
      dynamic.getUrlFromImages(images).then((response) => {
        this.imageList = response.data.imageList;
      });
      this.imageVisible = true;
    },

    handleCloseImage() {
      this.imageVisible = false;
      this.imageList = [];
    },
  },
};
</script>
