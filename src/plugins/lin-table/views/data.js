const tableColumn = [
  // { prop: 'sorting', label: '排序', hidden: true },
  { prop: 'rank', label: '排名' },
  { prop: 'title', label: '电影名', width: 150 },
  { prop: 'originalTitle', label: '原名', width: 150 },
  { prop: 'rating', label: '评分' },
  { prop: 'genres', label: '类型', width: 150 },
  { prop: 'directors', label: '导演', width: 150 },
  { prop: 'casts', label: '主演', width: 150 },
  { prop: 'year', label: '年份' },
]

const tableData = [
  {
    date: '2016-05-03',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
    tag: '家',
  }, {
    date: '2016-05-02',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
    tag: '公司',
  }, {
    date: '2016-05-04',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
    tag: '家',
  }, {
    date: '2016-05-01',
    name: '王小虎',
    province: '上海',
    city: '普陀区',
    address: '上海市普陀区金沙江路 1518 弄',
    zip: 200333,
    tag: '公司',
  }]

export { tableColumn, tableData }
