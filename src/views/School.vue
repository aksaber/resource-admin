<template>
    <div>
        <Form :model="form" inline>
            <FormItem prop="name" label="学校名称：" :label-width="85">
                <Input v-model="form.name" placeholder="输入学校名称" />
            </FormItem>
            <FormItem prop="city" label="所属城市：" :label-width="85">
                <Select v-model="form.city">
                    <Option
                        v-for="item in cityArr"
                        :key="item.id"
                        :value="item.id"
                    >{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="department" label="学校主管部门：" :label-width="115">
                <Input v-model="form.department" placeholder="输入主管部门" />
            </FormItem>
        </Form>
        <div class="table-pre">
            <Button type="primary" @click="add">新增</Button>
        </div>
        <Table
            border
            stripe
            :columns="columnData"
            :data="tableData"
        ></Table>
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
            :title="`${isUpdate?'修改':'新增'}学校信息`"
            :mask-closable="false"
        >
            <Form :model="addForm" :rules="rules" ref="ruleForm" :label-width="70">
                <FormItem prop="id" label="ID" v-show="isUpdate">
                    <Input v-model="addForm.id" />
                </FormItem>
                <FormItem prop="provinceId" label="省级ID">
                    <Input v-model="addForm.provinceId" />
                </FormItem>
                <FormItem prop="cityId" label="城市ID">
                    <Input v-model="addForm.cityId" />
                </FormItem>
                <FormItem prop="universityLevel" label="办学层次">
                    <Input v-model="addForm.universityLevel" />
                </FormItem>
                <FormItem prop="universityCode" label="学校代码">
                    <Input v-model="addForm.universityCode"  />
                </FormItem>
                <FormItem prop="universityName" label="学校">
                    <Input v-model="addForm.universityName" />
                </FormItem>
                <FormItem prop="remarks" label="备注">
                    <Input v-model="addForm.remarks" type="textarea" :rows="4" />
                </FormItem>
            </Form>
            <div slot="footer" class="footer">
                <Button type="primary" @click="addHandler('ruleForm')">保存</Button>
                <Button @click="() => this.showModal = false">取消</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import mixin from '@/mixin'
export default {
    name: 'School',
    mixins: [mixin],
    data() {
        return {
            form: {
                name: '',
                city: '',
                department: '',
                page: 1,
                size: 10
            },
            total: 0,
            tableData: [],
            showModal: false,
            isUpdate: false,
            cityArr: [],
            addForm: {
                id: '',
                universityCode: '',
                universityName: '',
                cityId: '',
                provinceId: '',
                remarks: '',
                universityLevel: ''
            },
            rules: {},
            columnData: [
                {
                    title: '城市ID',
                    key: 'cityId'
                },
                {
                    title: '省级ID',
                    key: 'provinceId'
                },
                {
                    title: '主管部门',
                    key: 'competentDepartment'
                },
                {
                    title: '备注',
                    key: 'remarks'
                },
                {
                    title: '学校代码',
                    key: 'universityCode'
                },
                {
                    title: '办学层次',
                    key: 'universityLevel'
                },
                {
                    title: '学校',
                    key: 'universityName'
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    sortable: true
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                attrs: {
                                    style: 'margin-right: 10px; color: #0000ff; cursor: pointer'
                                },
                                on: {
                                    click: () => {
                                        this.edit(params.row)
                                    }
                                },
                            }, '编辑')
                        ])
                    }
                },
            ],
        }
    },
    mounted() {
        this.getList();
    },
    methods: {
        getList() {
            const params = this.queryParams(this.form);
            this.$store.dispatch('UNIVERSITY_LIST', params)
                .then(res => {
                    if (res.code == 200) {
                        this.tableData = res.data.items;
                        this.total = res.data.total;
                    }
                })
        },
        add() {
            this.isUpdate = false;
            this.showModal = true;
            this.addForm = {
                id: '',
                universityCode: '',
                universityName: '',
                cityId: '',
                provinceId: '',
                remarks: '',
                universityLevel: ''
            }
        },
        edit(row) {
            this.isUpdate = false;
            this.showModal = true;
            this.addForm = {
                id: row.id,
                universityCode: row.universityCode,
                universityName: row.universityName,
                cityId: row.cityId,
                provinceId: row.provinceId,
                remarks: row.remarks,
                universityLevel: row.universityLevel
            }
        },
        addHandler(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    if (this.isUpdate) {
                        this.$store.dispatch('UNIVERSITY_UPDATE', this.addForm)
                            .then(res => {
                                if (res.code == 201) {
                                    this.$Message.success('更新成功');
                                    this.getList();
                                    this.showModal = false;
                                } else {
                                    this.$Message.error(res.msg);
                                }
                            })
                    } else {
                        this.$store.dispatch('UNIVERSITY_ADD', this.addForm)
                            .then(res => {
                                if (res.code == 201) {
                                    this.$Message.success('新增成功');
                                    this.getList();
                                    this.showModal = false;
                                } else {
                                    this.$Message.error(res.msg);
                                }
                            })
                    }
                }
            })
        },
        changePage(page) {
            this.form.page = page;
            this.getList();
        },
        pageSizeChange(pageSize) {
            this.form.size = pageSize;
            this.getList();
        },
    },
}
</script>