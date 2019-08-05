import Vue from 'vue'

const makeAppendChildToParrentMutation = ({parent, child}) =>
  (state, {childId, parentId}) => {
    const resource = state[parent][parentId]
    if (!resource[child]) {
      Vue.set(resource, child, {})
    }

    Vue.set(resource[child], childId, childId)
  }

export default {
  setPost (state, {post, postId}) {
    Vue.set(state.posts, postId, post)
  },

  setThread (state, {thread, threadId}) {
    Vue.set(state.threads, threadId, thread)
  },

  setItem (state, {item, id, resource}) {
    item['.key'] = id
    Vue.set(state[resource], id, item)
  },

  appendPostToThread: makeAppendChildToParrentMutation({parent: 'threads', child: 'posts'}),
  appendPostToUser: makeAppendChildToParrentMutation({parent: 'users', child: 'posts'}),
  appendThreadToUser: makeAppendChildToParrentMutation({parent: 'users', child: 'threads'}),
  appendThreadToForum: makeAppendChildToParrentMutation({parent: 'forums', child: 'threads'}),
  appendContributorToThread: makeAppendChildToParrentMutation({parent: 'threads', child: 'contributors'}),

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
