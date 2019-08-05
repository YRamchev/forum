import {countObjectProperties} from '@/utils'
import firebase from 'firebase'
import {makeAppendChildToParentMutation} from '@/store/assetHelpers'
import Vue from 'vue'

export default {
  state: {
    items: {}
  },
  getters: {
    threadRepliesCount: state => id => (countObjectProperties(state.items[id].posts) - 1)
  },
  actions: {
    createThread ({state, commit, dispatch}, {title, text, forumId}) {
      return new Promise((resolve) => {
        const threadId = firebase.database().ref('threads').push().key
        const postId = firebase.database().ref('posts').push().key
        const userId = state.authId
        const publishedAt = Math.floor(Date.now() / 1000)

        const thread = {title, forumId, publishedAt, userId, firstPostId: postId, posts: {}}
        thread.posts[postId] = postId
        const post = {text, publishedAt, threadId, userId}

        const updates = {}
        updates[`threads/${threadId}`] = thread
        updates[`forums/${forumId}/threads/${threadId}`] = threadId
        updates[`users/${userId}/threads/${threadId}`] = threadId

        updates[`posts/${postId}`] = post
        updates[`users/${post.userId}/posts/${postId}`] = postId

        firebase.database().ref().update(updates)
          .then(() => {
            // update thread
            commit('setItem', {resource: 'threads', item: thread, id: threadId})
            commit('appendThreadToForum', {parentId: forumId, childId: threadId})
            commit('appendThreadToUser', {parentId: userId, childId: threadId})

            // update post
            commit('setItem', {resource: 'posts', item: post, id: postId})
            commit('appendPostToThread', {parentId: post.threadId, childId: postId})
            commit('appendPostToUser', {parentId: post.userId, childId: postId})

            resolve(state.threads[threadId])
          })
      })
    },
    updateThread ({state, commit, dispatch}, {title, text, id}) {
      return new Promise((resolve) => {
        const thread = state.items[id]
        const post = state.posts[thread.firstPostId]
        const newThread = {...thread, title}

        const edited = {
          at: Math.floor(Date.now() / 1000),
          by: state.authId
        }
        const updates = {}
        updates[`posts/${thread.firstPostId}/text}`] = text
        updates[`posts/${thread.firstPostId}/edited}`] = edited
        updates[`threads/${id}/title}`] = title

        firebase.database().ref().child(id).update(updates)
        .then(() => {
          commit('setThread', {thread: newThread, threadId: id})
          commit('setPost', {postId: thread.firstPostId, post: {...post, text, edited}})
          resolve(post)
        })
      })
    },
    fetchThread: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'threads', id}),
    fetchThreads: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'threads', ids}),
  },
  mutations: {
    setThread (state, {thread, threadId}) {
      Vue.set(state.items, threadId, thread)
    },
    appendPostToThread: makeAppendChildToParentMutation({parent: 'threads', child: 'posts'}),
    appendContributorToThread: makeAppendChildToParentMutation({parent: 'threads', child: 'contributors'})
  }
}