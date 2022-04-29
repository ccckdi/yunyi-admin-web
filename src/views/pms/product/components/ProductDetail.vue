<template> 
  <div class="app-container">
    <el-card class="box-card" shadow="never">
      <h3>商品信息</h3>
      <el-form :model="goods" :rules="rules" ref="goodsFrom" label-width="150px">
        <el-form-item label="商品名称：" prop="name">
          <el-input v-model="goods.name"></el-input>
        </el-form-item>
        <el-form-item label="商品编号：" prop="goodsSn">
          <el-input v-model="goods.goodsSn"></el-input>
        </el-form-item>
        <el-form-item label="商品分类：" prop="categoryId">
          <el-cascader
            v-model="selectProductCateValue"
            :options="productCateOptions">
          </el-cascader>
        </el-form-item>
        <el-form-item label="商品品牌：" prop="brandId">
          <el-select
            v-model="goods.brandId"
            @change="handleBrandChange"
            placeholder="请选择品牌">
            <el-option
              v-for="item in brandOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计量单位：">
          <el-input v-model="goods.unit"></el-input>
        </el-form-item>
        <el-form-item label="专柜价格：" prop="counterPrice">
          <el-input v-model="goods.counterPrice"></el-input>
        </el-form-item>
        <el-form-item label="零售价格：" prop="retailPrice">
          <el-input v-model="goods.retailPrice"></el-input>
        </el-form-item>
        <el-form-item label="是否上架：">
          <el-radio-group v-model="goods.isOnSale">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否新品：">
          <el-radio-group v-model="goods.isNew">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否热卖：">
          <el-radio-group v-model="goods.isHot">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品图标：" prop="icon">
          <single-upload v-model="goods.icon"></single-upload>
        </el-form-item>
        <el-form-item label="商品图片：">
          <multi-upload v-model="selectProductPics"></multi-upload>
        </el-form-item>
        <el-form-item label="商品介绍：">
          <el-input
            placeholder="请输入内容"
            type="textarea"
            v-model="goods.brief"
            :autosize="true"></el-input>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model.number="goods.sortOrder"></el-input>
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-radio-group v-model="goods.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card" shadow="never">
      <h3>商品规格</h3>
      <el-row :gutter="20" type="flex" align="middle" style="padding:20px 0;">
        <el-col :span="10">
          <el-radio-group v-model="multipleSpec" @change="specChanged">
            <el-radio-button :label="false">默认标准规格</el-radio-button>
            <el-radio-button :label="true">多规格支持</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col v-if="multipleSpec" :span="10">
          <el-button :plain="true" type="primary" @click="handleSpecificationShow">添加</el-button>
        </el-col>
      </el-row>

      <el-table :data="specifications">
        <el-table-column property="specification" label="规格名"/>
        <el-table-column property="value" label="规格值">
          <template slot-scope="scope">
            <el-tag type="primary">
              {{ scope.row.value }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column property="icon" label="规格图片">
          <template slot-scope="scope">
            <img v-if="scope.row.icon" :src="scope.row.icon" width="40">
          </template>
        </el-table-column>
        <el-table-column
          v-if="multipleSpec"
          align="center"
          label="操作"
          width="250"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleSpecificationDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="specVisiable" title="设置规格">
        <el-form
          ref="specForm"
          :rules="rules"
          :model="specForm"
          status-icon
          label-position="left"
          label-width="100px"
          style="width: 400px; margin-left:50px;"
        >
          <el-form-item label="规格名" prop="specification">
            <el-input v-model="specForm.specification"/>
          </el-form-item>
          <el-form-item label="规格值" prop="value">
            <el-input v-model="specForm.value"/>
          </el-form-item>
          <el-form-item label="规格图片" prop="icon">
            <single-upload v-model="specForm.icon"></single-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="specVisiable = false">取消</el-button>
          <el-button type="primary" @click="handleSpecificationAdd">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
    <el-card class="box-card" shadow="never">
      <h3>商品库存</h3>
      <el-table :data="products">
        <el-table-column property="value" label="货品规格">
          <template slot-scope="scope">
            <el-tag v-for="tag in scope.row.specifications" :key="tag">
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column property="price" width="100" label="货品售价"/>
        <el-table-column property="number" width="100" label="货品数量"/>
        <el-table-column property="icon" width="100" label="货品图片">
          <template slot-scope="scope">
            <img v-if="scope.row.icon" :src="scope.row.icon" width="40">
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleProductShow(scope.row)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="productVisiable" title="添加货品">
        <el-form
          ref="productForm"
          :model="productForm"
          status-icon
          label-position="left"
          label-width="100px"
          style="width: 400px; margin-left:50px;"
        >
          <el-form-item label="货品规格列" prop="specifications">
            <el-tag v-for="tag in productForm.specifications" :key="tag">
              {{ tag }}
            </el-tag>
          </el-form-item>
          <el-form-item label="货品售价" prop="price">
            <el-input v-model="productForm.price"/>
          </el-form-item>
          <el-form-item label="货品数量" prop="number">
            <el-input v-model="productForm.number"/>
          </el-form-item>
          <el-form-item label="货品图片" prop="icon">
            <single-upload v-model="productForm.icon"></single-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="productVisiable = false">取消</el-button>
          <el-button type="primary" @click="handleProductEdit">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
    <el-card class="box-card" shadow="never">
      <h3>商品参数</h3>
      <el-button type="primary" @click="handleAttributeShow">添加</el-button>
      <el-table :data="attributes">
        <el-table-column property="attribute" label="商品参数名称"/>
        <el-table-column property="value" label="商品参数值"/>
        <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="handleAttributeDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="attributeVisiable" title="添加商品参数">
        <el-form
          ref="attributeForm"
          :model="attributeForm"
          status-icon
          label-position="left"
          label-width="100px"
          style="width: 400px; margin-left:50px;"
        >
          <el-form-item label="商品参数名称" prop="attribute">
            <el-input v-model="attributeForm.attribute"/>
          </el-form-item>
          <el-form-item label="商品参数值" prop="value">
            <el-input v-model="attributeForm.value"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="attributeVisiable = false">取消</el-button>
          <el-button type="primary" @click="handleAttributeAdd">确定</el-button>
        </div>
      </el-dialog>
    </el-card>
    <div class="op-container">
      <el-button type="primary" @click="onSubmit('goodsFrom')">提交</el-button>
      <el-button v-if="!isEdit" @click="resetForm('goodsFrom')">重置</el-button>
    </div>
  </div>
</template>
<script>
import {createProduct, getProduct, updateProduct} from '@/api/product'
import {fetchListWithChildren,getProductCate} from '@/api/productCate'
import {fetchList as fetchBrandList} from '@/api/brand'
import SingleUpload from '@/components/Upload/singleUpload'
import MultiUpload from '@/components/Upload/multiUpload'

export default {
  name: 'ProductDetail',
  components: {SingleUpload,MultiUpload},
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //选中商品分类的值
      selectProductCateValue: [],
      productCateOptions: [],
      brandOptions: [],

      goods: {goodsSn: '', name: '', brief: '', categoryId: null, categoryName: '', brandId: null, unit: '', isOnSale: 1, isNew: 1, isHot: 0, icon: '',gallery: '', status: 1, sortOrder: 0},
      specForm: {specification: '', value: '', icon: ''},
      specifications: [{specification: '规格', value: '标准', icon: ''}],
      productForm: {id: 0, specifications: [], price: 0.00, number: 0, icon: ''},
      products: [{id: 0, specifications: ['标准'], price: 0.00, number: 0, icon: ''}],
      attributes: [],
      attributeForm: {attribute: '', value: ''},

      specVisiable: false,
      multipleSpec: false,
      productVisiable: false,
      attributeVisiable: false,


      rules: {
        goodsSn: [{required: true, message: '商品编号不能为空', trigger: 'blur'}],
        name: [{required: true, message: '商品名称不能为空', trigger: 'blur'}],
        categoryId: [{required: true, message: '商品分类不能为空', trigger: 'blur'}],
        brandId: [{required: true, message: '商品品牌不能为空', trigger: 'blur'}]
      }
    }
  },
  computed:{
    //商品的主图和画册图片
    selectProductPics:{
      get:function () {
        let pics=[];
        // if(this.goods.icon===undefined||this.goods.icon==null||this.goods.icon===[]){
        //   return pics;
        // }
        // pics.push(this.goods.icon);
        if(this.goods.gallery===undefined||this.goods.gallery==null||this.goods.gallery===[]){
          return pics;
        }
        let albumPics = this.goods.gallery;
        for(let i=0;i<albumPics.length;i++){
          pics.push(albumPics[i]);
        }
        return pics;
      },
      set:function (newValue) {
        if (newValue == null || newValue.length === 0) {
          this.goods.gallery = null;
        } else {
          this.goods.gallery = [];
          if (newValue.length > 0) {
            for (let i = 0; i < newValue.length; i++) {
              this.goods.gallery.push(newValue[i]);
            }
          }
        }
      }
    }
  },
  created() {
    if (this.isEdit) {
      getProduct(this.$route.query.id).then(response => {
        this.goods = response.data.goods;
        this.specifications = response.data.specifications;
        this.products = response.data.products;
        this.attributes = response.data.attributes;
        this.goods.categoryName = this.getCateNameById(this.goods.categoryId);
        if (this.specifications.length > 1) {
          this.multipleSpec = true;
        }
        this.handleEditCreated();
      });
    }
    this.getProductCateList();
    this.getBrandList();
  },
  watch: {
    selectProductCateValue: function (newValue) {
      if (newValue != null && newValue.length === 2) {
        this.goods.categoryId = newValue[1];
        this.goods.categoryName = this.getCateNameById(this.goods.categoryId);
      } else {
        this.goods.categoryId = null;
        this.goods.categoryName = null;
      }
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              const finalGoods = {
                goods: this.goods,
                specifications: this.specifications,
                products: this.products,
                attributes: this.attributes
              }
              updateProduct(this.$route.query.id, finalGoods).then(response => {
                this.$refs[formName].resetFields();
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                });
                this.$router.back();
              });
            } else {
              const finalGoods = {
                goods: this.goods,
                specifications: this.specifications,
                products: this.products,
                attributes: this.attributes
              }
              createProduct(finalGoods).then(response => {
                this.$refs[formName].resetFields();
                this.goods = Object.assign({}, finalGoods);
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 1000
                });
              });
            }
          });

        } else {
          this.$message({
            message: '验证失败',
            type: 'error',
            duration: 1000
          });
          return false;
        }
      });
    },
    getProductCateList() {
      fetchListWithChildren().then(response => {
        let list = response.data.list;
        this.productCateOptions = [];
        for (let i = 0; i < list.length; i++) {
          let children = [];
          if (list[i].children != null && list[i].children.length > 0) {
            for (let j = 0; j < list[i].children.length; j++) {
              children.push({label: list[i].children[j].name, value: list[i].children[j].id});
            }
          }
          this.productCateOptions.push({label: list[i].name, value: list[i].id, children: children});

        }
      });
    },
    getBrandList() {
      fetchBrandList({pageNum: 1, pageSize: 100}).then(response => {
        this.brandOptions = [];
        let brandList = response.data.list;
        for (let i = 0; i < brandList.length; i++) {
          this.brandOptions.push({label: brandList[i].name, value: brandList[i].id});
        }
      });
    },
    handleBrandChange(val) {
      let brandName = '';
      for (let i = 0; i < this.brandOptions.length; i++) {
        if (this.brandOptions[i].value === val) {
          brandName = this.brandOptions[i].label;
          break;
        }
      }
      this.brandName = brandName;
    },
    getCateNameById(id) {
      let name = null;
      for (let i = 0; i < this.productCateOptions.length; i++) {
        for (let j = 0; j < this.productCateOptions[i].children.length; j++) {
          if (this.productCateOptions[i].children[j].value === id) {
            name = this.productCateOptions[i].children[j].label;
            return name;
          }
        }
      }
      return name;
    },
    specChanged: function (label) {
      if (label === false) {
        this.specifications = [{specification: '规格', value: '标准', icon: ''}]
        this.products = [{id: 0, specifications: ['标准'], price: 0.00, number: 0, icon: ''}]
      } else {
        this.specifications = []
        this.products = []
      }
    },
    handleSpecificationShow() {
      this.specForm = {specification: '', value: '', icon: ''}
      this.specVisiable = true
    },
    handleSpecificationDelete(row) {
      const index = this.specifications.indexOf(row)
      this.specifications.splice(index, 1)
      this.specToProduct();
    },
    specToProduct() {
      if (this.specifications.length === 0) {
        return
      }
      // 根据specifications创建临时规格列表
      var specValues = []
      var spec = this.specifications[0].specification
      var values = []
      values.push(0)

      for (var i = 1; i < this.specifications.length; i++) {
        const aspec = this.specifications[i].specification

        if (aspec === spec) {
          values.push(i)
        } else {
          specValues.push(values)
          spec = aspec
          values = []
          values.push(i)
        }
      }
      specValues.push(values)

      // 根据临时规格列表生产货品规格
      // 算法基于 https://blog.csdn.net/tyhj_sf/article/details/53893125
      var productsIndex = 0
      var products = []
      var combination = []
      var n = specValues.length
      for (var s = 0; s < n; s++) {
        combination[s] = 0
      }
      var index = 0
      var isContinue = false
      do {
        var specifications = []
        for (var x = 0; x < n; x++) {
          var z = specValues[x][combination[x]]
          specifications.push(this.specifications[z].value)
        }
        products[productsIndex] = {id: productsIndex, specifications: specifications, price: 0.00, number: 0, icon: ''}
        productsIndex++

        index++
        combination[n - 1] = index
        for (var j = n - 1; j >= 0; j--) {
          if (combination[j] >= specValues[j].length) {
            combination[j] = 0
            index = 0
            if (j - 1 >= 0) {
              combination[j - 1] = combination[j - 1] + 1
            }
          }
        }
        isContinue = false
        for (var p = 0; p < n; p++) {
          if (combination[p] !== 0) {
            isContinue = true
          }
        }
      } while (isContinue)

      this.products = products
    },
    handleSpecificationAdd() {
      var index = this.specifications.length - 1
      for (var i = 0; i < this.specifications.length; i++) {
        const v = this.specifications[i]
        if (v.specification === this.specForm.specification) {
          if (v.value === this.specForm.value) {
            this.$message({
              type: 'warning',
              message: '已经存在规格值:' + v.value
            })
            this.specForm = {}
            this.specVisiable = false
            return
          } else {
            index = i
          }
        }
      }

      this.specifications.splice(index + 1, 0, this.specForm)
      this.specVisiable = false

      this.specToProduct()
    },
    handleProductShow(row) {
      this.productForm = Object.assign({}, row)
      this.productVisiable = true
    },
    handleProductEdit() {
      for (var i = 0; i < this.products.length; i++) {
        const v = this.products[i]
        if (v.id === this.productForm.id) {
          this.products.splice(i, 1, this.productForm)
          break
        }
      }
      this.productVisiable = false
    },
    handleAttributeShow() {
      this.attributeForm = {}
      this.attributeVisiable = true
    },
    handleAttributeAdd() {
      this.attributes.unshift(this.attributeForm)
      this.attributeVisiable = false
    },
    handleAttributeDelete(row) {
      const index = this.attributes.indexOf(row)
      this.attributes.splice(index, 1)
    },
    handleUpdate(row) {
      this.$router.push({path: '/pms/updateProduct', query: {id: row.id}})
    },
    //处理编辑逻辑
    handleEditCreated(){
      if(this.goods.categoryId!=null) {
        getProductCate(this.goods.categoryId).then(response => {
          console.log(response);
          this.selectProductCateValue.push(response.data.pid);
          this.selectProductCateValue.push(this.goods.categoryId);
        });
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.goods = {goodsSn: '', name: '', categoryId: null, categoryName: '', brandId: null, unit: '', isOnSale: 1, isNew: 1, isHot: 0, icon: '', status: 1, sortOrder: 0}

    }
  }
}
</script>
<style>
.el-card {
  margin-bottom: 20px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
</style>


