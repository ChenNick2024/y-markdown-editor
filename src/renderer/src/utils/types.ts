/*
 * @Author: Nick930826 xianyou1993@qq.com
 * @Date: 2025-01-06 10:58:28
 * @LastEditors: Nick930826 xianyou1993@qq.com
 * @LastEditTime: 2025-01-06 11:25:41
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
