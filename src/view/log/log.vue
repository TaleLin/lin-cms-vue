<template>
  <div class="log">
    <sticky-top>
      <div class="log-header">
        <div class="header-left"><p class="title">日志信息</p></div>
        <div class="header-right" v-permission="'搜索日志'">
          <lin-search @query="onQueryChange" ref="searchKeywordDom" />
          <el-dropdown style="margin: 0 10px" @command="handleCommand" v-permission="'查询日志记录的用户'">
            <el-button>
              {{ searchUser ? searchUser : '全部人员' }} <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="['全部人员']">全部人员</el-dropdown-item>
                <el-dropdown-item
                  icon="el-icon-user-solid"
                  v-for="(user, index) in users.items"
                  :key="index"
                  :command="[user]"
                  >{{ user }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <lin-date-picker @dateChange="handleDateChange" ref="searchDateDom" class="date"> </lin-date-picker>
        </div>
      </div>
      <el-divider v-if="!keyword"></el-divider>
    </sticky-top>
    <transition name="fade">
      <div class="search" v-if="keyword">
        <p class="search-tip">
          搜索“<span class="search-keyword">{{ keyword }}</span
          >”， 找到 <span class="search-num">{{ totalCount }}</span> 条日志信息
        </p>
        <button class="search-back" @click="backInit">返回全部日志</button>
      </div>
    </transition>
    <div class="content" v-loading="loading">
      <article>
        <section v-for="log in logs" :key="log.id">
          <span class="point-time"></span>
          <aside>
            <p class="things" v-html="log.message"></p>
            <p class="brief">
              <span class="text-yellow">{{ log.username }}</span> {{ $filters.dateTimeFormatter(log.time) }}
            </p>
          </aside>
        </section>
      </article>

      <div v-if="totalCount > count || totalCount === 0">
        <div v-if="logs?.length">
          <el-divider></el-divider>
          <div class="more" :class="{ nothing: finished }">
            <i v-if="more" class="iconfont icon-loading"></i>
            <div v-show="!more && !finished" @click="nextPage">
              <span>查看更多</span> <i class="iconfont icon-gengduo" style="font-size: 14px"></i>
            </div>
            <div v-if="finished">
              <span>{{ totalCount === 0 ? '暂无数据' : '没有更多数据了' }}</span>
            </div>
          </div>
        </div>
        <div class="nothing" v-else>暂无日志信息</div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref, reactive, watch, onMounted, toRefs } from 'vue'

import logModel from 'lin/model/log'
import { searchLogKeyword } from 'lin/util/search'
import LinSearch from '@/component/base/search/lin-search'
import LinDatePicker from '@/component/base/date-picker/lin-date-picker'

export default {
  components: {
    LinSearch,
    LinDatePicker,
  },
  setup() {
    // originally data properties
    const store = useStore()
    const user = computed(() => store.getters.user)
    const permissions = computed(() => store.getters.permissions)

    const count = 10
    const logs = ref([])
    const users = ref([])
    const loading = ref(false)
    const isSearch = ref(false)
    const finished = ref(false)
    const searchDateDom = ref()
    const searchKeywordDom = ref()

    /**
     * Part 1
     * 日志页面初始化
     */
    const initPage = async () => {
      try {
        loading.value = true
        if (user.value.admin || permissions.value.includes('查询日志记录的用户')) {
          users.value = await logModel.getLoggedUsers({})
        }
        const res = await logModel.getLogs({ page: 0, count })
        logs.value = res.items
        loading.value = false
      } catch (err) {
        loading.value = false
        console.error(err.data)
      }
    }
    onMounted(async () => {
      await initPage()
    })

    /**
     * Part 2
     * 根据调解筛选查询日志
     */
    const search = reactive({
      keyword: '',
      searchUser: '',
      searchKeyword: '',
      searchDate: [],
      totalCount: 0,
    })

    const onQueryChange = query => {
      search.searchKeyword = query.trim()
    }
    const handleDateChange = date => {
      search.searchDate = date
    }
    const handleCommand = currentUser => {
      search.searchUser = currentUser[0] // eslint-disable-line
    }
    // 条件检索
    const searchPage = async () => {
      logs.value = []
      loading.value = true
      search.totalCount = 0
      finished.value = false
      const name = search.searchUser === '全部人员' ? '' : search.searchUser

      const res = await logModel.searchLogs({
        page: 0, // 初始化
        keyword: search.searchKeyword,
        name,
        start: search.searchDate[0],
        end: search.searchDate[1],
      })
      if (res) {
        let searchLogs = res.items
        search.totalCount = res.total
        if (search.searchKeyword) {
          searchLogs = searchLogKeyword(search.searchKeyword, searchLogs)
        }
        logs.value = searchLogs
      } else {
        finished.value = true
      }
      isSearch.value = true
      loading.value = false
    }

    watch(
      () => search.searchKeyword,
      newKeyword => {
        // 关键字搜索
        if (newKeyword) {
          search.keyword = newKeyword
          if (search.searchUser) {
            search.keyword = `${search.searchUser} ${newKeyword}`
          }
          if (search.searchDate.length) {
            search.keyword = `${search.searchUser} ${newKeyword} ${search.searchDate[0]}至${search.searchDate[1]}`
          }
        } else {
          search.keyword = ''
          if (search.searchUser) {
            search.keyword = `${search.searchUser}`
          }
          if (search.searchDate.length) {
            search.keyword = `${search.searchUser} ${search.searchDate[0]}至${search.searchDate[1]}`
          }
          searchKeywordDom.value.clear()
        }
        searchPage()
      },
      { lazy: true },
    )

    watch(
      () => search.searchUser,
      newUser => {
        // 用户搜索
        search.keyword = newUser
        if (search.searchKeyword) {
          search.keyword = `${newUser} ${search.searchKeyword}`
        }
        if (search.searchDate.length) {
          search.keyword = `${newUser} ${search.searchKeyword} ${search.searchDate[0]}至${search.searchDate[1]}`
        }
        searchPage()
      },
      { lazy: true },
    )

    watch(
      () => search.searchDate,
      newDate => {
        if (newDate?.length) {
          search.keyword = `${newDate[0]}至${newDate[1]}`
          if (search.searchUser) {
            search.keyword = `${search.searchUser} ${newDate[0]}至${newDate[1]}`
          }
          if (search.searchKeyword) {
            search.keyword = `${search.searchUser} ${search.searchKeyword} ${newDate[0]}至${newDate[1]}`
          }
        } else {
          search.keyword = ''
          isSearch.value = false
          if (search.searchUser) {
            search.keyword = `${search.searchUser}`
          }
          if (search.searchKeyword) {
            search.keyword = `${search.searchUser} ${search.searchKeyword}`
          }
          searchDateDom.value.clear()
        }
        searchPage()
      },
      { lazy: true },
    )

    const backInit = async () => {
      search.searchUser = ''
      search.searchKeyword = ''
      search.searchDate = []
      search.keyword = ''
      search.totalCount = 0
      logs.value = []
      isSearch.value = false
      await initPage()
    }

    /**
     * Part 3
     * 翻页处理
     */
    const more = ref(false)
    const nextPage = async () => {
      more.value = true
      let res
      try {
        if (isSearch.value) {
          res = await logModel.moreSearchPage()
        } else {
          res = await logModel.moreLogPage()
        }

        let moreLogs = res.items
        if (!moreLogs.length) {
          finished.value = true
        } else {
          if (isSearch.value && search.searchKeyword) {
            moreLogs = await searchLogKeyword(search.searchKeyword, moreLogs)
          }
          logs.value = logs.value.concat(moreLogs)
        }

        more.value = false
      } catch (error) {
        console.error('error', error)

        if (error.data.code === 10020) {
          finished.value = true
        }
        more.value = false
      }
    }

    return {
      users,
      logs,
      more,
      count,
      loading,
      finished,
      backInit,
      nextPage,
      isSearch,
      onQueryChange,
      handleCommand,
      searchDateDom,
      handleDateChange,
      searchKeywordDom,
      ...toRefs(search),
    }
  },
}
</script>

<style lang="scss" scoped>
.log :v-deep(.el-button) {
  padding-top: 10px;
  padding-bottom: 10px;
}
.log {
  .log-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    margin-bottom: -24px;

    .header-left {
      float: left;

      .title {
        height: 59px;
        line-height: 59px;
        color: #4c76af;
        font-size: 16px;
        font-weight: 500;
      }
    }

    .header-right {
      float: right;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .search {
    height: 52px;
    width: 100%;
    background: rgba(57, 99, 188, 0.1);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 24px;

    .search-tip {
      margin-left: 40px;
      height: 52px;
      line-height: 52px;
      color: #354058;
      font-size: 14px;

      .search-keyword {
        color: $theme;
      }

      .search-num {
        color: #f4516c;
      }
    }

    .search-back {
      margin: 8px 20px;
      height: 32px;
      background: #f4516c;
      border: none;
      border-radius: 2px;
      color: #fff;
      padding: 0 13px;
      font-size: 14px;
      cursor: pointer;
    }
  }

  .content {
    padding: 40px 60px;

    article {
      position: relative;
      margin-bottom: -24px;

      section {
        padding: 0 0 36px;
        position: relative;

        &:before {
          content: '';
          width: 1px;
          top: 7px;
          bottom: -17px;
          left: 10.5px;
          background: #f3f3f3;
          position: absolute;
        }

        &:last-child:before {
          display: none;
        }

        .point-time {
          content: '';
          position: absolute;
          width: 10px;
          height: 10px;
          top: 2px;
          left: 10px;
          background: $theme;
          margin-left: -4px;
          border-radius: 50%;
        }

        time {
          width: 15%;
          display: block;
          position: absolute;

          span {
            display: block;
            text-align: right;
          }
        }

        aside {
          color: #45526b;
          margin-left: 30px;

          .things {
            font-size: 14px;
            color: #45526b;
            margin-bottom: 15px;
          }
        }

        .text-yellow {
          color: #8c98ae;
          font-size: 14px;
          line-height: 20px;
          padding-right: 30px;
          float: left;
        }

        .brief {
          font-size: 14px;
          color: #c4c9d2;
          height: 20px;
          line-height: 20px;
        }
      }
    }
  }

  .more {
    height: 40px;
    line-height: 40px;
    color: $theme;
    font-size: 14px;
    margin-left: 28px;
    cursor: pointer;
    &.nothing {
      cursor: text;
    }

    .icon-gengduo {
      display: inline;
      margin-left: 6px;
    }

    .icon-loading {
      &:before {
        display: inline-block;
        animation: spin 1s linear infinite;
      }
    }
  }
}
.nothing {
  color: #45526b;
  font-size: 14px;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@media screen and (max-width: 1000px) {
  .date {
    display: none;
  }
}
</style>
<style>
.strong {
  color: #464dd5;
}
</style>
