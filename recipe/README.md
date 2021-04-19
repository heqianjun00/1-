### 使用的云函数开发

### 在clone到本地时，需要在云开发控制台的数据创建相应的数据表

### A-users 用户表

   ```
    字段：
    _id      唯一标识         自动生成
    _openid  唯一用户标识      自动生成
    userInfo 存储用户信息（对象）
   ```

### A-types 菜谱分类表

  ```
    字段：
    _id      唯一标识         自动生成
    _openid  唯一用户标识      自动生成
    typename 菜谱名称  
  ```

 ### A-recipes  菜谱表

  ```
    字段：
    _id      唯一标识         自动生成
    _openid  唯一用户标识     自动生成
    recipename 菜谱名称
    typeid   分类ID 
    pics:[] 图片地址
    makes： string  菜谱做法
    follows: 收藏个数
    views：  浏览次数
    status:  状态 1正常 0删除
    time：   添加时间
  ```

### A-follows 关注表

  ```
    字段：
    _id    唯一标识
    _openid 唯一用户标识
    recipeid 关注的菜谱id
  ```





