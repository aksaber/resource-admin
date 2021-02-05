export default {
    data() {
        return {
            closeBox: true,
            uploadFile: 'http://192.168.0.121:6065/upload/file',
            uploadImage: 'http://192.168.0.121:6065/upload/image',
            course_form: {
                key: '',
                page: 1,
                size: 100
            },
            major_form: {
                key: '',
                page: 1,
                size: 100
            },
            tag_form: {
                key: '',
                page: 1,
                size: 100
            },
            courseList: [],
            majorList: [],
            tagList: [],
        }
    },
    methods: {
        closeLoading() {
            setTimeout(() => {
                this.closeBox = false;
                this.$nextTick(() => {
                    this.closeBox = true;
                })
            }, 200)
        },
        queryParams(form) {
            let params = '';
            for (let key in form) {
                if (form[key]) {
                    params += `${key}=${form[key]}&`
                }
            }
            params = params.substring(0, params.length - 1);
            return params;
        },
        clearVal(name) {
            this.$refs[name].resetFields();
        },
        getCourseList() {
            const params = this.queryParams(this.course_form);
            this.$store.dispatch('COURSE_LIST', params)
                .then(res => {
                    if (res.code == 200) {
                        this.courseList = res.data.items;
                    }
                })
        },
        getMajorList() {
            const params = this.queryParams(this.major_form);
            this.$store.dispatch('MAJOR_LIST', params)
                .then(res => {
                    if (res.code == 200) {
                        this.majorList = res.data.items;
                    }
                })
        },
        getTagList() {
            const params = this.queryParams(this.tag_form);
            this.$store.dispatch('TAG_LIST', params)
                .then(res => {
                    if (res.code == 200) {
                        this.tagList = res.data.items;
                    }
                })
        },
    },
}