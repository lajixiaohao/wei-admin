<template>
  <el-container>
    <el-aside :width="isCollapse ? '64px' : '220px'">
      <div class="side-top">
        <img src="@/assets/logo.jpeg">
        <span v-show="!isCollapse" class="system">{{ webAbbreviation }}</span>
      </div>
      <div class="side-menu">
        <el-menu
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409eff"
          unique-opened
          router
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="activeNav">
          <el-menu-item index="/dashboard">
            <svg-icon icon-class="home" />
            <span slot="title">首页</span>
          </el-menu-item>
          <template v-for="v1 in menus">
            <template v-if="v1.children.length">
              <el-submenu :index="v1.id+''" :key="v1.id">
                <template slot="title">
                  <svg-icon :icon-class="v1.icon" />
                  <span>{{ v1.title }}</span>
                </template>
                <template v-for="v2 in v1.children">
                  <template v-if="v2.children.length">
                    <el-submenu :index="v2.id+''" :key="v2.id">
                      <template slot="title">
                        <svg-icon :icon-class="v2.icon" />
                        <span>{{ v2.title }}</span>
                      </template>
                      <template v-for="v3 in v2.children">
                        <el-menu-item :index="v3.path+'/index'" :key="v3.id">
                          <svg-icon :icon-class="v3.icon" />
                          <span slot="title">{{ v3.title }}</span>
                        </el-menu-item>
                      </template>
                    </el-submenu>
                  </template>
                  <template v-else>
                    <el-menu-item :index="v2.path+'/index'" :key="v2.id">
                      <svg-icon :icon-class="v2.icon" />
                      <span slot="title">{{ v2.title }}</span>
                    </el-menu-item>
                  </template>
                </template>
              </el-submenu>
            </template>
            <template v-else>
              <el-menu-item :index="v1.path+'/index'" :key="v1.id">
                <svg-icon :icon-class="v1.icon" />
                <span slot="title">{{ v1.title }}</span>
              </el-menu-item>
            </template>
          </template>
        </el-menu>
      </div>
    </el-aside>
    <el-container>
      <el-header height="82px">
        <div class="head1">
          <div class="head-left">
            <span @click="isCollapse = !isCollapse">
              <svg-icon :icon-class="isCollapse ? 'indent' : 'outdent'" />
            </span>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item v-if="isActive('/dashboard') === false" :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-else>首页</el-breadcrumb-item>
              <el-breadcrumb-item v-for="(item, index) in getBreadcrumb" :key="index">
                <router-link v-if="item.path" :to="item.path">{{ item.title }}</router-link>
                <span v-else style="color: #909399;">{{ item.title }}</span>
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div>
            <el-dropdown trigger="click" size="medium" @command="handleCommand">
              <span class="el-dropdown-link">
                {{ adminName }}<i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                <el-dropdown-item command="quit">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="tags-view">
          <router-link
            v-for="tag in tagViews"
            :key="tag.path"
            :to="{ path: tag.path, query: tag.query }"
            :class="{active: isActive(tag.path)}"
            class="tags-view-item"
            @click.middle.native="closeSelectedTag(tag)"
            @contextmenu.prevent.native="openMenu(tag,$event)">
            {{ tag.title }}
            <span v-if="tag.name !== 'Dashboard'" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
          </router-link>
          <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
            <li @click="refreshSelectedTag">刷新</li>
            <li v-show="selectedTag.name !== 'Dashboard'" @click="closeSelectedTag(selectedTag)">关闭</li>
            <li @click="closeOthersTags">关闭其他</li>
            <li @click="closeAllTags">关闭全部</li>
          </ul>
        </div>
      </el-header>
      <el-main>
        <transition name="slide-fade" mode="out-in">
          <keep-alive :include="cachedViews">
            <router-view />
          </keep-alive>
        </transition>
      </el-main>
      <el-footer height="30px">&copy; {{ footerData }}</el-footer>
    </el-container>
  </el-container>
</template>

<script>
import { removeToken } from '@/common/utils/auth'
import { logout } from '@/common/api/public'
import Config from '@/settings'
import { mapGetters } from 'vuex'

export default {
  name: 'Layout',
  data () {
    return {
      isCollapse: false,
      visible: false,
      left: 0,
      top: 0,
      selectedTag: {},
      webAbbreviation: Config.webAbbreviation
    }
  },
  computed: {
    ...mapGetters([
      'adminName',
      'menus',
      'tagViews',
      'cachedViews'
    ]),
    getBreadcrumb () {
      return this.$route.meta.breadcrumb || []
    },
    activeNav () {
      if (this.$route.meta.breadcrumb !== undefined) {
        for (const i in this.$route.meta.breadcrumb) {
          if (this.$route.meta.breadcrumb[i].path.length) {
            return this.$route.meta.breadcrumb[i].path
          }
        }
      }
      return this.$route.path
    },
    footerData () {
      const date = new Date()
      const startYear = Config.startYear
      const toYear = date.getFullYear()
      const year = (startYear === toYear ? startYear : startYear + ' - ' + toYear)
      return year + ' ' + Config.webTitle + ' V' + Config.version
    }
  },
  watch: {
    $route () {
      this.addTags()
    },
    visible (value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted () {
    this.addTags()
  },
  methods: {
    addTags () {
      const noCachedViews = ['Redirect']
      const { name } = this.$route
      if (name && !noCachedViews.includes(name)) {
        this.$store.dispatch('addView', this.$route)
      }
      return true
    },
    handleCommand (command) {
      if (command === 'profile') {
        if (!this.isActive('/profile/index')) {
          this.$router.push('/profile')
        }
      }
      if (command === 'quit') {
        this.quit()
      }
    },
    quit () {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '是的',
        cancelButtonText: '再想想',
        type: 'warning'
      }).then(() => {
        logout().then(res => {
          this.$message.success(res.msg)
          this.pageReload()
        }).catch(() => {
          this.pageReload()
        })
      }).catch(() => {})
    },
    pageReload () {
      removeToken()
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    },
    isActive (path) {
      return this.$route.path === path
    },
    openMenu (tag, e) {
      this.visible = true
      this.selectedTag = tag

      this.top = e.clientY
      this.left = e.clientX
    },
    closeMenu () {
      this.visible = false
    },
    closeSelectedTag (tag) {
      const i = this.cachedViews.indexOf(tag.name)
      if (i > 0) {
        this.$store.dispatch('deleteCachedView', i)
      }

      const j = this.tagViews.indexOf(tag)
      if (j > 0) {
        this.$store.dispatch('deleteTagView', j).then(() => {
          if (this.isActive(tag.path)) {
            this.$router.push(this.tagViews[(j - 1)].fullPath)
          }
        })
      }
    },
    refreshSelectedTag () {
      this.$store.dispatch('refreshView', this.selectedTag.name).then(() => {
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + this.selectedTag.fullPath
          })
        })
      })
    },
    closeOthersTags () {
      this.$store.dispatch('deleteOtherView', this.selectedTag).then(() => {
        if (this.isActive(this.selectedTag.path) === false) {
          this.$router.push(this.selectedTag.fullPath)
        }
      })
    },
    closeAllTags () {
      this.$store.dispatch('deleteAllView').then(() => {
        if (this.isActive('/dashboard') === false) {
          this.$router.push('/dashboard')
        }
      })
    }
  }
}
</script>

<style>
  .el-container {
    height: 100%;
    overflow-y: hidden;
  }
  .el-aside {
    background-color: #304156;
    transition: width .3s ease-in-out;
  }
  .side-top {
    width: 100%;
    height: 60px;
    line-height: 50px;
    overflow: hidden;
    text-align: center;
  }
  .side-top img {
    width: 40px;
    height: 40px;
    vertical-align: middle;
    margin-right: 6px;
    border-radius: 50%;
  }
  .side-top .system {
    font-size: 14px;
    color: #fff;
    font-weight: 600;
  }
  .side-menu .el-menu {
    border-right: 0;
  }
  .el-submenu .el-menu-item {
    background-color: #1F2D3D!important;
  }
  .el-submenu .el-submenu .el-submenu__title {
    background-color: #213042!important;
  }
 .el-menu-item:hover {
    background-color: #141e2a!important;
  }
  .el-menu-item .svg-icon, .el-submenu .svg-icon {
    margin-right: 10px;
  }
  .el-header {
    padding: 0 !important;
  }
  .head1 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    padding: 0 20px;
    box-shadow: 0 1px 1px #e6e6e6;
  }
  .head-left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .head-left .svg-icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .el-breadcrumb {
    margin-left: 20px;
  }
  .el-footer {
    line-height: 30px;
    border-top: 1px #e6e6e6 solid;
    font-size: 12px;
    color: #737373;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #686868;
    margin-right: 10px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .tags-view {
    height: 30px;
    box-shadow: 0 2px 4px #d9d9d9;
    display: flex;
    align-items: center;
  }
  .tags-view-item {
    font-size: 12px;
    padding: 4px 8px 3px;
    margin-right: 6px;
    cursor: pointer;
    color: #6b6b6b;
    border: 1px #d0d0d0 solid;
    text-decoration: none;
  }
  .tags-view-item:first-of-type {
    margin-left: 20px;
  }
  .tags-view .active {
    background-color: #00b685;
    border-color: #00b685;
    color: #f1f1f1;
  }
  .tags-view .active::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #fff;
    border-radius: 50%;
    margin-right: 3px;
  }
  .tags-view .el-icon-close {
    border-radius: 50%;
    width: 16px;
    height: 16px;
    text-align: center;
    line-height: 16px;
  }
  .tags-view .el-icon-close:hover {
    background-color: #ff6666;
    color: #fff;
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 1000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
  }
  .contextmenu li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
  }
  .contextmenu li:hover {
    background: #eee;
  }
  .slide-fade-enter-active {
    transition: all .3s linear;
  }
  .slide-fade-enter {
    transform: translateX(-10px);
  }
</style>
