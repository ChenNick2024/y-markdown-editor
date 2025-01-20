/*
 * @Author: Nick930826 xianyou1993@qq.com
 * @Date: 2025-01-06 10:58:28
 * @LastEditors: 陈尼克 xianyou1993@qq.com
 * @LastEditTime: 2025-01-20 11:13:33
 * @FilePath: /y-markdown-editor/src/renderer/src/utils/types.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export interface ArticleProps {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  filePath: string
  isEdit?: boolean
}

export interface StoreProps {
  updateAllArticles: (articles: ArticleProps[]) => void
  articles: ArticleProps[]
  activeArticle: ArticleProps
  setActiveArticle: (article: ArticleProps) => void
  tabs: ArticleProps[]
  addTab: (tab: ArticleProps) => void
  updateTab: (tab: ArticleProps) => void
  deleteTab: (id: string) => void
  addArticle: (article: ArticleProps) => void
  updateArticle: (article: ArticleProps) => void
  deleteArticle: (id: string) => void
  saveCurrentArticle: (article: ArticleProps) => void
}
