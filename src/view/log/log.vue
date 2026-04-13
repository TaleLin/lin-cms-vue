<template>
  <div class="log">
    <StickyTop>
      <div class="log-header">
        <div class="header-left">
          <p class="title">日志信息</p>
        </div>
        <div class="header-right" v-permission="'搜索日志'">
          <div class="filter-toolbar">
            <div class="keyword-field">
              <el-input
                v-model="searchKeywordInput"
                class="keyword-search"
                clearable
                placeholder="搜索关键词"
                @clear="clearKeywordSearch"
                @keyup.enter="submitKeywordSearch"
              >
                <template #suffix>
                  <el-icon class="el-input__icon" @click="submitKeywordSearch">
                    <Search />
                  </el-icon>
                </template>
              </el-input>
            </div>
            <div class="user-field" v-permission="'查询日志记录的用户'">
              <el-dropdown class="user-filter" @command="handleCommand">
                <el-button class="filter-button">
                  {{ searchUser ? searchUser : '全部人员' }}
                  <el-icon class="el-icon--right">
                    <ArrowDown />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="['全部人员']">全部人员</el-dropdown-item>
                    <el-dropdown-item v-for="user in users.items" :key="user" :command="[user]">
                      <el-icon><UserFilled /></el-icon>
                      {{ user }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="date-field">
              <el-date-picker
                v-model="selectedDateRange"
                class="date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
                popper-class="date-box"
                :default-time="datePickerDefaultTime"
                :shortcuts="datePickerShortcuts"
              />
            </div>
          </div>
        </div>
      </div>
      <el-divider v-if="!keyword" class="header-divider"></el-divider>
    </StickyTop>
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
            <p class="things">
              <template
                v-for="(segment, index) in log.messageSegments || [{ text: log.message, highlighted: false }]"
                :key="`${log.id}-${index}`"
              >
                <span :class="{ strong: segment.highlighted }">{{ segment.text }}</span>
              </template>
            </p>
            <p class="brief">
              <span class="text-yellow">{{ log.username }}</span> {{ filters.dateTimeFormatter(log.time) }}
            </p>
          </aside>
        </section>
      </article>

      <div v-if="totalCount > count || totalCount === 0">
        <div v-if="logs?.length">
          <el-divider></el-divider>
          <div class="more" :class="{ nothing: finished }">
            <el-icon v-if="more" class="more-loading is-loading">
              <Loading />
            </el-icon>
            <div v-show="!more && !finished" @click="nextPage">
              <span>查看更多</span> <el-icon class="more-icon"><MoreFilled /></el-icon>
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

<script setup>
import { ArrowDown, Loading, MoreFilled, Search, UserFilled } from '@element-plus/icons-vue'

import StickyTop from '@/component/base/sticky-top/sticky-top'
import { filters } from '@/lin/filter'
import { useUserStore } from '@/store/modules/user'

import { useLog } from './use-log'

defineOptions({
  name: 'LogView',
})

const userStore = useUserStore()
const {
  backInit,
  count,
  clearKeywordSearch,
  datePickerDefaultTime,
  datePickerShortcuts,
  finished,
  handleCommand,
  keyword,
  loading,
  logs,
  more,
  nextPage,
  searchKeywordInput,
  searchUser,
  selectedDateRange,
  submitKeywordSearch,
  totalCount,
  users,
} = useLog({
  userStore,
})
</script>

<style lang="scss" scoped>
.log ::v-deep(.el-button) {
  padding-top: 10px;
  padding-bottom: 10px;
}

.log ::v-deep(.keyword-search .el-input__suffix) {
  cursor: pointer;
}

.log ::v-deep(.keyword-search .el-input__wrapper),
.log ::v-deep(.filter-button),
.log ::v-deep(.date .el-input__wrapper) {
  min-height: 42px;
  border-radius: 14px;
}

.log ::v-deep(.date .el-range-separator) {
  color: #8c98ae;
}

.log {
  .log-header {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 16px 24px;
    padding: 0 20px;
    align-items: center;
    min-height: 59px;

    .header-left {
      .title {
        margin: 0;
        color: $parent-title-color;
        font-size: 16px;
        font-weight: 500;
        line-height: 1.5;
      }
    }

    .header-right {
      min-width: 0;
      justify-self: end;
    }
  }

  .filter-toolbar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 12px;
    min-width: 0;
  }

  .keyword-search,
  .user-filter,
  .date {
    width: 100%;
  }

  .keyword-field {
    width: min(320px, 100%);
  }

  .user-field {
    width: 160px;
    flex: 0 0 160px;
  }

  .date-field {
    width: min(320px, 100%);
  }

  .filter-button {
    width: 100%;
    justify-content: space-between;
  }

  .header-divider {
    margin: 0;
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
          display: inline-flex;
          align-items: center;
          color: #8c98ae;
          font-size: 14px;
          line-height: 20px;
        }

        .brief {
          display: flex;
          align-items: center;
          gap: 30px;
          flex-wrap: wrap;
          font-size: 14px;
          color: #c4c9d2;
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

    .more-icon {
      display: inline-flex;
      margin-left: 6px;
      font-size: 14px;
    }

    .more-loading {
      display: inline-flex;
      font-size: 16px;
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

@media screen and (width <= 1000px) {
  .log {
    .log-header {
      grid-template-columns: 1fr;
      padding: 12px 20px 0;
      align-items: start;
    }

    .filter-toolbar {
      justify-content: stretch;
    }
  }
}

@media screen and (width <= 680px) {
  .log {
    .log-header {
      padding: 12px 16px 0;
    }

    .filter-toolbar {
      flex-direction: column;
      align-items: stretch;
    }

    .search {
      height: auto;
      padding: 12px 16px;
      align-items: flex-start;
      gap: 12px;
      flex-direction: column;

      .search-tip {
        margin-left: 0;
        height: auto;
        line-height: 1.6;
      }

      .search-back {
        margin: 0;
      }
    }

    .content {
      padding: 28px 20px;
    }
  }
}
</style>
<style>
.strong {
  color: #464dd5;
}
</style>
