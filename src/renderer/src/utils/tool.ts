/*
 * @Author: Nick930826 xianyou1993@qq.com
 * @Date: 2025-01-06 09:25:04
 * @LastEditors: Nick930826 xianyou1993@qq.com
 * @LastEditTime: 2025-01-06 12:50:04
 * @FilePath: /y-markdown-editor/src/renderer/src/utils/tool.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { message } from 'antd'
import dayjs from 'dayjs'
import { ArticleProps } from './types'

export const getArticles = (): ArticleProps[] => {
  const articles = localStorage.getItem('articles')
  return articles ? JSON.parse(articles) : []
}

export const addArticle = (data: ArticleProps): void => {
  const articles = getArticles()
  if (articles.find((item) => item.id === data.id)) {
    message.error('文章已存在')
    return
  }
  articles.push(data)

  localStorage.setItem('articles', JSON.stringify(articles))
}

export const updateArticle = (data: ArticleProps): void => {
  const articles = getArticles()
  const index = articles.findIndex((item) => item.id === data.id)
  articles[index] = {
    ...data,
    updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
  }
  localStorage.setItem('articles', JSON.stringify(articles))
}

export const deleteArticle = (id: string): void => {
  const articles = getArticles()
  const index = articles.findIndex((item) => item.id === id)
  articles.splice(index, 1)
  localStorage.setItem('articles', JSON.stringify(articles))
}

export const getArticleById = (id: string): ArticleProps | undefined => {
  const articles = getArticles()
  return articles.find((item) => item.id === id)
}
