import _ from 'lodash'
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class BoardService {
  // 원래는 repository를 참조하여 비지니스 로직을 실행하기 위해 DB와 통신을 하지만
  // 지금은 편의성을 위해 인-메모리 변수로 해결한다.
  private articles = []

  private articlesPasswords = new Map() // {articleId - password}, {articleId - password}, {articleId - password}의 집합
  
  getArticles() {
    return this.articles
  }

  getArticleById(id: number) {
    return this.articles.find((article) => {
      return article.id === id
    })
  }

  createArticle(title: string, content: string, password: number) {
    // id를 먼저 매겨야 한다.
    // 1번부터 시작 -> 현재 배열의 크기 + 1
    const articleId = this.articles.length + 1
    this.articles.push({ id: articleId, title, content })
    this.articlesPasswords.set(articleId, password)
    return articleId
  }

  updateArticle(id: number, title: string, content: string, password: number) {
    if (this.articlesPasswords.get(id) !== password) {
      throw new UnauthorizedException('Password is not correct. id:' + id)
    }

    const article = this.getArticleById(id)
    if (_.isNil(article)) {
      throw new NotFoundException('Article not found. id:' + id)
    }
    /* _.isNil -> 값이 null 또는 undefined인지 판별한다.
       ex) 
       _.isNil(null); //true
       _.isNil(undefined); //true
    */ 
    
    article.title = title
    article.content = content
  }

  deleteArticle(id: number, password: number) {
    if (this.articlesPasswords.get(id) !== password) {
      throw new UnauthorizedException('Password is not correct. id:' + id)
    }

    this.articles = this.articles.filter((article) => {
      return article.id !== id
    })
  }
}
