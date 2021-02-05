<template>
    <div>
        <Form :model="form" inline>
            <FormItem prop="key" label="关键字：" :label-width="70">
                <Input v-model="form.key" placeholder="输入关键字" />
            </FormItem>
            <FormItem prop="courseId" label="所属课程：" :label-width="85" style="width: 220px">
                <Select v-model="form.courseId">
                    <Option
                        v-for="item in courseList"
                        :key="item.id"
                        :value="item.id"
                    >{{ item.courseName }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="majorId" label="所属专业：" :label-width="85" style="width: 220px">
                <Select v-model="form.majorId">
                    <Option
                        v-for="item in majorList"
                        :key="item.id"
                        :value="item.id"
                    >{{ item.majorName }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="tagIds" label="资源标签：" :label-width="85" style="width: 220px">
                <Select v-model="form.tagIds">
                    <Option
                        v-for="item in tagList"
                        :key="item.id"
                        :value="item.id"
                    >{{ item.tagName }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="resourcesStatus" label="状态：" :label-width="55" style="width: 220px">
                <Select v-model="form.resourcesStatus">
                    <Option value="0">下架</Option>
                    <Option value="1">上架</Option>
                </Select>
            </FormItem>
            <FormItem prop="isHot" label="是否热门：" :label-width="85" style="width: 220px">
                <Select v-model="form.isHot">
                    <Option value="true">是</Option>
                    <Option value="false">否</Option>
                </Select>
            </FormItem>
            <FormItem prop="isVip" label="是否VIP资源：" :label-width="110" style="width: 220px">
                <Select v-model="form.isVip">
                    <Option value="true">是</Option>
                    <Option value="false">否</Option>
                </Select>
            </FormItem>
            <Button type="primary" @click="search">搜索</Button>
            <Button @click="clearForm">清空</Button>
        </Form>
        <div class="table-pre" style="margin-top: 5px">
            <Button type="success" @click="add">新增</Button>
        </div>
        <Table
            border
            stripe
            :columns="columnData"
            :data="tableData"
        >
            <template slot-scope="{row}" slot="isHot">
                <Tag color="red" v-if="row.isHot">热门</Tag>
                <Tag color="cyan" v-else>普通</Tag>
            </template>
            <template slot-scope="{row}" slot="isVip">
                <Tag color="red" v-if="row.isVip">VIP</Tag>
                <Tag color="cyan" v-else>普通</Tag>
            </template>
            <template slot-scope="{row}" slot="courseId">
                <span v-if="row.courseId">{{ row.courseId | courseFilter(that) }}</span>
            </template>
            <template slot-scope="{row}" slot="majorId">
                <span v-if="row.majorId">{{ row.majorId | majorFilter(that) }}</span>
            </template>
            <template slot-scope="{row}" slot="tagIds">
                <Tag
                    v-for="item in JSON.parse(row.tagIds)"
                    :key="item"
                    color="geekblue"
                >{{ item | tagFilter(that) }}</Tag>
            </template>
            <template slot-scope="{row}" slot="resourcesStatus">
                <Tag color="green" v-if="row.resourcesStatus==1">上架</Tag>
                <Tag color="default" v-else>下架</Tag>
            </template>
        </Table>
        <Page
            :total="total"
            :page-size="form.size"
            show-sizer
            show-total
            :page-size-opts="[20, 50, 100]"
            @on-page-size-change="pageSizeChange"
            style="margin-top: 20px"
            @on-change="changePage"
        />
        <Modal
            v-model="showModal"
            :title="`${isUpdate?'修改':'新增'}资源信息`"
            :mask-closable="false"
        >
            <Form :model="addForm" :rules="rules" ref="ruleForm" :label-width="95">
                <FormItem prop="id" label="ID" v-show="isUpdate">
                    <Input v-model="addForm.id" disabled />
                </FormItem>
                <FormItem prop="docName" label="文件名">
                    <Input v-model="addForm.docName" placeholder="请输入文件名" />
                </FormItem>
                <FormItem prop="majorId" label="所属专业">
                    <Select v-model="addForm.majorId">
                        <Option
                            v-for="item in majorList"
                            :value="item.id"
                            :key="item.id"
                        >{{ item.majorName }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="courseId" label="所属课程">
                    <Select
                        v-model="addForm.courseId"
                        v-select-loadmore="getCourseList"
                    >
                        <Option
                            v-for="item in courseList"
                            :value="item.id"
                            :key="item.id"
                        >{{ item.courseName }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="docUrl" label="文件资源">
                    <Upload
                        ref="upload"
                        :action="uploadFile"
                        :format="['xlsx','xls','pdf','doc','docx']"
                        :on-success="handleSuccess"
                    >
                        <Button>文件上传</Button>
                    </Upload>
                </FormItem>
                <FormItem prop="imageUrl" label="封面图">
                    <Upload
                        ref="upload"
                        :action="uploadImage"
                        :format="['jpg','jpeg','png']"
                        :on-success="handleSuccess2"
                        :show-upload-list="false"
                        style="display: inline-block; margin-right: 10px; vertical-align: bottom;"
                    >
                        <Button style="width: 100%">{{addForm.imageUrl?'替换图片':'图片上传'}}</Button>
                    </Upload>
                    <a
                        href="javascript:;"
                        style="margin-left: 5px"
                        @click="checkPic(addForm.imageUrl)"
                        v-show="addForm.imageUrl"
                    >查看图片</a>
                </FormItem>
                <FormItem prop="tagIds" label="资源标签">
                    <Select v-model="addForm.tagIds" multiple v-if="addForm.tagIds">
                        <Option
                            v-for="item in tagList"
                            :value="item.id"
                            :key="item.id"
                        >{{ item.tagName }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="sortBy" label="排序">
                    <Input v-model="addForm.sortBy" />
                </FormItem>
                <Row>
                    <Col span="12">
                        <FormItem prop="isHot" label="是否热门">
                            <i-switch v-model="addForm.isHot" />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem prop="isVip" label="是否VIP资源">
                            <i-switch v-model="addForm.isVip" />
                        </FormItem>
                    </Col>
                </Row>
                <FormItem prop="remarks" label="备注">
                    <Input v-model="addForm.remarks" type="textarea" :rows="4" />
                </FormItem>
            </Form>
            <div slot="footer" class="footer">
                <Button type="primary" @click="addHandler('ruleForm')">保存</Button>
                <Button @click="() => this.showModal = false">取消</Button>
            </div>
        </Modal>
        <Modal
            v-model="showDetail"
            :title="detailData.docName"
            :mask-closable="false"
            width="50%"
        >
            <Row>
                <Col span="24">
                    <span class="detail-title">文件名：</span>
                    <span class="detail-content">{{ detailData.docName }}</span>
                </Col>
                <Col span="12">
                    <span class="detail-title">浏览次数：</span>
                    <span>{{ detailData.browseCount }}</span>
                </Col>
                <Col span="12">
                    <span class="detail-title">下载次数：</span>
                    <span>{{ detailData.downloadCount }}</span>
                </Col>
                <Col span="12">
                    <span class="detail-title">是否热门：</span>
                    <Tag color="red" v-if="detailData.isHot">热门</Tag>
                    <Tag color="cyan" v-else>普通</Tag>
                </Col>
                <Col span="12">
                    <span class="detail-title">是否VIP资源：</span>
                    <Tag color="red" v-if="detailData.isVip">VIP</Tag>
                    <Tag color="cyan" v-else>普通</Tag>
                </Col>
                <Col span="12">
                    <span class="detail-title">所属专业：</span>
                    <span v-if="detailData.majorId">{{ detailData.majorId | majorFilter(that) }}</span>
                </Col>
                <Col span="12">
                    <span class="detail-title">所属课程：</span>
                    <span v-if="detailData.courseId">{{ detailData.courseId | courseFilter(that) }}</span>
                </Col>
                <Col span="12">
                    <span class="detail-title">文件扩展名：</span>
                    <span>{{ detailData.docExt }}</span>
                </Col>
                <Col span="12">
                    <span class="detail-title">文件大小：</span>
                    <span>{{ detailData.docSize }}字节</span>
                </Col>
                <!-- <Col span="12">
                    <span class="detail-title">文件资源：</span>
                    <img :src="detailData.docUrl" alt="文件资源" width="100" />
                </Col> -->
                <Col span="12">
                    <span class="detail-title">排序：</span>
                    <span>{{ detailData.sortBy }}</span>
                </Col>
                <Col span="12">
                    <span class="detail-title">状态：</span>
                    <Tag color="green" v-if="detailData.resourcesStatus==1">上架</Tag>
                    <Tag color="default" v-else>下架</Tag>
                </Col>
                <Col span="12">
                    <span class="detail-title">上传者：</span>
                    <span>{{ detailData.author }}</span>
                </Col>
                <Col span="12">
                    <span class="detail-title">创建时间：</span>
                    <span>{{ detailData.createTime }}</span>
                </Col>
                <Col span="24">
                    <span class="detail-title">资源标签：</span>
                    <Tag
                        v-for="item in detailData.tagIds"
                        :key="item"
                        color="geekblue"
                        v-if="detailData.tagIds"
                    >{{ item | tagFilter(that) }}</Tag>
                </Col>
                <Col span="24">
                    <span class="detail-title">备注：</span>
                    <span>{{ detailData.remarks }}</span>
                </Col>
            </Row>
        </Modal>
    </div>
</template>

<script>
import mixin from '@/mixin'
export default {
    name: 'Resource',
    mixins: [mixin],
    data() {
        const isEmpty = (rule, value, callback) => {
            if (value === null || value === undefined || value === '') {
                callback(new Error('不能为空'))
            } else {
                callback();
            }
        }
        return {
            that: this,
            form: {
                key: '',
                courseId: '',
                majorId: '',
                tagIds: '',
                resourcesStatus: '',
                isHot: '',
                isVip: '',
                page: 1,
                size: 10
            },
            total: 0,
            tableData: [],
            showModal: false,
            showDetail: false,
            isUpdate: false,
            cityArr: [],
            addForm: {
                id: '',
                docName: '',
                imageUrl: '',
                browseCount: '',
                downloadCount: '',
                isHot: '',
                isVip: '',
                majorId: '',
                courseId: '',
                docExt: '',
                docSize: '',
                docUrl: '',
                tagIds: [],
                sortBy: '',
                remarks: '',
                resourcesStatus: '',
                author: ''
            },
            detailData: {
                id: '',
                docName: '',
                imageUrl: '',
                browseCount: '',
                downloadCount: '',
                isHot: '',
                isVip: '',
                majorId: '',
                courseId: '',
                docExt: '',
                docSize: '',
                docUrl: '',
                tagIds: [],
                sortBy: '',
                remarks: '',
                resourcesStatus: '',
                author: '',
                createTime: ''
            },
            rules: {
                docName: [{ required: true, message: '请输入文件名', trigger: 'blur' }],
                docUrl: [{ required: true, message: '请上传文件', trigger: 'blur' }],
                imageUrl: [{ required: true, message: '请上传封面图', trigger: 'blur' }],
                majorId: [{required: true, message: '专业不能为空', trigger: 'blur', validator: isEmpty}],
                courseId: [{required: true, message: '课程不能为空', trigger: 'blur', validator: isEmpty}],
            },
            columnData: [
                {
                    title: '文件名',
                    key: 'docName'
                },
                {
                    title: '浏览次数',
                    key: 'browseCount',
                    align: 'center',
                    width: 95
                },
                {
                    title: '下载次数',
                    key: 'downloadCount',
                    align: 'center',
                    width: 95
                },
                {
                    title: '热门',
                    slot: 'isHot',
                    align: 'center',
                    width: 85
                },
                {
                    title: 'VIP',
                    slot: 'isVip',
                    align: 'center',
                    width: 85
                },
                {
                    title: '所属课程',
                    slot: 'courseId'
                },
                {
                    title: '所属专业',
                    slot: 'majorId'
                },
                {
                    title: '资源标签',
                    slot: 'tagIds'
                },
                {
                    title: '排序',
                    key: 'sortBy',
                    align: 'center',
                    width: 85
                },
                {
                    title: '状态',
                    slot: 'resourcesStatus',
                    align: 'center',
                    width: 85
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    sortable: true,
                    width: 180,
                    align: 'center'
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    width: 220,
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: { type: 'warning', size: 'small' },
                                attrs: { style: 'font-size: 12px' },
                                on: { click: () => { this.edit(params.row) } },
                            }, '编辑'),
                            h('Button', {
                                props: { type: 'primary', size: 'small' },
                                attrs: { style: 'font-size: 12px' },
                                on: { click: () => { this.detail(params.row) } },
                            }, '详情'),
                            h('Button', {
                                props: { type: 'error', size: 'small' },
                                attrs: { style: 'font-size: 12px' },
                                on: { click: () => { this.delete(params.row.id) } },
                            }, '删除'),
                            h('Button', {
                                props: { type: 'info', size: 'small'},
                                attrs: { style: 'font-size: 12px' },
                                on: { click: () => { this.standStatus(params.row) } },
                            }, params.row.resourcesStatus==1?'下架':'上架'),
                        ])
                    }
                },
            ],
        }
    },
    created() {
        this.getCourseList();
        this.getMajorList();
        this.getTagList();
    },
    mounted() {
        this.getList();
    },
    methods: {
        getList() {
            const params = this.queryParams(this.form);
            this.$store.dispatch('RESOURCE_LIST', params)
                .then(res => {
                    if (res.code == 200) {
                        this.tableData = res.data.items;
                        this.total = res.data.total;
                    }
                })
        },
        search() {
            this.form.page = 1;
            this.getList();
        },
        clearForm() {
            this.form.key = '';
            this.form.courseId = '';
            this.form.majorId = '';
            this.form.tagIds = '';
            this.form.resourcesStatus = '';
            this.form.isHot = '';
            this.form.isVip = '';
        },
        add() {
            this.isUpdate = false;
            this.showModal = true;
            this.addForm = {
                id: '',
                docName: '',
                imageUrl: '',
                browseCount: '',
                downloadCount: '',
                isHot: false,
                isVip: false,
                majorId: '',
                courseId: '',
                docExt: '',
                docSize: '',
                docUrl: '',
                tagIds: [],
                sortBy: '',
                remarks: '',
                resourcesStatus: '',
                author: ''
            }
        },
        edit(row) {
            this.isUpdate = true;
            this.showModal = true;
            this.addForm = {
                id: row.id,
                docName: row.docName,
                imageUrl: row.imageUrl,
                browseCount: row.browseCount,
                downloadCount: row.downloadCount,
                isHot: row.isHot,
                isVip: row.isVip,
                majorId: row.majorId,
                courseId: row.courseId,
                docExt: row.docExt,
                docSize: row.docSize,
                docUrl: row.docUrl,
                tagIds: JSON.parse(row.tagIds),
                sortBy: row.sortBy,
                remarks: row.remarks,
                resourcesStatus: row.resourcesStatus,
                author: row.author
            }
            console.log(this.addForm)
        },
        detail(row) {
            this.showDetail = true;
            this.detailData = {
                id: row.id,
                docName: row.docName,
                imageUrl: row.imageUrl,
                browseCount: row.browseCount,
                downloadCount: row.downloadCount,
                isHot: row.isHot,
                isVip: row.isVip,
                majorId: row.majorId,
                courseId: row.courseId,
                docExt: row.docExt,
                docSize: row.docSize,
                docUrl: row.docUrl,
                tagIds: JSON.parse(row.tagIds),
                sortBy: row.sortBy,
                remarks: row.remarks,
                resourcesStatus: row.resourcesStatus,
                author: row.author,
                createTime: row.createTime
            }
        },
        addHandler(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    this.addForm.tagIds = JSON.stringify(this.addForm.tagIds);
                    if (this.isUpdate) {
                        this.$store.dispatch('RESOURCE_UPDATE', this.addForm)
                            .then(res => {
                                if (res.code == 201) {
                                    this.$Message.success('更新成功');
                                    this.getList();
                                    this.showModal = false;
                                } else {
                                    this.$Message.error(res.message);
                                }
                            })
                    } else {
                        this.$store.dispatch('RESOURCE_ADD', this.addForm)
                            .then(res => {
                                if (res.code == 201) {
                                    this.$Message.success('新增成功');
                                    this.getList();
                                    this.showModal = false;
                                } else {
                                    this.$Message.error(res.message);
                                }
                            })
                    }
                }
            })
        },
        delete(id) {
            this.$Modal.confirm({
                title: '删除',
                content: '<p>是否删除该资源</p>',
                onOk: () => {
                    this.$store.dispatch('RESOURCE_DELETE', id)
                        .then(res => {
                            if (res.code == 201) {
                                this.$Message.success('删除成功');
                                this.getList();
                            } else {
                                this.$Message.error(res.message);
                            }
                        })
                }
            });
        },
        standStatus(row) {
            const status = row.resourcesStatus;
            this.$Modal.confirm({
                title: '状态',
                content: `<p>是否${status==1?'下架':'上架'}该资源</p>`,
                onOk: () => {
                    this.$store.dispatch('RESOURCE_UPDATE', {id: row.id, resourcesStatus: status==1?0:1})
                        .then(res => {
                            if (res.code == 201) {
                                this.$Message.success('更新成功');
                                this.getList();
                            } else {
                                this.$Message.error(res.message);
                            }
                        })
                }
            });
        },
        handleSuccess(res, file, fileList) {
            if (res.code == 201) {
                this.addForm.docExt = file.name.split('.')[1];
                this.addForm.docSize = file.size;
                this.addForm.docUrl = res.data;
            }
        },
        handleSuccess2(res, file, fileList) {
            if (res.code == 201) {
                this.addForm.imageUrl = res.data;
            }
        },
        changePage(page) {
            this.form.page = page;
            this.getList();
        },
        pageSizeChange(pageSize) {
            this.form.size = pageSize;
            this.getList();
        },
        checkPic(url) {
            this.$Modal.info({
                title: '查看图片',
                content: `<img src="${url}" style="max-width: 100%" />`,
                width: '70%'
            })
        }
    },
    filters: {
        tagFilter(id, that) {
            
            if (that.tagList.length > 0) {
                return that.tagList.find(item => item.id == id).tagName
            } else {
                return null
            }
        },
        courseFilter(id, that) {
            if (that.courseList.length > 0) {
                return that.courseList.find(item => item.id == id).courseName
            } else {
                return null
            }
        },
        majorFilter(id, that) {
            if (that.majorList.length > 0) {
                return that.majorList.find(item => item.id == id).majorName
            } else {
                return null
            }
        },
    },
    directives: {
        'select-loadmore': {
            bind(el, binding) {
                // 获取element-ui定义好的scroll盒子
                const SELECTWRAP_DOM = el.querySelector('.ivu-select-dropdown .ivu-select-dropdown-list');
                SELECTWRAP_DOM.addEventListener('scroll', function () {
                    /**
                    * scrollHeight 获取元素内容高度(只读)
                    * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
                    * clientHeight 读取元素的可见高度(只读)
                    * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
                    * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
                    */
                    const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
                    if (condition) {
                        binding.value();
                    }
                });
            }
        }
    },
}
</script>