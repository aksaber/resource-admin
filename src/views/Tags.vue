<template>
    <div>
        <Form :model="form" inline>
            <FormItem prop="key" label="关键字：" :label-width="70">
                <Input v-model="form.key" placeholder="输入关键字" />
            </FormItem>
            <Button type="primary" @click="search">搜索</Button>
            <Button @click="clearForm">清空</Button>
        </Form>
        <div class="table-pre">
            <Button type="success" @click="add">新增</Button>
            <!-- <Button type="error" @click="delBatch">批量删除</Button> -->
        </div>
        <Table
            border
            stripe
            :columns="columnData"
            :data="tableData"
            @on-selection-change="selChange"
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
            :title="`${isUpdate?'修改':'新增'}标签`"
            :mask-closable="false"
        >
            <Form :model="addForm" :rules="rules" ref="ruleForm" :label-width="95">
                <FormItem prop="id" label="ID" v-show="isUpdate">
                    <Input v-model="addForm.id" disabled />
                </FormItem>
                <FormItem prop="tagName" label="标签名称">
                    <Input v-model="addForm.tagName" placeholder="请输入标签名称" />
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
    name: 'Tags',
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
            form: {
                key: '',
                page: 1,
                size: 10
            },
            total: 0,
            tableData: [],
            showModal: false,
            isUpdate: false,
            selection: [],
            addForm: {
                id: '',
                tagName: '',
                remarks: ''
            },
            rules: {
                tagName: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
            },
            columnData: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '标签名称',
                    key: 'tagName'
                },
                {
                    title: '使用次数',
                    key: 'count'
                },
                {
                    title: '备注',
                    key: 'remarks'
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
                                props: { type: 'error', size: 'small' },
                                attrs: { style: 'font-size: 12px' },
                                on: { click: () => { this.delete(params.row.id) } },
                            }, '删除'),
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
            this.$store.dispatch('TAG_LIST', params)
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
        },
        add() {
            this.isUpdate = false;
            this.showModal = true;
            this.addForm = {
                id: '',
                tagName: '',
                remarks: ''
            }
        },
        edit(row) {
            this.isUpdate = true;
            this.showModal = true;
            this.addForm = {
                id: row.id,
                tagName: row.tagName,
                remarks: row.remarks
            }
        },
        addHandler(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    if (this.isUpdate) {
                        this.$store.dispatch('TAG_UPDATE', this.addForm)
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
                        this.$store.dispatch('TAG_ADD', this.addForm)
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
                content: '<p>是否删除该标签</p>',
                onOk: () => {
                    this.$store.dispatch('RESOURCE_LIST', `tagIds=${id}`)
                        .then(res => {
                            if (res.code == 200) {
                                if (res.data.items.length == 0) {
                                    this.$store.dispatch('TAG_DELETE', id)
                                        .then(res2 => {
                                            if (res2.code == 201) {
                                                this.$Message.success('删除成功');
                                                this.getList();
                                            } else {
                                                this.$Message.error(res2.message);
                                            }
                                        })
                                } else {
                                    this.$Message.warning('该标签存在资源，无法删除');
                                }
                            } else {
                                this.$Message.error(res.message);
                            }
                        })
                }
            });
        },
        delBatch() {
            if (this.selection.length == 0) {
                this.$Message.warning('当前未选中任何数据');
                return
            }
            this.$Modal.confirm({
                title: '批量删除',
                content: '<p>是否批量删除选中的标签</p>',
                onOk: () => {
                    this.$store.dispatch('TAG_DELBATCH', { data: this.selection })
                        .then(res => {
                            if (res.code == 201) {
                                this.$Message.success('批量删除成功');
                                this.getList();
                            } else {
                                this.$Message.error(res.message);
                            }
                        })
                }
            });
        },
        changePage(page) {
            this.form.page = page;
            this.getList();
        },
        pageSizeChange(pageSize) {
            this.form.size = pageSize;
            this.getList();
        },
        selChange(selection) {
            this.selection = selection.map(item => item.id);
        },
    },
}
</script>