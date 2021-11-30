import request from '@/utils/request'

export default {
    //带条件分页查询动态列表
    getDynamicPage(current, limit, dynamicQuery) {
        return request({
            url: `/cycservice/cycdynamic/getDynamicPage/${current}/${limit}`,
            method: 'post',
            data: dynamicQuery //转化json传递
        })
    },
    //删除
    delDynamic(id) {
        return request({
            url: `/cycservice/cycdynamic/delDynamic/${id}`,
            method: 'delete',
        })
    },

    //添加
    addDynamic(dynamic) {
        return request({
            url: '/cycservice/cycdynamic/addDynamic',
            method: 'post',
            data: dynamic
        })
    },

    //获取images的url
    getUrlFromImages(images){
        return request({
            url: '/cycservice/cycdynamic/getUrlFromImages',
            method: 'get',
            params: { images }
        })
    },


}