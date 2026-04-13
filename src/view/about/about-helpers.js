import aboutAvatar from '@/assets/image/about/avatar.png'
import aboutHeaderBg from '@/assets/image/about/header-bg.png'
import aboutIcon from '@/assets/image/about/icon.png'
import aboutOpenSource from '@/assets/image/about/open-source.jpg'
import aboutQrCode from '@/assets/image/about/qrcode.jpg'
import aboutWelcomeTitle from '@/assets/image/about/welcome.png'
import { openExternalLink } from '@/lin/util/browser'

export const ABOUT_SITE_LINK = 'https://www.talelin.com'

export const ABOUT_ASSETS = Object.freeze({
  headerBackground: aboutHeaderBg,
  personalAvatar: aboutAvatar,
  quantityIcon: aboutIcon,
  qrCode: aboutQrCode,
  welcomeTitle: aboutWelcomeTitle,
})

const ABOUT_TEAM_DEVELOPERS = Object.freeze(['Pedro', '一飞', '凉面', '圈圈', '家乐', 'Jocky', '流乔', '西麦'])

export const ABOUT_QUANTITY_STATS = Object.freeze([
  { key: 'visits', label: '总访问量', value: '11,590', icon: ABOUT_ASSETS.quantityIcon },
  { key: 'users', label: '总用户数', value: '51,862', icon: ABOUT_ASSETS.quantityIcon },
  { key: 'month-visits', label: '新增访问量 (月)', value: '1,862', icon: ABOUT_ASSETS.quantityIcon },
  { key: 'new-users', label: '新增用户数', value: '1,323', icon: ABOUT_ASSETS.quantityIcon },
])

export const ABOUT_PERSONAL_STATS = Object.freeze([
  { key: 'views', label: '总访问量', value: '5411', colorClass: 'color1' },
  { key: 'fans', label: '粉丝', value: '913', colorClass: 'color2' },
  { key: 'works', label: '作品', value: '72', colorClass: 'color3' },
])

export const ABOUT_PERSONAL_TABS = Object.freeze([
  { key: 'latest', label: '最新作品', name: 'latest', content: 'How to Contribute to Open Source?' },
  { key: 'popular', label: '最热作品', name: 'popular', content: '为什么程序员们愿意在GitHub上开源...' },
])

export const ABOUT_ARTICLES = Object.freeze([
  {
    key: 'open-source-guide',
    title: 'How to Contribute to Open Source?',
    content:
      'Whether you just made your first open source contribution, or you’re looking for new ways to contribute, we hope you’re inspired to take action. Even if your contribution wasn’t accepted, don’t forget to say thanks when a maintainer put effort into helping you. Open source is made by people like you: one issue, pull request, comment, or high-five at a time.',
    link: 'https://opensource.guide/how-to-contribute/',
    publishedAt: '一天前',
    thumb: aboutOpenSource,
    metrics: [
      { key: 'favorite', icon: 'Star', value: '37' },
      { key: 'comment', icon: 'ChatDotRound', value: '2384' },
      { key: 'share', icon: 'Share', value: '56' },
    ],
  },
  {
    key: 'github-sharing',
    title: '为什么程序员们愿意在GitHub上开源自己的成果给别人免费使用和学习？',
    content:
      '“Git的精髓在于让所有人的贡献无缝合并。而GitHub的天才之处，在于理解了Git的精髓。”来一句我们程序员们接地气的话：分享是一种快乐~',
    link: 'https://www.zhihu.com/question/269033309',
    publishedAt: '2019年5月26日',
    thumb: aboutOpenSource,
    metrics: [
      { key: 'favorite', icon: 'Star', value: '37' },
      { key: 'comment', icon: 'ChatDotRound', value: '2384' },
      { key: 'share', icon: 'Share', value: '56' },
    ],
  },
])

export function shouldCondenseTeam(clientWidth) {
  return clientWidth > 1200 && clientWidth < 1330
}

export function getAboutTeamSections(condensed = false) {
  return [
    { key: 'planning', role: '策划', members: ['七月'] },
    { key: 'development', role: '研发', members: condensed ? ['林间有风 CMS 组'] : ABOUT_TEAM_DEVELOPERS },
    { key: 'design', role: '设计', members: ['瓜瓜'] },
  ]
}

export function openArticleLink(link, open) {
  openExternalLink(link, open)
}
