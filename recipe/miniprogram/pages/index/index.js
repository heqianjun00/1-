import api from '../../utils/api'
import tables from '../../utils/tables'

Page({
    data: {
        types: [
            {
                src: "../../imgs/index_07.jpg",
                typename: "营养菜谱"
            },
            {
                src: "../../imgs/index_09.jpg",
                typename: "儿童菜谱"
            },
        ],
        recipes:[
            {
                recipeName:"烤苏格兰蛋",
                src:"../../imgs/1.jpg"
            },
            {
                recipeName:"法国甜点",
                src:"../../imgs/2.jpg"
            },
            {
                recipeName:"法式蓝带芝心猪排",
                src:"../../imgs/3.jpg"
            },
            {
                recipeName:"菠萝煎牛肉扒",
                src:"../../imgs/4.jpg"
            },
            {
                recipeName:"快手营养三明治",
                src:"../../imgs/5.jpg"
            },
            {
                recipeName:"顶级菲力牛排",
                src:"../../imgs/6.jpg"
            }
        ],
        userInfo:[], //用户信息
    },
    onLoad(){
        
        this.setData({
            userInfo:wx.getStorageSync('userInfo')
        })
        this._findTypeTwo()
    },
    onShow(){
        this._findRecipes()
    },
    //查询发布的热门菜单
    async _findRecipes(){
       let promise = wx.cloud.callFunction({
            name:"findAll",
            data:{
                tables:tables.tables.recipeTable,
                condition:{status:1},
                orderBy:{field:"views",sort:"desc"}
            }
        })
        let res = await promise
        let allPromise = []
         //根据菜谱的_openid查出发布菜谱的用户的信息
        res.result.data.map(item=>{
            let condition={
                _openid:item._openid,
            }
           let promise = api._search(tables.tables.userTable,condition)
           allPromise.push(promise)
        })
        let allUsers = await Promise.all(allPromise)
        //console.log(allUsers);
        res.result.data.forEach((item,index)=>{
            item.userInfo = allUsers[index].data[0].userInfo
        })
         this.setData({
            recipes:res.result.data.splice(0,9)
        })
        
    },
    _goType(){
        wx.navigateTo({
          url: '../type/type',
        })
    },
    //分页查出导航栏的两个菜谱
    _findTypeTwo(){
        api._searchPage(tables.tables.typeTable,2,2).then(res=>{
           // console.log(res);
            this.setData({
                types:res.data
            })
        })
    },
    _goList(e){
        //console.log(e.currentTarget.dataset);
        //flag 1表示是导航栏菜谱进入list页面的，2表示热门菜谱进入list页面的，如果是其他表示搜索页面进入list页面的
        let {flag,id,typename} = e.currentTarget.dataset
        wx.navigateTo({
          url: '../list/list?flag='+flag+'&id='+id+'&typename='+typename,
        })
    },
    //跳转到详情页面
    _goDetail(e){
        let {id,recipename,username,userimg} = e.currentTarget.dataset
        wx.navigateTo({
          url: '../detail/detail?id='+id+'&recipename='+recipename+'&username='+username+'&userimg='+userimg,
        })
    }
})