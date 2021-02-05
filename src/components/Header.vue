<template>
    <div class="header">
        <div class="flex">
            <Icon
                type="md-menu"
                size="26"
                style="line-height: 60px; margin-right: 20px; cursor: pointer"
                @click="asdasd"
            />
            <Breadcrumb>
                <BreadcrumbItem>首页</BreadcrumbItem>
                <BreadcrumbItem>{{ routeName }}</BreadcrumbItem>
            </Breadcrumb>
        </div>
        <div class="tags">
            <Tag
                closable
                type="dot"
                size="medium"
                :color="$route.path=='/'?'/':$route.path.replace('/','')===tag.to?'primary':'default'"
                style="cursor: pointer"
                v-for="(tag, index) in tags"
                :key="`tag-nav-${index}`"
                :name="tag.name"
                @on-close="handleClose(tag, index)"
                @click.native="handleClick(tag)"
            >{{ tag.name }}</Tag>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
    name: 'Headers',
    data() {
        return {
            tags: [],
        }
    },
    props: {
        menus: {}
    },
    created() {
        this.tags = this.tagsList;
    },
    computed: {
        ...mapState(['tagsList', 'activePath']),
        routeName() {
            const path = this.$route.path == '/' ? '/' : this.$route.path.replace('/', '');
            let name = '';
            for (let i = 0; i < this.menus.length; i++) {
                if (this.menus[i].children) {
                    const index = this.menus[i].children.findIndex(item2 => item2.to == path)
                    if ( index > -1 ) {
                        name = this.menus[i].children[index].name;
                        break;
                    }
                } else {
                    if (this.menus[i].to == path) {
                        name = this.menus[i].name;
                        break;
                    }
                }
            }
            return name
        },
    },
    methods: {
        ...mapMutations(['closeTag', 'setPath']),
        handleClose(tag, index) {
            if (this.tags.length === 1) {
                // 只有一个标签则不能关闭
                return
            }
            // 删除当前tag
            this.closeTag(tag);
            const path = this.$route.path == '/' ? '/' : this.$route.path.replace('/', '');
            if (path !== tag.to) {
                // 如果关闭的标签不是当前路由的话，不做路由跳转
                return
            } else {
                if (index === (this.tags.length - 1)) {
                    // 关闭倒数第二个标签时，则路由跳转至最后一个
                    this.$router.push(this.tags[index].to);
                    this.setPath(this.tags[index].name);
                } else {
                    // 路由跳转至下一个标签
                    if (index === 0) {
                        // 删的是第一个标签
                        this.$router.push(this.tags[0].to);
                        this.setPath(this.tags[0].name);
                    } else {
                        // 删的不是第一个标签
                        this.$router.push(this.tags[index-1].to);
                        this.setPath(this.tags[index-1].name);
                    }
                }
            }
        },
        handleClick(tag) {
            if (this.activePath == tag.name) return
            this.$router.push(tag.to);
            this.setPath(tag.name);
        },
        asdasd() {
            alert(1111111)
        },
    },
}
</script>

<style lang="less" scope>
.header {
    background: #fff!important;
    // box-shadow: 0 2px 3px 2px rgba(0, 0, 0, .1);
    padding: 0 20px 15px 20px;
    margin-bottom: 10px;
    >.flex {
        height: 60px;
        line-height: 60px;
    }
}
</style>