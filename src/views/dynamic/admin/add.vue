<template>
  <div class="app-container">
    动态表单
    <el-form label-width="120px" :rules="rules" ref="ruleForm">
      <el-form-item label="发布者" prop="author">
        <el-input v-model="dynamic.author" />
      </el-form-item>
      <el-form-item label="动态内容">
        <el-input type="textarea" :rows="5" v-model="dynamic.text" />
      </el-form-item>

      <el-form-item label="上传视频">
        <el-upload
          class="upload-demo"
          action="http://localhost:9001/cycoss/fileoss/uploadFile"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :on-success="handleImageSuccess"
          multiple
          :limit="9"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>

      <!-- 上传视频组件 -->
      <el-form-item label="选择视频" prop="video">
        <el-upload
          action="http://localhost:9001/cycvod/video/uploadVideo"
          ref="upload"
          drag="true"
          :on-success="handleVideoSuccess"
          :auto-upload="true"
          :limit="1"
          :data="form"
        >
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveDynamic"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import dynamic from "@/api/dynamic";
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";

export default {
  components: { ImageCropper, PanThumb },
  data() {
    var validateAuthor = (rule, value, callback) => {
      if (this.dynamic.author === "") {
        callback(new Error("请输入发布者"));
      } else {
        callback();
      }
    };
    return {
      fileList: [],
      dynamic: {}, //表单数据
      saveBtnDisabled: false, //按钮是否不可操作
      BASE_API: process.env.BASE_API, // 接口API地址
      imagecropperShow: false, //是否显示上传组件
      imagecropperKey: 0, //上传组件id
      rules: {
        author: [{ validator: validateAuthor, trigger: "blur" }],
      },
    };
  },
  created() {
    this.init();
  },
  watch: {
    //侦听属性，当有数据发生变化时调用方法
    $route(to, from) {
      this.init();
    },
  },
  methods: {
    init() {
      console.log("清空数据！！");
      this.dynamic = {};
      this.dynamic.images = "";
    },
    //添加视频
    saveDynamic() {
      dynamic.addDynamic(this.dynamic).then((response) => {
        //提示成功
        this.$message({
          type: "success",
          message: "添加成功!",
        });
        //路由跳转
        this.$router.push({ path: "/dynamic/list" });
      });
    },

    close() {
      this.imagecropperShow = false;
      // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1;
    },
    cropSuccess(data) {
      //拿url，进行赋值
      console.log(data);
      this.dynamic.images = data.url;
      //关闭窗口
      this.close();
    },
    handleVideoSuccess(response) {
      this.dynamic.video = response.data.vid;
    },
    handleImageSuccess(response) {
      if (this.dynamic.images.length === 0) {
        this.dynamic.images = response.data.url;
      } else {
        this.dynamic.images = this.dynamic.images + " " + response.data.url;
      }
      console.log(this.dynamic.images);
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 10 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
  },
};
</script>