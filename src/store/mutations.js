import Vue from 'vue'
import {makeAppendChildToParentMutation} from '@/store/assetHelpers'

export default {
  setPost (state, {post, postId}) {
    Vue.set(state.posts, postId, post)
  },

  setItem (state, {item, id, resource}) {
    item['.key'] = id
    Vue.set(state[resource], id, item)
  },

  appendPostToUser: makeAppendChildToParentMutation({parent: 'users', child: 'posts'}),
  appendThreadToUser: makeAppendChildToParentMutation({parent: 'users', child: 'threads'}),
  appendThreadToForum: makeAppendChildToParentMutation({parent: 'forums', child: 'threads'}),

  setUser (state, {userId, user}) {
    Vue.set(state.users, userId, user)
  },

  setAuthId (state, id) {
    state.authId = id
  },

  setUnsubscribeAuthObserver (state, unsubscribe) {
    state.unsubscribeAuthObserver = unsubscribe
  }
}
