import api from '../../utils/api'
import tables from '../../utils/tables'
const _ = api.db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
      imgs:[
        "../../static/detail/1.jpg",
        "../../static/detail/2.jpg",
        "../../static/detail/4.jpg",
        "../../static/detail/6.jpg",
        "../../static/detail/8.jpg",
      ],
      id:"",
      recipename:'',
      username:'',
      userimg:'',
      recipeList:[],
      recipeType:[],
      isOn:false, //是否关注
  },
  onLoad(options){
    this.setData({
      id:options.id,
      recipename:options.recipename,
      username:options.username,
      userimg:options.userimg
    })
    wx.setNavigationBarTitle({
      title: this.data.recipename,
    })
    this. _findDetail()
  },
  //查询该道菜的详情
  async _findDetail(){
    let condition = {
      _id:this.data.id
    }
    let res = await api._search(tables.tables.recipeTable,condition)
    console.log(res.data);
    this.setData({
      recipeList:res.data[0],
      imgs:res.data[0].pics
    })
    //一进入详情页面，就让views字段加1
    let data = {
      views: _.inc(1)
    }
    api._edit(tables.tables.recipeTable,condition,data)
    this.data.recipeList.views++
    this.setData({
      recipeList:this.data.recipeList
    })
    //一进入页面就判断是否关注了该道菜
    if(res.data[0].follows>0){
      this.setData({
        isOn:!this.data.isOn
      })
    }
    //查询改道菜的类别
    let id = res.data[0].recipeTypeid
    let res1 = await api._searchOne(tables.tables.typeTable,id)
    this.setData({
      recipeType:res1.data
    })
  },
  _isOnHandle(){
    //1.改变isOn的值
    this.setData({
      isOn:!this.data.isOn
    })
    //2.改变数据库follws字段的值
    let condition = {
      _id:this.data.id
    }
      //3.更新页面follows的值
    if(!this.data.isOn){
      let data = {
        follows: _.inc(-1)
      }
      api._edit(tables.tables.recipeTable,condition,data)
      this.data.recipeList.follows--
      this.setData({
        isOn:false,
        recipeList:this.data.recipeList
      })
      //删除关注表中自己关注的数据
      let condition1 = {
        recipeid:this.data.id,
        _openid:wx.getStorageSync('openid')
      }
      api._delete(tables.tables.followsTable,condition1)
    }else{
      let data = {
        follows: _.inc(1)
      }
      api._edit(tables.tables.recipeTable,condition,data)
      this.data.recipeList.follows++
      this.setData({
        isOn:true,
        recipeList:this.data.recipeList
      })
      //4.向数据库关注表添加一条数据
      let data1 = {
        recipeid:this.data.id
      }
      api._add(tables.tables.followsTable,data1)
    }
   

  }
})