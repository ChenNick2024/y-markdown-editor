/*
 * @Author: Nick930826 xianyou1993@qq.com
 * @Date: 2025-01-06 09:17:11
 * @LastEditors: Nick930826 xianyou1993@qq.com
 * @LastEditTime: 2025-01-06 13:14:57
 * @FilePath: /y-markdown-editor/src/renderer/src/store/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { create } from 'zustand'
import { ArticleProps } from '@renderer/utils/types'
import { getArticles } from '@renderer/utils/tool'
import dayjs from 'dayjs'

export const useStore = create((set) => ({
  activeArticle: {},
  setActiveArticle: (article: ArticleProps): void => {
    set({ activeArticle: article })
  },
  articles: getArticles(),
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
      localStorage.setItem('articles', JSON.stringify(_articles))
      return {
        articles: _articles
      }
    })
  },
  deleteArticle: (id: string): void => {
    set((state) => {
      const _articles = state.articles.filter((item) => item.id !== id)
      localStorage.setItem('articles', JSON.stringify(_articles))
      return {
        articles: _articles
      }
    })
  },
}))
