import request from '@/utils/request'

export default {
    //带条件分页查询视频列表
    getVideoPage(current, limit, videoQuery) {
        return request({
            url: `/cycservice/cycvideo/getVideoPage/${current}/${limit}`,
            method: 'post',
            data: videoQuery //转化json传递
        })
    },
    //删除视频
    delVideo(vid) {
        return request({
            url: `/cycservice/cycvideo/delVideo/${vid}`,
            method: 'delete',
        })
    },

    //添加视频
    addVideo(video) {
        return request({
            url: '/cycservice/cycvideo/addVideo',
            method: 'post',
            data: video
        })
    },

    //根据视频id获取播放凭证
    // getPlayAuth(vid) {
    //     return request({
    //         url: `/cycvod/video/getPlayAuth/${vid}`,
    //         method: 'get',
    //     })
    // },

    //根据视频vid获取url
    getUrl(vid) {
        return request({
            url: `/cycvod/video/getUrl/${vid}`,
            method: 'get',
        })
    },

    //根据vid查询视频
    getVideoById(vid){
        return request({
            url: `/cycservice/cycvideo/getVideoById/${vid}`,
            method: 'get',
        })
    }

}