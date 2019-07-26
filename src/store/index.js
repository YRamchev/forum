import sourceData from '@/data'
import Vue from 'vue'
import Vuex from 'vuex'
import {countObjectProperties} from '@/utils'
Vue.use(Vuex)

const makeAppendChildToParrentMutation = ({parent, child}) =>
  (state, {parentId, childId}) => {
    const resource = state[parent][parentId]
    if (!resource[child]) {
      Vue.set(resource, child, {})
    }

    Vue.set(resource[child], childId, childId)
  }

export default new Vuex.Store({
  state: {
    ...sourceData,
    authId: 'ALXhxjwgY9PinwNGHpfai6OWyDu2'
  },

  getters: {
    authUser (state) {
      return state.users[state.authId]
    },

    userPostsCount: state => id => countObjectProperties(state.users[id].posts),
    userThreadsCount: state => id => countObjectProperties(state.users[id].threads),
    threadRepliesCount: state => id => (countObjectProperties(this.thread.posts) - 1)
  },

  actions: {
    createPost ({commit, state}, post) {
      const postId = 'greatPost' + Math.random()
      post['.key'] = postId
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)

      commit('setPost', {post, postId})
      commit('appendPostToThread', {parentId: post.threadId, childId: postId})
      commit('appendPostToUser', {parentId: postId.userId, childId: postId})

      return Promise.resolve(state.posts[postId])
    },

    createThread ({state, commit, dispatch}, {title, text, forumId}) {
      return new Promise((resolve) => {
        const userId = state.authId
        const publishedAt = Math.floor(Date.now() / 1000)
        const threadId = 'greatPost' + Math.random()

        const thread = {threadId, title, forumId, publishedAt, userId}

        commit('setThread', {thread, threadId})
        commit('appendThreadToForum', {parentId: forumId, childId: threadId})
        commit('appendThreadToUser', {parentId: userId, childId: threadId})

        dispatch('createPost', {text, threadId})
          .then(post => {
            commit('setThread', {threadId, thread: {...thread, firstPostId: post['.key']}})
          })
        resolve(state.threads[threadId])
      })
    },

    updateThread ({state, commit, dispatch}, {title, text, id}) {
      return new Promise((resolve) => {
        const thread = state.threads[id]

        const newThread = {...thread, title}

        commit('setThread', {thread: newThread, threadId: id})
        dispatch('updatePost', {id: thread.firstPostId, text})
          .then(() => {
            resolve(newThread)
          })
      })
    },

    updatePost ({state, commit}, {id, text}) {
      return new Promise((resolve) => {
        const post = state.posts[id]
        commit('setPost', {
          postId: id,
          post: {
            ...post,
            text,
            edited: {
              at: Math.floor(Date.now() / 1000),
              by: state.authId
            }
          }
        })

        resolve(post)
      })
    },

    updateUser ({commit}, user) {
      commit('setUser', {userId: user['.key'], user})
    }
  },

  mutations: {
    setPost (state, {post, postId}) {
      Vue.set(state.posts, postId, post)
    },

    setThread (state, {thread, threadId}) {
      Vue.set(state.threads, threadId, thread)
    },

    appendPostToThread: makeAppendChildToParrentMutation({parent: 'threads', child: 'posts'}),
    appendPostToUser: makeAppendChildToParrentMutation({parent: 'users', child: 'posts'}),
    appendThreadToUser: makeAppendChildToParrentMutation({parent: 'users', child: 'threads'}),
    appendThreadToForum: makeAppendChildToParrentMutation({parent: 'forums', child: 'threads'}),

    setUser (state, {userId, user}) {
      Vue.set(state.users, userId, user)
    }
  }
})
