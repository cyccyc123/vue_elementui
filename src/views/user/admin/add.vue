<template>
  <div class="app-container">
    用户表单
    <el-form :rules="rules" label-width="120px" ref="ruleForm">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="user.phone" />
      </el-form-item>
      <el-form-item label="用户名称" prop="name">
        <el-input v-model="user.name" />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-row>
          <el-col :span="22">
            <el-input :type="pwdType" v-model="user.password"
          /></el-col>
        </el-row>
        <el-col :span="2">
          <span class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye" /> </span
        ></el-col>
      </el-form-item>

      <el-form-item label="确认密码" prop="checkPass">
        <el-row>
          <el-col :span="22">
            <el-input :type="pwdType" v-model="checkPass"></el-input
          ></el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="用户头衔">
        <el-select v-model="user.member" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="0" label="普通用户" />
          <el-option :value="1" label="带会员" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户签名">
        <el-input v-model="user.intro" />
      </el-form-item>

      <!-- 用户头像 -->
      <el-form-item label="用户头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="user.avatar" />
        <!-- 文件上传按钮 -->
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="imagecropperShow = true"
          >更换头像</el-button
        >

        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调-->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API + '/cycoss/fileoss/uploadFile'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import user from "@/api/user";
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";

export default {
  components: { ImageCropper, PanThumb },
  data() {
    var validateName = (relu, value, callback) => {
      if (this.user.name === "") {
        callback(new Error("请输入昵称"));
      } else {
        callback();
      }
    };
    var validatePhone = (relu, value, callback) => {
      if (this.user.phone === "") {
        callback(new Error("请输入手机号"));
      } else {
        let isnum = /^\d+$/.test(this.user.phone)
        if(!isnum){
          callback(new Error("请输入正确的手机号"))
        }else{
          let length = this.user.phone.length
          if(length<3|length>13){
            callback(new Error("手机号长度过长/过短"))
          }
        }
        callback();
      }
    };
    var validatePass = (relu, value, callback) => {
      if (this.user.password === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (relu, value, callback) => {
      if (this.checkPass === "") {
        callback(new Error("请再次输入密码"));
      } else if (this.checkPass !== this.user.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      user: {}, //表单数据
      saveBtnDisabled: false, //按钮是否不可操作
      BASE_API: process.env.BASE_API, // 接口API地址
      imagecropperShow: false, //是否显示上传组件
      imagecropperKey: 0, //上传组件id
      pwdType: "password",
      checkPass: "",

      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
        phone: [{ validator: validatePhone, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
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
      if (this.$route.params && this.$route.params.id) {
        console.log("$route.params.id=" + this.$route.params.id);
        user.getUserById(this.$route.params.id).then((response) => {
          this.user = response.data.user;
        });
      } else {
        console.log("清空数据！！");
        this.user = {};
      }
    },
    //添加用户
    saveUser() {
      user.addUser(this.user).then((response) => {
        //提示成功
        this.$message({
          type: "success",
          message: "添加成功!",
        });
        //路由跳转
        this.$router.push({ path: "/user/list" });
      });
    },
    //修改用户
    updateUserInfo() {
      user.updateUser(this.user).then((response) => {
        //提示成功
        this.$message({
          type: "success",
          message: "修改成功!",
        });
        //路由跳转
        this.$router.push({ path: "/user/list" });
      });
    },
    saveOrUpdate() {
      if (this.user.id) {
        //id存在、执行修改
        this.updateUserInfo();
      } else {
        //id不存在、执行添加
        this.saveUser();
      }
    },
    close() {
      this.imagecropperShow = false;
      // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1;
    },
    cropSuccess(data) {
      //拿url，进行赋值
      this.user.avatar = data.url;
      //关闭窗口
      this.close();
    },
    showPwd() {
      console.log("click");
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$dark_gray: #889aa4;
.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  user-select: none;
}
</style>