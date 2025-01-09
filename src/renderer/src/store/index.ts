/*
 * @Author: Nick930826 xianyou1993@qq.com
 * @Date: 2025-01-06 09:17:11
 * @LastEditors: Nick930826 xianyou1993@qq.com
 * @LastEditTime: 2025-01-09 10:05:03
 * @FilePath: /y-markdown-editor/src/renderer/src/store/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { create } from 'zustand'
import { message } from 'antd'
import { ArticleProps, StoreProps } from '@renderer/utils/types'
import { getArticles } from '@renderer/utils/tool'
import dayjs from 'dayjs'

export const useStore = create<StoreProps>((set) => ({
  // 文章相关
  articles: getArticles(),
  activeArticle: getArticles()[0] || {},
  setActiveArticle: async (article: ArticleProps): Promise<void> => {
    const res = await window.electron.ipcRenderer.invoke('get-current-article', article)
    article.content = res.content
    const articles = getArticles()
    const _articles = articles.map((item) => (item.id === article.id ? article : item))
    localStorage.setItem('articles', JSON.stringify(_articles))
    set({
      activeArticle: article,
      articles: _articles
    })
  },
  addArticle: (article: ArticleProps): void => {
    set((state) => {
      const _articles = [...state.articles, article]
      localStorage.setItem('articles', JSON.stringify(_articles))
      return {
        articles: _articles
      }
    })
  },
  updateArticle: (article: ArticleProps): void => {
    set((state) => {
      const _articles = state.articles.map((item) =>
        item.id === article.id
          ? { ...article, updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss') }
          : item
      )
      state.updateTab({
        ...article,
        title: article.title
      })
      localStorage.setItem('articles', JSON.stringify(_articles))
      return {
        articles: _articles
      }
    })
  },
  // 保存当前编辑的文章内容
  saveCurrentArticle: (article: ArticleProps): void => {
    set((state) => {
      const _articles = state.articles.map((item) => (item.id === article.id ? article : item))
      localStorage.setItem('articles', JSON.stringify(_articles))
      /// 保存当前文章需要将文章内容同步到对应的路径文件里写入
      window.electron.ipcRenderer.invoke('save-article', article).then((res) => {
        if (res.code === 0) {
          message.success('保存成功')
        } else {
          message.error(res.message)
        }
      })
      return {
        activeArticle: article,
        articles: _articles
      }
    })
  },
  deleteArticle: (id: string): void => {
    set((state) => {
      const _articles = state.articles.filter((item) => item.id !== id)
      state.deleteTab(id)
      localStorage.setItem('articles', JSON.stringify(_articles))
      return {
        // 如果删除的是当前激活的文章，则将删除后的列表第一项作为激活项
        activeArticle:
          state.activeArticle.id === id && _articles.length ? _articles[0] : state.activeArticle,
        articles: _articles
      }
    })
  },
  // 顶部页签
  tabs: [],
  addTab: (tab: ArticleProps): void => {
    set((state) => {
      if (state.tabs.find((item) => item.id === tab.id)) return state
      const _tabs = [...state.tabs, tab]
      return {
        tabs: _tabs
      }
    })
  },
  updateTab: (tab: ArticleProps): void => {
    set((state) => {
      const _tabs = state.tabs.map((item) => (item.id === tab.id ? tab : item))
      return {
        tabs: _tabs
      }
    })
  },
  deleteTab: (id: string): void => {
    set((state) => {
      const _tabs = state.tabs.filter((item) => item.id !== id)
      return {
        tabs: _tabs
      }
    })
  }
}))
