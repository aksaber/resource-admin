<template>
    <div id="app">
        <Layout :style="{minHeight: '100vh'}">
            <Sider
                class="menuShow"
                collapsible
                :collapsed-width="78"
                v-model="isCollapsed"
                width="256"
                hide-trigger
                style="background: #001529; min-height: 100vh; padding-top: 50px"
            >
                <Menu
                    theme="dark"
                    ref="side_menu"
                    width="auto"
                    :class="menuitemClasses"
                    v-for="(menuItem,menuIndex) in menus"
                    :key="menuIndex"
                    :active-name="$route.name"
                    @on-select="clickMenu(menuItem)"
                >
                    <!-- 展开没有子菜单 -->
                    <MenuItem
                        v-if="!menuItem.children || menuItem.children.length == 0"
                        :key="menuIndex"
                        :name="menuItem.to"
                        :to="menuItem.to"
                    >
                        <Icon :type="menuItem.icon" />
                        <span>{{ menuItem.name }}</span>
                    </MenuItem>
                    <!-- 展开有子菜单 -->
                    <Submenu v-else :name="menuIndex">
                        <template slot="title">
                            <Icon :type="menuItem.icon" />
                            <span>{{ menuItem.name }}</span>
                        </template>
                        <MenuItem
                            v-for="(item,index) in menuItem.children"
                            :key="index"
                            :name="item.to"
                            :to="item.to"
                        >{{ item.name }}</MenuItem>
                    </Submenu>
                </Menu>
            </Sider>
            <Layout>
                <Header :menus="menus" />
                <Content style="padding: 0 16px 16px">
                    <Card>
                        <router-view />
                    </Card>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>

<script>
import Header from '@/components/Header'
import { mapState, mapMutations } from 'vuex';
export default {
    name: 'App',
    data() {
        return {
            isCollapsed: false,
            menus: [
                {
                    name: '首页',
                    to: '/',
                    icon: 'ios-home'
                },
                {
                    name: '用户管理',
                    icon: 'md-person',
                    to: 'user'
                },
                {
                    name: '资源管理',
                    icon: 'md-mail',
                    to: 'resource'
                },
                {
                    name: '专业管理',
                    icon: 'ios-book',
                    to: 'major'
                },
                {
                    name: '课程管理',
                    icon: 'ios-school',
                    to: 'course'
                },
                {
                    name: '标签管理',
                    icon: 'ios-pricetags',
                    to: 'tags'
                },
            ],
        }
    },
    components: { Header },
    created() {
        this.setLocalTagsList(JSON.parse(localStorage.getItem('tagsList')));
    },
    computed: {
        ...mapState(['tagsList', 'activePath']),
        menuitemClasses() {
            return ['menu-item', this.isCollapsed ? 'collapsed-menu' : '']
        },
    },
    methods: {
        ...mapMutations(['selectTags', 'closeTag', 'setPath', 'setLocalTagsList']),
        setCollapsed() {
            this.isCollapsed = !this.isCollapsed;
        },
        clickMenu(item) {
            // 将数据存储在store中
            this.selectTags(item);
            this.setPath(item.name);
        },
    },
}
</script>

<style lang="less">
@import './assets/css/common.css';
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100%;
    .ivu-menu-dark {
        background: #001529;
    }
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title {
        background: #001529;
    }
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened {
        background: #101117;
    }
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title:hover {
        background: #001529;
    }
    .menuShow {
        transition: all .1s;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .1s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
}
.layout-con{
    height: 100%;
    width: 100%;
}
.menu-item span{
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
    font-size: 15px;
}
.menu-item i{
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 24px;
}
.collapsed-menu span{
    width: 0px;
    transition: width .2s ease;
}
.collapsed-menu i{
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
}
.table-pre {
    margin-bottom: 10px;
}
.detail-title {
    display: inline-block;
    width: 100px;
    font-weight: bold;
    text-align: right;
    margin-right: 20px;
    margin-bottom: 15px;
}
button {
    margin-right: 5px!important;
}
</style>
