import tables from '../../utils/tables'
import api from '../../utils/api'
Page({
  data:{
    typeCategory:[], //菜谱分类
    files:[], //选择上传的图片
  },
  onShow(){
    this._findCategory()
  },
  //查询数据库中的菜谱分类
  _findCategory:function(){
    //调用查询云函数
    wx.cloud.callFunction({
      name:"findAll",
      data:{
       tables:tables.tables.typeTable,
       condition:{_openid:"oFuVe5ISO_vuERzzUC0BjmTZj1jk"}
      }
    }).then(res=>{
     // console.log(res.result.data);
      this.setData({
        typeCategory:res.result.data
      })
    })
  },
  //选择图片
  selectImg(e){
    let tempFilePaths = e.detail.tempFilePaths
    let files = tempFilePaths.map((item)=>{
      return {url:item}
    })
    files = this.data.files.concat(files) //数组拼接
    this.setData({
      files
    })
  },
  //删除图片
  deleteImg(e){
      let index = e.detail.index
      this.data.files.splice(index,1)
  },
  //发布上传
  async submit(e){
    let {recipename,recipeTypeid,recipesMake} = e.detail.value
  /*   
     recipename 菜谱名称
     recipeTypeid 分类id
     recipesMake 菜谱做法
     follows 收藏个数
     views 浏览量 
     status 状态 1表示正常 0表示删除
     time 创建时间
     pics:[] 图片地址
     */
    let follows = 0,views = 0,status = 1,time = new Date().getTime()
    let pics = await this.upload(this.data.files)
    let data = {
      recipename,recipeTypeid,recipesMake,follows,views,status,time,pics
    }
    if(recipename=="" || recipeTypeid=="" || recipesMake=="" || this.data.files.length==0){
      wx.showToast({
        title:'请把内容填写完整',
        icon:'error'
      })
      return false
    }
    api._add(tables.tables.recipeTable,data).then(res=>{
      if(res._id){
        wx.showToast({
          title: '发布成功',
        })
        setTimeout(()=>{
          wx.switchTab({
            url: '../my/my',
          })
        },2000)
      }
    })
  },
  //多图上传
  upload(val){
    let allPromise=[]
    val.forEach(item=>{
      let random = Math.floor(Math.random()*1000)
      let cloudPath =new Date().getTime() + '' +random + "." + item.url.split(".").pop()
      let promise= wx.cloud.uploadFile({
      cloudPath: "A-recipesImg/" + cloudPath,
      filePath:  item.url, // 文件路径
      })
      allPromise.push(promise)
    })
    return Promise.all(allPromise)
  },
})