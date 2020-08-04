<template>
<div class="app-container">
  <div class="content">
    <div class="content_head flex-x-between">
      <div class="manageMsg">
        <div class="name">房源地址：{{houseDetail.address}}</div>
        <div class="detail flex-x-between">
          <div class="msg">
            <div class="formSize">业主：{{houseDetail.ownerName}}</div>
            <div class="formSize">房东：{{houseDetail.landlordName}}</div>
            <div class="formSize">理事：{{houseDetail.gridPersonName}}</div>
          </div>
          <div class="msg">
            <div class="formSize">手机号：{{houseDetail.ownerPhone}}</div>
            <div class="formSize">手机号：{{houseDetail.landlordPhone}}</div>
            <div class="formSize">网格：{{houseDetail.gridName}}</div>
          </div>
        </div>
      </div>
      <div class="manageBtn ">
        <div class="btn flex-x-bottom" style="margin-bottom: 30px">
          <el-button type="primary" size="small" @click="edit('landlord')">编辑</el-button>
          <el-button style="margin-left: 30px" size="small" @click="$router.push('/houseManage/houseList')">返回上一级</el-button>
        </div>
        <div class="textSize flex-x-center flex-x-bottom">
          <span class="formSize">住户</span>
          <div class="formSize" style="margin: 0 0 20px 120px">{{houseDetail.residentCount}}</div>
        </div>
        <div class="textSize flex-xy-center flex-x-bottom">
          <span class="formSize">安全消防等级</span>
          <div class="formSize" :style="{marginLeft: '100px'}" >
            <el-tag :type="houseDetail.fireRating==='#19C919'?'success':(houseDetail.fireRating==='#ED4014'?'danger':(houseDetail.fireRating==='#F9E31C'?'warning':'info'))">
              {{houseDetail.fireRating|safeColor}}
            </el-tag>
           </div>
        </div>
      </div>
    </div>
    <div class="content_in">
       <div class="search">
         <span class="formSize">房间号：</span>
         <el-input v-model="listQuery.roomName"  placeholder="请输入房间号" style="width: 250px"></el-input>
         <el-button type="primary" size="small" style="margin: 0 10px" @click="search()">查询</el-button>
         <el-button size="small" @click="resetSearch()">重置</el-button>
       </div>
      <div class="card flex-wrap">
         <div class="cardMsg" v-for="(item,index) in list " :key="index" @click="edit('user',item)">
           <div class="cardHead ">
             <div class="roomSize">房间号</div>
             <div class="roomNumber">{{item.roomNo}}</div>
           </div>
            <div class="nameDetail">
              <el-col :span="14">
              <div class="formSize flex-col">
                <div class="ch">户主</div>
                <div class="name">{{item.roomPersonName?item.roomPersonName:'暂无'}}</div>
              </div>
              </el-col>
              <el-col :span="8">
              <div class="formSize flex-col">
                <div class="ch">租户数量</div>
              <div class="name">{{item.roomMateCount?item.roomMateCount:0}}</div>

              </div>
              </el-col>
            </div>
         </div>
      </div>
    </div>
  </div>
  <div class="myPagination">
  <pagination
    v-show="total>0"
    :total="total"
    :page.sync="listQuery.pageNo"
    :limit.sync="listQuery.pageSize"
    @pagination="findFloorRoomList"
  />
  </div>
</div>
</template>

<script>
  import {houseListApi} from '@/api'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
        name: "detail",
    components: {Pagination},
      data(){
          return{
            list: null,
            houseDetail:{
              address:'',
              ownerName:'',
              landlordName:'',
              gridPersonName:'',
              ownerPhone:'',
              landlordPhone:'',
              gridName:'',
              residentCount:0,
              fireRating:''

            },
            listQuery: {
              pageNo: 1,
              pageSize: 10,
              roomName:'',
            },
            total: 0,
            houseId:JSON.parse(sessionStorage.getItem("house")).id
          }
      },
    watch: {
      '$route': function (to, from) {
       if(from.name==='houseList'&&to.name==='detail'){
         this.houseId=JSON.parse(sessionStorage.getItem("house")).id
         this.findFloorRoomList()
         this.findFloorDetail()
       }else if(from.name==='detailMsg'&&to.name==='detail'){
         this.findFloorRoomList()
         this.findFloorDetail()
       }
      }
    },
    created() {
      },
    mounted() {
      this.findFloorRoomList()
      this.findFloorDetail()
    },
    methods:{
        findFloorRoomList(data={}){
          houseListApi.findFloorRoomList({...this.listQuery,id:this.houseId,...data}).then(res=>{
            this.list = res.result.records
            this.total = res.result.total
          })
        },
        findFloorDetail(){
          houseListApi.findFloorDetail({id:this.houseId}).then(res=>{
            this.houseDetail = res.result
          })
        },
        search(){
          this.listQuery.pageNo=1
          this.findFloorRoomList()
        },
      resetSearch(){
          this.listQuery.roomName=''
          this.search()
      },

       edit(identity,room=''){
          if(room){
            sessionStorage.setItem('room',JSON.stringify(room))
          }
         this.$router.push({
           path:'/houseManage/detailMsg',
           query:{
             identity
           }
         })
       }

      }


    }
</script>

<style lang="scss" scoped>
.app-container {
  .content {
    background: #fff;
    padding: 30px 100px 20px;
    .content_head {
      height: 200px;
      border-bottom: 1px solid #E8E8E8;
      margin-bottom: 30px;
      .manageMsg {
        width: 600px;
        .name {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 30px;
        }
        .detail {
          .msg {
            div {
              margin-bottom: 25px;
            }
          }
        }
      }
      .manageBtn {
        width: 400px;
        .textSize {
          font-size: 20px;

        }
      }
    }
    .content_in {
      .card {
        margin-top: 30px;
        .cardMsg {
          cursor: pointer;
          height: 180px;
          border-radius: 8px;
          border: 2px solid #F5F5F5;
          width: 21%;
          margin: 0 20px 20px 0;
          .cardHead {
            height: 50%;
            border-bottom: 2px solid #F5F5F5;
            .roomSize {
               color: #77A6FD;
              padding: 15px 20px 5px ;
              font-size: 15px;
              position: relative;
             }
            .roomSize::before {
              content: '';
              width: 5px;
              height: 15px;
              position: absolute;
              left: 0;
              top: 16px;
              background: #2D79FC;
            }
            .roomNumber {
              color: #2D79FC;
              font-size: 32px;
              font-weight: 500;
              padding-left:20px ;
            }
          }
        }
        .cardMsg :last-child {
          margin-right: 0;
        }
      }
    }
    .nameDetail {
      position: relative;
      padding: 20px 20px;
      display: flex;
    }
    .formSize {
      .name {
        font-size: 20px;
        font-weight: 600;
        color: #020202;

      }
      .ch {
        color: #020202;
        font-size: 15px;
        margin-bottom: 5px;
      }
    }


  }
  .myPagination {
    box-sizing: border-box;
    padding-left:82px ;
  }
}
</style>
