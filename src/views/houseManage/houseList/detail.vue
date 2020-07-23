<template>
<div class="app-container">
  <div class="content">
    <div class="content_head flex-x-between">
      <div class="manageMsg">
        <div class="name">房源地址：{{houseDetail.address}}</div>
        <div class="detail flex-x-between">
          <div class="msg">
            <div>业主：{{houseDetail.ownerName}}</div>
            <div>房东：{{houseDetail.landlordName}}</div>
            <div>理事：{{houseDetail.gridPersonName}}</div>
          </div>
          <div class="msg">
            <div>手机号：{{houseDetail.ownerPhone}}</div>
            <div>手机号：{{houseDetail.landlordPhone}}</div>
            <div>网格：{{houseDetail.gridName}}</div>
          </div>
        </div>
      </div>
      <div class="manageBtn ">
        <div class="btn flex-x-bottom" style="margin-bottom: 30px">
          <el-button type="primary" size="small" @click="edit('landlord')">编辑</el-button>
          <el-button style="margin-left: 30px" size="small" @click="$router.push('/houseManage/houseList')">返回上一级</el-button>
        </div>
        <div class="textSize flex-x-center flex-x-bottom">
          <span>住户</span>
          <div style="margin: 0 0 10px 120px">{{houseDetail.residentCount}}</div>
        </div>
        <div class="textSize flex-x-center flex-x-bottom">
          <span>安全消防等级</span>
          <div style="margin-left: 100px">{{houseDetail.fireRating}}</div>
        </div>
      </div>
    </div>
    <div class="content_in">
       <div class="search">
         <span>房间号：</span>
         <el-input v-model="listQuery.roomName"  placeholder="请输入房间号" style="width: 250px"></el-input>
         <el-button type="primary" size="small" style="margin: 0 10px" @click="search()">查询</el-button>
         <el-button size="small">取消</el-button>
       </div>
      <div class="card flex-wrap">
         <div class="cardMsg flex-x-around" v-for="(item,index) in list " :key="index" @click="edit('user',item.systemId)">
            <div class="headPic"></div>
            <div class="nameDetail flex-y-around">
              <div>{{item.roomNo}}</div>
              <div>户主：{{item.roomPersonName}}</div>
              <div>住户：{{item.roomMateCount}}</div>
            </div>
         </div>
      </div>
    </div>
  </div>
  <pagination
    v-show="total>0"
    :total="total"
    :page.sync="listQuery.pageNo"
    :limit.sync="listQuery.pageSize"
    @pagination="findFloorRoomList"
  />
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
              pageSize: 8,
              roomName:'',
            },
            total: 0,
            houseId:sessionStorage.getItem("houseId")
          }
      },
    watch: {
      '$route': function (to, from) {
       if(from.name==='houseList'){
         this.houseId=sessionStorage.getItem("houseId")
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
       edit(identity,id){
         this.$router.push({
           path:'/houseManage/detailMsg',
           query:{
             identity
           }
         })
         sessionStorage.setItem('systemId',id)
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
          height: 200px;
          border-radius: 8px;
          border: 2px solid #E9E9E9;
          width: 23%;
          margin: 0 20px 20px 0;
          padding: 20px 10px;
          .headPic {
            border-radius: 50%;
            border: 1px slategrey solid;
            width: 70px;
            height: 70px;
          }
          .nameDetail {
            font-size: 19px;
          }

        }
        .cardMsg :last-child {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
