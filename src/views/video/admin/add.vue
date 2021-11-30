<template>
  <div class="app-container">
    视频表单
    <el-form label-width="120px" :rules="rules" ref="ruleForm">
      <el-form-item label="视频标题">
        <el-input v-model="video.title" />
      </el-form-item>
      <el-form-item label="视频简介">
        <el-input v-model="video.intro" />
      </el-form-item>

      <el-form-item label="作者" prop="author">
        <el-input v-model="video.author" />
      </el-form-item>

      <!-- 用户头像 -->
      <el-form-item label="视频封面">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="video.image" />
        <!-- 文件上传按钮 -->
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="imagecropperShow = true"
          >选择封面</el-button
        >

        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调-->
        <image-cropper
          v-show="imagecropperShow"
          :width="320"
          :height="180"
          :key="imagecropperKey"
          :url="BASE_API + '/cycoss/fileoss/uploadFile'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>

      <!-- 上传视频组件 -->
      <el-form-item label="选择视频" prop="video">
        <el-upload
        action="http://localhost:9001/cycvod/video/uploadVideo"
          ref="upload"
          drag=true
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
          @click="saveVideo"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import video from "@/api/video";
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";

export default {
  components: { ImageCropper, PanThumb },
  data() {
    var validateAuthor = (rule, value, callback)=>{
      if(this.video.author===""){
        callback(new Error("请输入视频创作者"))
      }else{
        callback()
      }
    };
    return {
      video: {}, //表单数据
      saveBtnDisabled: false, //按钮是否不可操作
      BASE_API: process.env.BASE_API, // 接口API地址
      imagecropperShow: false, //是否显示上传组件
      imagecropperKey: 0, //上传组件id
      rules: {
        author: [{ validator: validateAuthor, trigger: "blur" }],
      }
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
        this.video = {};
    },
    //添加视频
    saveVideo() {
      video.addVideo(this.video).then((response) => {
        //提示成功
        this.$message({
          type: "success",
          message: "添加成功!",
        });
        //路由跳转
        this.$router.push({ path: "/video/list" });
      });
    },

    close() {
      this.imagecropperShow = false;
      // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1;
    },
    cropSuccess(data) {
      //拿url，进行赋值
      console.log(data)
      this.video.image = data.url;
      //关闭窗口
      this.close();
    },
    handleVideoSuccess(response){
        this.video.vid = response.data.vid
    }
  },
};
</script>