import request from '@/utils/request'

export default {
    //带条件分页查询用户列表
    getUserPage(current, limit, userQuery) {
        return request({
            url: `/cycservice/cycuser/getUserPage/${current}/${limit}`,
            method: 'post',
            data: userQuery //转化json传递
        })
    },
    //删除用户
    delUser(id) {
        return request({
            url: `/cycservice/cycuser/delete/${id}`,
            method: 'delete',
        })
    },

    //添加用户
    addUser(user){
        return request({
            url: '/cycservice/cycuser/addUser',
            method: 'post',
            data: user
        })
    },

    //修改用户
    updateUser(user){
        return request({
            url: '/cycservice/cycuser/updateUser',
            method: 'post',
            data: user
        })
    },

    //根据id获取用户数据
    getUserById(id){
        return request({
            url: `/cycservice/cycuser/getUserById/${id}`,
            method: 'get'
        })
    }

}