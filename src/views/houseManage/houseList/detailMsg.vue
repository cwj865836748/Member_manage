<template>
<div class="detail-contain">
  <div class="landlord" v-if="identity==='landlord'">
    <div class="detail_top">
      <div class="head flex-x-between flex-y-center">
        <div>业主信息({{house.address}})</div>
        <div style="display: flex">
           <UploadSFZ @getsfz="getsfz" :type="1" :infoId="addForm.infoId"/>
          <el-button size="small" @click="cleanObj(addForm)">清空</el-button>
        </div>
      </div>
      <el-form :model="addForm" label-position="top"  ref="addForm" class="demo-ruleForm">
        <el-row :gutter="80" style="margin: 0">
          <el-col :span="6">
              <el-form-item label="上传正面照:" prop="photoPath">
                <Upload @input="myUpload" :url="addForm.photoPath" ref="addUpload" :type="1" v-if="uploadShow"/>

              </el-form-item>

          </el-col>
          <el-col :span="6">

              <el-form-item label="姓名:" prop="name">
                <el-input v-model="addForm.name" placeholder="请输入姓名" style="width: 100%" :disabled="addFormDisable"/>
              </el-form-item>
              <el-form-item label="证件类型：" prop="certificateType">
                <el-select v-model="addForm.certificateType" placeholder="请选择证件类型" style="width: 100%" :disabled="addFormDisable">
                  <el-option v-for="(item,index) in certificateTypeList" :key="index"
                   :label="item.itemText" :value="Number(item.itemValue)"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="民族：" prop="nation">
                <el-input v-model="addForm.nation" placeholder="请输入民族" style="width: 100%" :disabled="addFormDisable"/>
              </el-form-item>
              <el-form-item label="政治面貌：" prop="politicalStatus">
                <el-select v-model="addForm.politicalStatus" placeholder="请选择政治面貌" style="width: 100%" :disabled="addFormDisable">
                  <el-option v-for="(item,index) in politicalTypeList" :key="index"
                           :label="item.itemText" :value="Number(item.itemValue)"
                  />
                </el-select>
             </el-form-item>
          </el-col>
          <el-col :span="6">

              <el-form-item label="手机号:" prop="phone">
                <el-input v-model="addForm.phone" placeholder="请输入手机号" style="width: 100%"/>
              </el-form-item>

              <el-form-item label="证件号码：" prop="cardNo">
                <el-input v-model="addForm.cardNo" placeholder="请输入证件号码" style="width: 100%" :disabled="addFormDisable"/>
              </el-form-item>

              <el-form-item label="出生日期：" prop="birthday">
                <el-date-picker
                  :disabled="addFormDisable"
                  v-model="addForm.birthday"
                  type="date"
                  style="width: 100%"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>

          </el-col>
          <el-col :span="6">
            <el-form-item label="户籍:" prop="census">
              <el-input v-model="addForm.census" placeholder="请输入户籍" style="width: 100%" :disabled="addFormDisable"/>
            </el-form-item>
            <el-form-item label="性别:" prop="sex">
              <el-select v-model="addForm.sex" placeholder="请选择性别" style="width: 100%" :disabled="addFormDisable">
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否自主经营:" prop="isManager">
              <el-select v-model="addForm.isManager" placeholder="是否自主经营" style="width: 100%" :disabled="addFormDisable">
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="detail_top">
      <div class="head flex-x-between flex-y-center">
        <div>房东信息</div>
        <div style="display: flex">
          <UploadSFZ @getsfz="getsfz":type="2" :infoId="landlordForm.infoId"/>
          <el-button size="small" @click="cleanObj(landlordForm)">清空</el-button>
        </div>
      </div>
      <el-form :model="landlordForm" label-position="top"  ref="addForm" class="demo-ruleForm">
        <el-row :gutter="80" style="margin: 0">
          <el-col :span="6">
            <el-form-item label="上传正面照:" prop="photoPath">
              <Upload @input="myUpload" :url="landlordForm.photoPath" ref="landlordUpload" :type="2" v-if="uploadShow"/>
            </el-form-item>

          </el-col>
          <el-col :span="6">

            <el-form-item label="姓名:" prop="name">
              <el-input v-model="landlordForm.name" placeholder="请输入姓名" style="width: 100%" :disabled="landlordFormDisable"/>
            </el-form-item>
            <el-form-item label="证件类型：" prop="certificateType">
              <el-select v-model="landlordForm.certificateType" placeholder="请选择证件类型" style="width: 100%" :disabled="landlordFormDisable">
                <el-option v-for="(item,index) in certificateTypeList" :key="index"
                           :label="item.itemText" :value="Number(item.itemValue)"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="民族：" prop="nation">
              <el-input v-model="landlordForm.nation" placeholder="请输入民族" style="width: 100%" :disabled="landlordFormDisable"/>
            </el-form-item>
            <el-form-item label="政治面貌：" prop="politicalStatus">
              <el-select v-model="landlordForm.politicalStatus" placeholder="请选择政治面貌" style="width: 100%" :disabled="landlordFormDisable">
                <el-option v-for="(item,index) in politicalTypeList" :key="index"
                           :label="item.itemText" :value="Number(item.itemValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">

            <el-form-item label="手机号:" prop="phone">
              <el-input v-model="landlordForm.phone" placeholder="请输入手机号" style="width: 100%"/>
            </el-form-item>

            <el-form-item label="证件号码：" prop="cardNo">
              <el-input v-model="landlordForm.cardNo" placeholder="请输入证件号码" style="width: 100%" :disabled="landlordFormDisable"/>
            </el-form-item>

            <el-form-item label="出生日期：" prop="birthday">
              <el-date-picker
                :disabled="landlordFormDisable"
                v-model="landlordForm.birthday"
                type="date"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>

          </el-col>
          <el-col :span="6">
            <el-form-item label="户籍:" prop="census">
              <el-input v-model="landlordForm.census" placeholder="请输入户籍" style="width: 100%" :disabled="landlordFormDisable"/>
            </el-form-item>
            <el-form-item label="性别:" prop="sex">
              <el-select v-model="landlordForm.sex" placeholder="请选择性别" style="width: 100%" :disabled="landlordFormDisable">
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否自主经营:" prop="isManager">
              <el-select v-model="landlordForm.isManager" placeholder="是否自主经营" style="width: 100%" :disabled="landlordFormDisable">
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="detail_top">
      <div class="head flex-x-between flex-y-center">
        <div>二房东信息</div>
        <div style="display: flex">
          <UploadSFZ @getsfz="getsfz":type="3" :infoId="landlordForm2.infoId"/>
          <el-button size="small" @click="cleanObj(landlordForm2)">清空</el-button>
        </div>
      </div>
      <el-form :model="landlordForm2" label-position="top"  ref="addForm" class="demo-ruleForm">
        <el-row :gutter="80" style="margin: 0">
          <el-col :span="6">
            <el-form-item label="上传正面照:" prop="photoPath">
              <Upload @input="myUpload" :url="landlordForm2.photoPath" ref="landlord2Upload" :type="3" v-if="uploadShow"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">

            <el-form-item label="姓名:" prop="name">
              <el-input v-model="landlordForm2.name" placeholder="请输入姓名" style="width: 100%" :disabled="landlordForm2Disable"/>
            </el-form-item>
            <el-form-item label="证件类型：" prop="certificateType">
              <el-select v-model="landlordForm2.certificateType" placeholder="请选择证件类型" style="width: 100%" :disabled="landlordForm2Disable">
                <el-option v-for="(item,index) in certificateTypeList" :key="index"
                           :label="item.itemText" :value="Number(item.itemValue)"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="民族：" prop="nation">
              <el-input v-model="landlordForm2.nation" placeholder="请输入民族" style="width: 100%" :disabled="landlordForm2Disable"/>
            </el-form-item>
            <el-form-item label="政治面貌：" prop="politicalStatus">
              <el-select v-model="landlordForm2.politicalStatus" placeholder="请选择政治面貌" style="width: 100%" :disabled="landlordForm2Disable">
                <el-option v-for="(item,index) in politicalTypeList" :key="index"
                           :label="item.itemText" :value="Number(item.itemValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">

            <el-form-item label="手机号:" prop="phone">
              <el-input v-model="landlordForm2.phone" placeholder="请输入手机号" style="width: 100%"/>
            </el-form-item>

            <el-form-item label="证件号码：" prop="cardNo">
              <el-input v-model="landlordForm2.cardNo" placeholder="请输入证件号码" style="width: 100%" :disabled="landlordForm2Disable"/>
            </el-form-item>

            <el-form-item label="出生日期：" prop="birthday">
              <el-date-picker
                :disabled="landlordForm2Disable"
                v-model="landlordForm2.birthday"
                type="date"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>

          </el-col>
          <el-col :span="6">
            <el-form-item label="户籍:" prop="census">
              <el-input v-model="landlordForm2.census" placeholder="请输入户籍" style="width: 100%" :disabled="landlordForm2Disable"/>
            </el-form-item>
            <el-form-item label="性别:" prop="sex">
              <el-select v-model="landlordForm2.sex" placeholder="请选择性别" style="width: 100%" :disabled="landlordForm2Disable">
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否自主经营:" prop="isManager">
              <el-select v-model="landlordForm2.isManager" placeholder="是否自主经营" style="width: 100%" :disabled="landlordForm2Disable">
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
  <div class="owner" v-else>
    <div class="detail_top">
      <div class="head flex-x-between flex-y-center">
        <div>户主信息({{room.roomNo}})</div>
        <div style="display: flex">
          <UploadSFZ @getsfz="getsfz" :type="-1" :infoId="householdForm.infoId"/>
          <el-button size="small" @click="cleanObj(householdForm)">清空</el-button>
        </div>
      </div>
      <el-form :model="householdForm" label-position="top"  ref="householdForm" class="demo-ruleForm">
        <el-row :gutter="80" style="margin: 0">
          <el-col :span="6">
            <el-form-item label="上传正面照:" prop="photoPath">
              <Upload @input="myUpload" :url="householdForm.photoPath" ref="householdUpload" :type="-1" v-if="uploadShow"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">

            <el-form-item label="姓名:" prop="name">
              <el-input v-model="householdForm.name" placeholder="请输入姓名" style="width: 100%" :disabled="householdFormDisable"/>
            </el-form-item>
            <el-form-item label="证件类型：" prop="certificateType">
              <el-select v-model="householdForm.certificateType" placeholder="请选择证件类型" style="width: 100%" :disabled="householdFormDisable">
                <el-option v-for="(item,index) in certificateTypeList" :key="index"
                           :label="item.itemText" :value="Number(item.itemValue)"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="民族：" prop="nation">
              <el-input v-model="householdForm.nation" placeholder="请输入民族" style="width: 100%" :disabled="householdFormDisable"/>
            </el-form-item>
            <el-form-item label="职业：" prop="profession">
              <el-input v-model="householdForm.profession" placeholder="请输入职业" style="width: 100%" :disabled="householdFormDisable"/>
            </el-form-item>
            <el-form-item label="车牌号：" prop="numberPlate">
              <el-input v-model="householdForm.numberPlate" placeholder="请输入车牌号" style="width: 100%" :disabled="householdFormDisable"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">

            <el-form-item label="手机号:" prop="phone">
              <el-input v-model="householdForm.phone" placeholder="请输入手机号" style="width: 100%"/>
            </el-form-item>

            <el-form-item label="证件号码：" prop="cardNo">
              <el-input v-model="householdForm.cardNo" placeholder="请输入证件号码" style="width: 100%" :disabled="householdFormDisable"/>
            </el-form-item>

            <el-form-item label="出生日期：" prop="birthday">
              <el-date-picker
                :disabled="householdFormDisable"
                v-model="householdForm.birthday"
                type="date"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="服务处所：" prop="servicePremises">
              <el-input v-model="householdForm.servicePremises" placeholder="请输入服务处所" style="width: 100%" :disabled="householdFormDisable"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="户籍:" prop="census">
              <el-input v-model="householdForm.census" placeholder="请输入户籍" style="width: 100%" :disabled="householdFormDisable"/>
            </el-form-item>
            <el-form-item label="性别:" prop="sex">
              <el-select v-model="householdForm.sex" placeholder="请选择性别" style="width: 100%" :disabled="householdFormDisable">
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="交通工具：" prop="transportation">
              <el-select v-model="householdForm.transportation" placeholder="请选择交通工具" style="width: 100%" :disabled="householdFormDisable">
                <el-option v-for="(item,index) in transportationList" :key="index"
                           :label="item.itemText" :value="Number(item.itemValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
<!--     租户信息-->
    <div class="detail_top" v-for="(item,index) in tenantList" :key="index">
      <div class="head flex-x-between flex-y-center">
        <div>租户信息</div>
        <div style="display: flex">
          <UploadSFZ @getsfz="getsfz" :type="index" :infoId="item.infoId"/>
          <el-button size="small" @click="cleanObj(item,index)">删除</el-button>
        </div>
      </div>
      <el-form :model="item" label-position="top"  ref="addForm" class="demo-ruleForm">
        <el-row :gutter="80" style="margin: 0">
          <el-col :span="6">
            <el-form-item label="上传正面照:" prop="photoPath">
              <Upload @input="myUpload" :url="item.photoPath" ref="Upload" :type="index" v-if="uploadShow"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">

            <el-form-item label="姓名:" prop="name">
              <el-input v-model="item.name" placeholder="请输入姓名" style="width: 100%" :disabled="item.disabled"/>
            </el-form-item>
            <el-form-item label="证件类型：" prop="certificateType">
              <el-select v-model="item.certificateType" placeholder="请选择证件类型" style="width: 100%" :disabled="item.disabled">
                <el-option v-for="(item,index) in certificateTypeList" :key="index"
                           :label="item.itemText" :value="Number(item.itemValue)"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="民族：" prop="nation">
              <el-input v-model="item.nation" placeholder="请输入民族" style="width: 100%" :disabled="item.disabled"/>
            </el-form-item>
            <el-form-item label="职业：" prop="profession">
              <el-input v-model="item.profession" placeholder="请输入职业" style="width: 100%" :disabled="item.disabled"/>
            </el-form-item>
            <el-form-item label="车牌号：" prop="numberPlate">
              <el-input v-model="item.numberPlate" placeholder="请输入车牌号" style="width: 100%" :disabled="item.disabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">

            <el-form-item label="手机号:" prop="phone">
              <el-input v-model="item.phone" placeholder="请输入手机号" style="width: 100%"/>
            </el-form-item>

            <el-form-item label="证件号码：" prop="cardNo">
              <el-input v-model="item.cardNo" placeholder="请输入证件号码" style="width: 100%" :disabled="item.disabled"/>
            </el-form-item>

            <el-form-item label="出生日期：" prop="birthday">
              <el-date-picker
                :disabled="item.disabled"
                v-model="item.birthday"
                type="date"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="服务处所：" prop="servicePremises">
              <el-input v-model="item.servicePremises" placeholder="请输入服务处所" style="width: 100%" :disabled="item.disabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="户籍:" prop="census">
              <el-input v-model="item.census" placeholder="请输入户籍" style="width: 100%" :disabled="item.disabled"/>
            </el-form-item>

            <el-form-item label="性别:" prop="sex">
              <el-select v-model="item.sex" placeholder="请选择性别" style="width: 100%" :disabled="item.disabled">
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="交通工具：" prop="transportation">
              <el-select v-model="item.transportation" placeholder="请选择交通工具" style="width: 100%" :disabled="item.disabled">
                <el-option v-for="(item,index) in transportationList" :key="index"
                           :label="item.itemText" :value="Number(item.itemValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class=" detail_top flex-xy-center addPerson"  @click="addPerson">
      +新增成员
    </div>
  </div>
  <div class="flex-x-bottom">
     <el-button style="margin-right: 10px" @click="$router.push('/houseManage/detail')">取消</el-button>
    <el-button type="primary" @click="handleSubmit">提交</el-button>
  </div>
</div>
</template>

<script>
  import {houseListApi,dictionaryApi} from '@/api'
  import Upload from '@/components/Upload/Upload'
  import UploadSFZ from '@/components/Upload/UploadSFZ'
  export default {
    name: "detailMsg",
      data(){
        return{
          addForm:{},
          landlordForm:{},
          landlordForm2:{},
          householdForm:{},
          tenantList:[],
          identity:this.$route.query.identity,
          uploadShow:true,
          house:JSON.parse(sessionStorage.getItem("house")),
          room:JSON.parse(sessionStorage.getItem("room")),
          addFormDisable:false,
          landlordFormDisable:false,
          landlordForm2Disable:false,
          householdFormDisable:false,
          certificateTypeList:[],
          politicalTypeList:[],
          transportationList:[]
        }
      },
    components:{
      Upload,UploadSFZ
    },
      watch: {
        '$route': function (to, from) {
          if(from.name==='detail'&&to.name==='detailMsg'){
            this.identity=this.$route.query.identity
            this.house=JSON.parse(sessionStorage.getItem("house"))
            this.room=JSON.parse(sessionStorage.getItem("room"))
            this.addForm={}
            this.landlordForm={}
            this.landlordForm2={}
            this.householdForm={}
            this.tenantList=[]
            this.addFormDisable=false
            this.landlordFormDisable=false
            this.landlordForm2Disable=false
            this.householdFormDisable=false
            this.tenantList.length&&this.tenantList.forEach(item=>item.disabled=false)
            this.getList()
            this.$forceUpdate()
          }
        },
        'addForm':{
          deep:true,
          handler:function(newVal,oldVal){
            if (newVal&&newVal.cardNo&&newVal.cardNo.length===18){
              const y=newVal.cardNo.substring(6,10)
              const m =newVal.cardNo.substring(10,12)
              const d =newVal.cardNo.substring(12,14)
              const sex = (newVal.cardNo.substring(16,17))%2 ===0?2:1
              this.addForm.birthday=`${y}-${m}-${d}`
              this.addForm.sex=sex
            }
          }
        },
        'landlordForm':{
          deep:true,
          handler:function(newVal,oldVal){
            if (newVal&&newVal.cardNo&&newVal.cardNo.length===18){
              const y=newVal.cardNo.substring(6,10)
              const m =newVal.cardNo.substring(10,12)
              const d =newVal.cardNo.substring(12,14)
              const sex = (newVal.cardNo.substring(16,17))%2 ===0?2:1
              this.landlordForm.birthday=`${y}-${m}-${d}`
              this.landlordForm.sex=sex
            }
          }
        },
        'landlordForm2':{
          deep:true,
          handler:function(newVal,oldVal){
            console.log(newVal)
            if (newVal&&newVal.cardNo&&newVal.cardNo.length===18){
              const y=newVal.cardNo.substring(6,10)
              const m =newVal.cardNo.substring(10,12)
              const d =newVal.cardNo.substring(12,14)
              const sex = (newVal.cardNo.substring(16,17))%2 ===0?2:1
              this.landlordForm2.birthday=`${y}-${m}-${d}`
              this.landlordForm2.sex=sex
            }
          }
        },
        'householdForm':{
          deep:true,
          handler:function(newVal,oldVal){
            if (newVal&&newVal.cardNo&&newVal.cardNo.length===18){
              const y=newVal.cardNo.substring(6,10)
              const m =newVal.cardNo.substring(10,12)
              const d =newVal.cardNo.substring(12,14)
              const sex = (newVal.cardNo.substring(16,17))%2 ===0?2:1
              this.householdForm.birthday=`${y}-${m}-${d}`
              this.householdForm.sex=sex
            }
          }
        },
        'tenantList':{
          deep:true,
          handler:function(newVal,oldVal){
            console.log(newVal)
            newVal.length&&newVal.forEach((item,i)=>{
              if (newVal[i]&&newVal[i].cardNo&&newVal[i].cardNo.length===18){
                console.log(newVal[i])
                const y=newVal[i].cardNo.substring(6,10)
                const m =newVal[i].cardNo.substring(10,12)
                const d =newVal[i].cardNo.substring(12,14)
                const sex = (newVal[i].cardNo.substring(16,17))%2 ===0?2:1
                newVal[i].birthday=`${y}-${m}-${d}`
                newVal[i].sex=sex

              }
            })

          }
        }
      },
      created() {
        this.getList()
        this.getSex()
        this.getPolitical()
        this.getTransportation()
      },
      methods: {
        async getList(){
             if (this.identity==='landlord'){
               const {result}=await houseListApi.getLandlordDetailList({floorId:this.house.id})
               if(result.length) {
                 result.forEach(item=>{
                   if(item.type===1){
                     this.addForm=item
                     this.addFormDisable=true
                   }else if (item.type===2){
                     this.landlordForm=item
                     this.landlordFormDisable=true
                   }else {
                     this.landlordForm2=item
                     this.landlordForm2Disable=true
                   }
                 })
               }
             }else {
               const {result}=await houseListApi.getTenantDetailList({systemId:this.room.systemId})
               if(result.length){
                 this.tenantList=result.filter(v=>v.type===2)
                 this.tenantList.length&&this.tenantList.forEach(item=>{
                   item.disabled=true
                 })
                 const householdForm=result.filter(v=>v.type===1)
                 if(householdForm.length){
                   this.householdForm=householdForm[0]
                   this.householdFormDisable=true
                 }
               }
             }
          },
        async getSex(){
          const {result} = await dictionaryApi.getDictItem({code:'certificate_type'})
          this.certificateTypeList = result.reverse()
        },
        async getPolitical(){
          const {result} = await dictionaryApi.getDictItem({code:'political_status'})
          this.politicalTypeList = result
        },
        async getTransportation(){
          const {result} = await dictionaryApi.getDictItem({code:'transportation_type'})
          this.transportationList = result
        },
        addPerson(){
            const form={}
            this.tenantList.push(form)
        },
        //上传图片
        myUpload(val,type){
          this.uploadShow=false
          if(this.identity==='landlord') {
            if (type === 1) {
              this.addForm.photoPath = val
            } else if (type === 2) {
              this.landlordForm.photoPath = val
            } else {
              this.landlordForm2.photoPath = val
            }
          }else {
            if(type === -1){
                this.householdForm.photoPath = val
            }else {
              this.tenantList[type].photoPath=val
              this.$forceUpdate()
            }

          }
          this.$nextTick(()=>{
            this.uploadShow=true
          })

        },
        //清除
        async cleanObj(form,index=-1){
            if(form.infoId){
              if(this.identity==='landlord'){
                const {code}=await houseListApi.removeLandlord({infoId:form.infoId})
                if(code===200){

                  if (form.type === 1) {
                    this.addFormDisable=false
                  } else if (form.type === 2) {
                    this.landlordFormDisable=false
                  } else {
                    this.landlordForm2Disable=false
                  }
                  this.cleanData(form,index)
                  this.$message.success('清空成功')
                }
              }else {
                if(index===-1){
                  const {code}=await houseListApi.removeFamily({infoId:form.infoId})
                  if(code===200){
                    this.householdFormDisable=false
                    this.cleanData(form,index)
                    this.$message.success('清空成功')
                  }
                }else {
                  this.$confirm('是否删除该租户?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(async() => {
                    const {code}=await houseListApi.removeFamily({infoId:form.infoId})
                    if(code===200){
                      this.tenantList[index].disabled=false
                      this.$message.success('删除成功')
                      this.cleanData(form,index)
                    }
                  }).catch(() => {
                    return this.$message({
                      type: 'info',
                      message: '已取消删除'
                    });
                  });
                }
              }

            }else {
              if(index===-1){
                  this.cleanData(form,index)
              }else {
                this.$confirm('是否删除该租户?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    this.$message.success('删除成功')
                    this.cleanData(form,index)
                }).catch(() => {
                  return this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });
                });
              }
            }
        },
        //清除数据
        cleanData(form,index=-1){
            for (let i in form){
              delete form[i]
            }
            if(index!==-1){
              this.tenantList.splice(index,1)
            }
           this.$forceUpdate()
        },
        //扫描身份证
        getsfz(val){
            if(this.identity==='landlord'){
              if (val.type===1){
                this.addForm=val
                if(val.photo){
                  this.addForm.photoPath=val.photo
                }
                if (val.national){
                  this.addForm.nation=val.national
                }
                if(val.gender){
                  this.addForm.sex=val.gender==='男'?1:2
                }
                if(val.address){
                  this.addForm.census=val.address
                }
                if(!val.certificateType){
                  this.addForm.certificateType=1
                }
              }else if (val.type===2){
                this.landlordForm=val
                if(val.photo){
                  this.landlordForm.photoPath=val.photo
                }
                if (val.national){
                  this.landlordForm.nation=val.national
                }
                if(val.gender){
                  this.landlordForm.sex=val.gender==='男'?1:2
                }
                if(val.address){
                  this.landlordForm.census=val.address
                }
                if(!val.certificateType){
                  this.landlordForm.certificateType=1
                }
              }else {
                this.landlordForm2=val
                if(val.photo){
                  this.landlordForm2.photoPath=val.photo
                }
                if (val.national){
                  this.landlordForm2.nation=val.national
                }
                if(val.address){
                  this.landlordForm2.census=val.address
                }
                if(val.gender){
                  this.landlordForm2.sex=val.gender==='男'?1:2
                }
                if(!val.certificateType){
                  this.landlordForm2.certificateType=1
                }
              }
            }else {
              if (val.type===-1){
                this.householdForm=val
                if(val.photo){
                  this.householdForm.photoPath=val.photo
                }
                if (val.national){
                  this.householdForm.nation=val.national
                }
                if(val.gender){
                  this.householdForm.sex=val.gender==='男'?1:2
                }
                if(val.address){
                  this.householdForm.census=val.address
                }
                if(!val.certificateType){
                  this.householdForm.certificateType=1
                }
              }else {
                this.tenantList[val.type]=val
                if(val.photo){
                  this.tenantList[val.type].photoPath=val.photo
                }
                if (val.national){
                  this.tenantList[val.type].nation=val.national
                }
                if(val.gender){
                  this.tenantList[val.type].sex=val.gender==='男'?1:2
                }
                if(val.address){
                  this.tenantList[val.type].census=val.address
                }
                if(!val.certificateType){
                  this.tenantList[val.type].certificateType=1
                }
                this.$forceUpdate()

              }

            }

        },
        async handleSubmit(){
            if(this.identity==='landlord'){
              let addForm = Object.keys(this.addForm).length;
              let landlordForm = Object.keys(this.landlordForm).length;
              let landlordForm2 = Object.keys(this.landlordForm2).length;
              const landlords=[]
              if (addForm){
                this.addForm.systemId=this.house.systemId
                this.addForm.type=1
                landlords.push(this.addForm)
              }if (landlordForm){
                this.landlordForm.systemId=this.house.systemId
                this.landlordForm.type=2
                landlords.push(this.landlordForm)
              }if (landlordForm2){
                this.landlordForm2.systemId=this.house.systemId
                this.landlordForm2.type=3
                landlords.push(this.landlordForm2)
              }
              if(!landlords.length){
                return this.$message.error('请填写信息')
              }
              const {code} = await houseListApi.addLandlordInfo({landlords,systemId:this.house.systemId})
              if (code===200){
                this.$message.success('提交成功')
                this.$router.push('/houseManage/detail')

              }
            }else {
              if(this.tenantList.length){
                this.tenantList.forEach(item=>{
                  item.systemId=this.room.systemId
                  item.type=2
                })
              }
              const families = [...this.tenantList]
              let householdForm =Object.keys(this.householdForm).length;
              if (householdForm){
                this.householdForm.systemId=this.room.systemId
                this.householdForm.type=1
                families.push(this.householdForm)
              }
              if(!families.length){
                return this.$message.error('请填写信息')
              }
              const {code} = await houseListApi.addFamiliesInfo({families,systemId:this.room.systemId})
              if (code===200){
                this.$message.success('提交成功')
                this.$router.push('/houseManage/detail')

              }
            }

        },
        deleteId(){
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      }
    }
</script>

<style lang="scss" scoped>
.detail-contain {
  padding: 10px 70px;
  min-height: calc(100vh - 84px);
  background: rgba(0,0,0,.02);
  .detail_top{
    background: #fff;
    margin-bottom: 30px;
    .head {
      height: 70px;
      padding: 0px 30px;
      border-bottom: 1px solid #E9E9E9;
      font-size: 20px;
      font-weight: 600;
    }
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
  .addPerson {
    height: 30px;
    border: 1px dashed rgba(0,0,0,.25);
    cursor: pointer;
  }
.el-form-item {
  margin-bottom: 35px;
}
</style>
