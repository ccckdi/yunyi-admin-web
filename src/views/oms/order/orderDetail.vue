<template> 
  <div class="detail-container">
    <div>
      <el-steps :active="formatStepStatus(order.orderStatus)" finish-status="success" align-center>
        <el-step title="提交订单" :description="formatTime(order.createTime)"></el-step>
        <el-step title="支付订单" :description="formatTime(order.paymentTime)"></el-step>
        <el-step title="平台发货" :description="formatTime(order.deliveryTime)"></el-step>
        <el-step title="确认收货" :description="formatTime(order.receiveTime)"></el-step>
        <el-step title="完成评价" :description="formatTime(order.commentTime)"></el-step>
      </el-steps>
    </div>
    <el-card shadow="never" style="margin-top: 15px">
      <div class="operate-container">
        <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
        <span class="color-danger">当前订单状态：{{order.orderStatus | formatStatus}}</span>
        <div class="operate-button-container" v-show="order.orderStatus===101">
          <el-button size="mini" @click="showUpdateReceiverDialog">修改收货人信息</el-button>
          <el-button size="mini">修改商品信息</el-button>
          <el-button size="mini" @click="showUpdateMoneyDialog">修改费用信息</el-button>
          <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
          <el-button size="mini" @click="showCloseOrderDialog">关闭订单</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div class="operate-button-container" v-show="order.orderStatus===201">
          <el-button size="mini" @click="showUpdateReceiverDialog">修改收货人信息</el-button>
          <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
          <el-button size="mini">取消订单</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div class="operate-button-container" v-show="order.orderStatus===301">
          <el-button size="mini" @click="showLogisticsDialog">订单跟踪</el-button>
          <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div class="operate-button-container" v-show="order.orderStatus===401">
          <el-button size="mini" @click="handleDeleteOrder">删除订单</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">基本信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">订单编号</el-col>
          <el-col :span="6" class="table-cell-title">用户账号</el-col>
          <el-col :span="6" class="table-cell-title">下单时间</el-col>
          <el-col :span="6" class="table-cell-title">支付时间</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{order.orderSn}}</el-col>
          <el-col :span="6" class="table-cell">{{order.memberUsername}}</el-col>
          <el-col :span="6" class="table-cell">{{order.createTime}}</el-col>
          <el-col :span="6" class="table-cell">{{order.payTime == null ? '暂无':order.payTime}}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">收货人信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">收货人</el-col>
          <el-col :span="6" class="table-cell-title">手机号码</el-col>
          <el-col :span="6" class="table-cell-title">邮政编码</el-col>
          <el-col :span="6" class="table-cell-title">备注</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{order.consignee}}</el-col>
          <el-col :span="6" class="table-cell">{{order.mobile}}</el-col>
          <el-col :span="6" class="table-cell">{{order.address}}</el-col>
          <el-col :span="6" class="table-cell">{{order.message == null ? '暂无':order.message}}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">商品信息</span>
      </div>
      <el-table
        ref="orderItemTable"
        :data="order.omsOrderGoodsList"
        style="width: 100%;margin-top: 20px" border>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.icon" style="height: 80px">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.goodsName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="120" align="center">
          <template slot-scope="scope">
            <p>￥{{scope.row.price}}</p>
          </template>
        </el-table-column>
        <el-table-column label="规格" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.specifications.join('-')}}
          </template>
        </el-table-column>
        <el-table-column label="数量" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.number}}
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120" align="center">
          <template slot-scope="scope">
            ￥{{scope.row.price*scope.row.number}}
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right;margin: 20px">
        合计：<span class="color-danger">￥{{order.orderPrice}}</span>
      </div>
<!--      <div style="margin-top: 60px">-->
<!--        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>-->
<!--        <span class="font-small">费用信息</span>-->
<!--      </div>-->
<!--      <div class="table-layout">-->
<!--        <el-row>-->
<!--          <el-col :span="6" class="table-cell-title">商品合计</el-col>-->
<!--          <el-col :span="6" class="table-cell-title">运费</el-col>-->
<!--          <el-col :span="6" class="table-cell-title">优惠券</el-col>-->
<!--          <el-col :span="6" class="table-cell-title">积分抵扣</el-col>-->
<!--        </el-row>-->
<!--        <el-row>-->
<!--          <el-col :span="6" class="table-cell">￥{{order.totalAmount}}</el-col>-->
<!--          <el-col :span="6" class="table-cell">￥{{order.freightAmount}}</el-col>-->
<!--          <el-col :span="6" class="table-cell">-￥{{order.couponAmount}}</el-col>-->
<!--          <el-col :span="6" class="table-cell">-￥{{order.integrationAmount}}</el-col>-->
<!--        </el-row>-->
<!--        <el-row>-->
<!--          <el-col :span="6" class="table-cell-title">活动优惠</el-col>-->
<!--          <el-col :span="6" class="table-cell-title">折扣金额</el-col>-->
<!--          <el-col :span="6" class="table-cell-title">订单总金额</el-col>-->
<!--          <el-col :span="6" class="table-cell-title">应付款金额</el-col>-->
<!--        </el-row>-->
<!--        <el-row>-->
<!--          <el-col :span="6" class="table-cell">-￥{{order.promotionAmount}}</el-col>-->
<!--          <el-col :span="6" class="table-cell">-￥{{order.discountAmount}}</el-col>-->
<!--          <el-col :span="6" class="table-cell">-->
<!--            <span class="color-danger">￥{{order.totalAmount+order.freightAmount}}</span>-->
<!--          </el-col>-->
<!--          <el-col :span="6" class="table-cell">-->
<!--            <span class="color-danger">￥{{order.payAmount+order.freightAmount-order.discountAmount}}</span>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--      </div>-->
<!--      <div style="margin-top: 20px">-->
<!--        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>-->
<!--        <span class="font-small">操作信息</span>-->
<!--      </div>-->
<!--      <el-table style="margin-top: 20px;width: 100%"-->
<!--                ref="orderHistoryTable"-->
<!--                :data="order.historyList" border>-->
<!--        <el-table-column label="操作者"  width="120" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            {{scope.row.operateMan}}-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="操作时间"  width="160" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            {{formatTime(scope.row.createTime)}}-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="订单状态"  width="120" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            {{scope.row.orderStatus | formatStatus}}-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="付款状态"  width="120" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            {{scope.row.orderStatus | formatPayStatus}}-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="发货状态"  width="120" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            {{scope.row.orderStatus | formatDeliverStatus}}-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="备注" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            {{scope.row.note}}-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--      </el-table>-->
    </el-card>
    <el-dialog title="修改收货人信息"
               :visible.sync="receiverDialogVisible"
               width="40%">
      <el-form :model="receiverInfo"
               ref="receiverInfoForm"
               label-width="150px">
        <el-form-item label="收货人姓名：">
          <el-input v-model="receiverInfo.receiverName" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model="receiverInfo.receiverPhone" style="width: 200px">
          </el-input>
        </el-form-item>
<!--        <el-form-item label="邮政编码：">-->
<!--          <el-input v-model="receiverInfo.receiverPostCode" style="width: 200px">-->
<!--          </el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="所在区域：">
          <v-distpicker :province="receiverInfo.receiverProvince"
                        :city="receiverInfo.receiverCity"
                        :area="receiverInfo.receiverRegion"
                        @selected="onSelectRegion"></v-distpicker>
        </el-form-item>
        <el-form-item label="详细地址：">
          <el-input v-model="receiverInfo.receiverDetailAddress" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="receiverDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleUpdateReceiverInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改费用信息"
               :visible.sync="moneyDialogVisible"
               width="40%">
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">商品合计</el-col>
          <el-col :span="6" class="table-cell-title">运费</el-col>
          <el-col :span="6" class="table-cell-title">优惠券</el-col>
          <el-col :span="6" class="table-cell-title">积分抵扣</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">￥{{order.totalAmount}}</el-col>
          <el-col :span="6" class="table-cell">
            <el-input v-model.number="moneyInfo.freightAmount" size="mini"><template slot="prepend">￥</template></el-input>
          </el-col>
          <el-col :span="6" class="table-cell">-￥{{order.couponAmount}}</el-col>
          <el-col :span="6" class="table-cell">-￥{{order.integrationAmount}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">活动优惠</el-col>
          <el-col :span="6" class="table-cell-title">折扣金额</el-col>
          <el-col :span="6" class="table-cell-title">订单总金额</el-col>
          <el-col :span="6" class="table-cell-title">应付款金额</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">-￥{{order.promotionAmount}}</el-col>
          <el-col :span="6" class="table-cell">
            <el-input v-model.number="moneyInfo.discountAmount" size="mini"><template slot="prepend">-￥</template></el-input>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{order.totalAmount+moneyInfo.freightAmount}}</span>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">￥{{order.payAmount+moneyInfo.freightAmount-moneyInfo.discountAmount}}</span>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="moneyDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleUpdateMoneyInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="发送站内信"
               :visible.sync="messageDialogVisible"
               width="40%">
      <el-form :model="message"
               ref="receiverInfoForm"
               label-width="150px">
        <el-form-item label="标题：">
          <el-input v-model="message.title" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <el-input v-model="message.content" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="messageDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSendMessage">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="关闭订单"
               :visible.sync="closeDialogVisible"
               width="40%">
      <el-form :model="closeInfo"
               label-width="150px">
        <el-form-item label="操作备注：">
          <el-input v-model="closeInfo.note" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCloseOrder">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="备注订单"
               :visible.sync="markOrderDialogVisible"
               width="40%">
      <el-form :model="markInfo"
               label-width="150px">
        <el-form-item label="操作备注：">
          <el-input v-model="markInfo.note" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="markOrderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleMarkOrder">确 定</el-button>
      </span>
    </el-dialog>
    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>
<script>
  import {getOrderDetail,updateReceiverInfo,updateMoneyInfo,closeOrder,updateOrderNote,deleteOrder} from '@/api/order';
  import LogisticsDialog from '@/views/oms/order/components/logisticsDialog';
  import {formatDate} from '@/utils/date';
  import VDistpicker from 'v-distpicker';
  const defaultReceiverInfo = {
    orderId:null,
    receiverName:null,
    receiverPhone:null,
    receiverPostCode:null,
    receiverDetailAddress:null,
    receiverProvince:null,
    receiverCity:null,
    receiverRegion:null,
    status:null
  };
  export default {
    name: 'orderDetail',
    components: { VDistpicker, LogisticsDialog},
    data() {
      return {
        id: null,
        order: {},
        receiverDialogVisible:false,
        receiverInfo:Object.assign({},defaultReceiverInfo),
        moneyDialogVisible:false,
        moneyInfo:{orderId:null, freightAmount:0, discountAmount:0,status:null},
        messageDialogVisible:false,
        message: {title:null, content:null},
        closeDialogVisible:false,
        closeInfo:{note:null,id:null},
        markOrderDialogVisible:false,
        markInfo:{note:null},
        logisticsDialogVisible:false
      }
    },
    created() {
      this.id = this.list = this.$route.query.id;
      getOrderDetail(this.id).then(response => {
        this.order = response.data;
      });
    },
    filters: {
      formatNull(value) {
        if(value===undefined||value===null||value===''){
          return '暂无';
        }else{
          return value;
        }
      },
      formatLongText(value) {
        if(value===undefined||value===null||value===''){
          return '暂无';
        }else if(value.length>8){
          return value.substr(0, 8) + '...';
        }else{
          return value;
        }
      },
      formatPayType(value) {
        if (value === 1) {
          return '支付宝';
        } else if (value === 2) {
          return '微信';
        } else {
          return '未支付';
        }
      },
      formatSourceType(value) {
        if (value === 1) {
          return 'APP订单';
        } else {
          return 'PC订单';
        }
      },
      formatOrderType(value) {
        if (value === 1) {
          return '秒杀订单';
        } else {
          return '正常订单';
        }
      },
      formatAddress(order) {
        let str = order.receiverProvince;
        if (order.receiverCity != null) {
          str += "  " + order.receiverCity;
        }
        str += "  " + order.receiverRegion;
        str += "  " + order.receiverDetailAddress;
        return str;
      },
      formatStatus(value) {
        if (value === 101) {
          return '已下单';
        } else if (value === 102) {
          return '已取消';
        } else if (value === 201) {
          return '已付款';
        } else if (value === 202) {
          return '待发货';
        } else if (value === 201) {
          return '待发货';
        } else if (value === 301) {
          return '已发货';
        } else if (value === 401) {
          return '已收货';
        } else {
          return '未知状态';
        }
      },
      formatPayStatus(value) {
        if (value === 101) {
          return '待付款';
        } else if (value === 102) {
          return '待付款';
        } else if (value === 201) {
          return '已付款';
        } else if (value === 202) {
          return '待退款';
        } else if (value === 203) {
          return '已退款';
        } else if (value === 301) {
          return '已付款';
        } else if (value === 401) {
          return '已付款';
        } else {
          return '未知状态';
        }
      },
      formatDeliverStatus(value) {
        if (value === 101) {
          return '待付款';
        } else if (value === 102) {
          return '待付款';
        } else if (value === 201) {
          return '待发货';
        } else if (value === 202) {
          return '待发货';
        } else if (value === 201) {
          return '待发货';
        } else if (value === 301) {
          return '已发货';
        } else if (value === 401) {
          return '已收货';
        } else {
          return '未知状态';
        }
      },
      formatProductAttr(value){
        if(value==null){
          return '';
        }else{
          let attr = JSON.parse(value);
          let result='';
          for(let i=0;i<attr.length;i++){
            result+=attr[i].key;
            result+=":";
            result+=attr[i].value;
            result+=";";
          }
          return result;
        }
      }
    },
    methods: {
      //省市区截取
      getArea(str) {
        var str = str;
        var reg = '(?<province>[^省]+自治区|.*?省|.*?行政区|.*?市)(?<city>[^市]+自治州|.*?地区|.*?行政单位|.+盟|.*?城区|.*?市|.*?县)(?<county>[^县]+县|.+区|.+市|.+旗|.+海域|.+岛)?(?<town>[^区]+区|.+镇|.+街道办事处|.+街道)?(?<village>.*)';
        const area = str.match(reg) // 分割省市区
        // console.log(area) // ['内蒙古自治区', '锡林郭勒盟', '正镶白旗']
        /*var len = 0
        for (var i = 0; i < area.length; i++) { // 获取省市区的长度
          len += area[i].length
        }
        area.push(str.substring(len)) // 获取省市区之后的字符串
        console.log(area) // ['内蒙古自治区', '锡林郭勒盟', '正镶白旗', '前进大街2699号']
        for (var j = 0; j < area.length; j++) {
          console.log(area[j])
        }*/
        return area;
      },
      onSelectRegion(data){
        this.receiverInfo.receiverProvince=data.province.value;
        this.receiverInfo.receiverCity=data.city.value;
        this.receiverInfo.receiverRegion=data.area.value;
      },
      formatTime(time) {
        if (time == null || time === '') {
          return '';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatStepStatus(value) {
        if (value === 201 || value === 202) {
          //待发货
          return 2;
        } else if (value === 301) {
          //已发货
          return 3;
        } else if (value === 401) {
          //已完成
          return 4;
        }else {
          //待付款、已关闭、无限订单
          return 1;
        }
      },
      showUpdateReceiverDialog(){
        var area =this.getArea(this.order.address);
        console.log(area);
        this.receiverDialogVisible=true;
        this.receiverInfo={
          orderId:this.order.id,
          receiverName:this.order.consignee,
          receiverPhone:this.order.mobile,
          // receiverPostCode:this.order.receiverPostCode,
          receiverDetailAddress:area[5],
          receiverProvince:area[1],
          receiverCity:area[2],
          receiverRegion:area[3],
          status:this.order.orderStatus
        }
      },
      handleUpdateReceiverInfo(){
        this.$confirm('是否要修改收货信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateReceiverInfo(this.receiverInfo).then(response=>{
            this.receiverDialogVisible=false;
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            getOrderDetail(this.id).then(response => {
              this.order = response.data;
            });
          });
        });
      },
      showUpdateMoneyDialog(){
        this.moneyDialogVisible=true;
        this.moneyInfo.orderId=this.order.id;
        this.moneyInfo.freightAmount=this.order.freightAmount;
        this.moneyInfo.discountAmount=this.order.discountAmount;
        this.moneyInfo.status=this.order.orderStatus;
      },
      handleUpdateMoneyInfo(){
        this.$confirm('是否要修改费用信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateMoneyInfo(this.moneyInfo).then(response=>{
            this.moneyDialogVisible=false;
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            getOrderDetail(this.id).then(response => {
              this.order = response.data;
            });
          });
        });
      },
      showMessageDialog(){
        this.messageDialogVisible=true;
        this.message.title=null;
        this.message.content=null;
      },
      handleSendMessage(){
        this.$confirm('是否要发送站内信?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.messageDialogVisible=false;
          this.$message({
            type: 'success',
            message: '发送成功!'
          });
        });
      },
      showCloseOrderDialog(){
        this.closeDialogVisible=true;
        this.closeInfo.note=null;
        this.closeInfo.id=this.id;
      },
      handleCloseOrder(){
        this.$confirm('是否要关闭?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let params = new URLSearchParams();
            params.append("ids",[this.closeInfo.id]);
            params.append("note",this.closeInfo.note);
            closeOrder(params).then(response=>{
              this.closeDialogVisible=false;
              this.$message({
                type: 'success',
                message: '订单关闭成功!'
              });
              getOrderDetail(this.id).then(response => {
                this.order = response.data;
              });
            });
        });
      },
      showMarkOrderDialog(){
        this.markOrderDialogVisible=true;
        this.markInfo.id=this.id;
        this.closeOrder.note=null;
      },
      handleMarkOrder(){
        this.$confirm('是否要备注订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("id",this.markInfo.id);
          params.append("note",this.markInfo.note);
          params.append("status",this.order.orderStatus);
          updateOrderNote(params).then(response=>{
            this.markOrderDialogVisible=false;
            this.$message({
              type: 'success',
              message: '订单备注成功!'
            });
            getOrderDetail(this.id).then(response => {
              this.order = response.data;
            });
          });
        });
      },
      handleDeleteOrder(){
        this.$confirm('是否要进行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("ids",[this.id]);
          deleteOrder(params).then(response=>{
            this.$message({
              message: '删除成功！',
              type: 'success',
              duration: 1000
            });
            this.$router.back();
          });
        })
      },
      showLogisticsDialog(){
        this.logisticsDialogVisible=true;
      }
    }
  }
</script>
<style scoped>
  .detail-container {
    width: 80%;
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
  }

  .operate-container {
    background: #F2F6FC;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;
  }

  .operate-button-container {
    float: right;
    margin-right: 20px
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
</style>


