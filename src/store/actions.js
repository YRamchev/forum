import firebase from 'firebase'
import { removeEmptyProps } from '@/utils'
export default {
  createPost ({commit, state}, post) {
    const postId = firebase.database().ref('posts').push().key
    post.userId = state.authId
    post.publishedAt = Math.floor(Date.now() / 1000)

    const updates = {}
    updates[`posts/${postId}`] = post
    updates[`threads/${post.threadId}/posts/${postId}`] = postId
    updates[`threads/${post.threadId}/contributors/${post.userId}`] = post.userId
    updates[`users/${post.userId}/posts/${postId}`] = postId

    firebase.database().ref().update(updates)
      .then(() => {
        commit('setItem', {resource: 'posts', item: post, id: postId})
        commit('appendPostToThread', {parentId: post.threadId, childId: postId})
        commit('appendPostToUser', {parentId: post.userId, childId: postId})
        commit('appendContributorToThread', {parentId: post.threadId, childId: post.userId})
        return Promise.resolve(state.posts[postId])
      })
  },

  updatePost ({state, commit}, {id, text}) {
    return new Promise((resolve) => {
      const post = state.posts[id]
      const edited = {
        at: Math.floor(Date.now() / 1000),
        by: state.authId
      }
      const updates = {text, edited}

      firebase.database().ref('posts').child(id).update(updates)
      .then(() => {
        commit('setPost', {postId: id, post: {...post, text, edited}})
        resolve(post)
      })
    })
  },

  fetchAuthUser ({dispatch, commit}) {
    const userId = firebase.auth().currentUser.uid
    return new Promise((resolve, reject) => {
      firebase.database().ref('users').child(userId).once('value', snapshot => {
        if (snapshot.exists()) {
          return dispatch('fetchUser', {id: userId})
            .then((user) => {
              commit('setAuthId', userId)
              resolve(user)
            })
        } else {
          resolve(null)
        }
      })
    })
  },

  updateUser ({commit}, user) {
    const updates = {
      avatar: user.avatar,
      username: user.username,
      name: user.name,
      bio: user.bio,
      website: user.website,
      email: user.email,
      location: user.location
    }

    return new Promise((resolve, reject) => {
      firebase.database().ref('users').child(user['.key']).update(removeEmptyProps(updates))
        .then(() => {
          commit('setUser', {userId: user['.key'], user})
          resolve(user)
        })
    })
  },
  fetchUser: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'users', id}),
  fetchThread: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'threads', id}),
  fetchCategory: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'categories', id}),
  fetchPost: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'posts', id}),

  fetchForum: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'forums', id}),
  fetchThreads: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'threads', ids}),
  fetchCategories: (dispatch, {ids}) => dispatch('fetchItems', {resource: 'categories', ids}),
  fetchPosts: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'posts', ids}),
  fetchForums: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'forums', ids}),

  fetchItem ({state, commit}, {id, resource}) {
    return new Promise((resolve, reject) => {
      firebase.database().ref(resource).child(id).once('value', snapshot => {
        commit('setItem', {resource, id: snapshot.key, item: snapshot.val()})
        resolve(state[resource][id])
      })
    })
  },

  fetchItems ({dispatch}, {ids, resource}) {
    ids = Array.isArray(ids) ? ids : Object.keys(ids)
    return Promise.all(ids.map(id => dispatch('fetchItem', {id, resource, ids})))
  },

  fetchAllCategories ({state, commit}) {
    return new Promise((resolve, reject) => {
      firebase.database().ref('categories').once('value', snapshot => {
        const categoriesObject = snapshot.val()
        Object.keys(categoriesObject).forEach(categoryId => {
          const category = categoriesObject[categoryId]
          commit('setItem', {resource: 'categories', id: categoryId, item: category})
        })
        resolve(Object.values(state.categories))
      })
    })
  },

  createUser ({state, commit}, {id, name, username, email, password, avatar = null}) {
    return new Promise((resolve, reject) => {
      const registeredAt = Math.floor(Date.now() / 1000)
      const usernameLower = username.toLowerCase()
      email = email.toLowerCase()
      const user = {name, username, email, usernameLower, registeredAt, password, avatar}
      firebase.database().ref('users').child(id).set(user)
        .then(() => {
          commit('setItem', {resource: 'users', item: user, id: id})
          resolve(state.users[id])
        })
    })
  },

  registerUserWithEmailAndPssword ({dispatch}, {email, name, username, password, avatar = null}) {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(({user}) => {
        return dispatch('createUser', {id: user.uid, email, name, username, password, avatar})
      })
      .then(() => {
        dispatch('fetchAuthUser')
      })
  },

  // eslint-disable-next-line no-empty-pattern
  signInWithEmailAndPassword ({}, {email, password}) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  },

  // eslint-disable-next-line no-empty-pattern
  signInWithGoogle ({dispatch}) {
    const provider = new firebase.auth.GoogleAuthProvider()
    return firebase.auth().signInWithPopup(provider)
      .then((data) => {
        const user = data.user
        firebase.database().ref('users').child(user.uid).once('value', snapshot => {
          if (!snapshot.exists()) {
            return dispatch('createUser', {id: user.uid, name: user.displayName, email: user.email, username: user.email, avatar: user.photoURL})
              .then(() => dispatch('fetchAuthUser'))
          }
        })
      })
  },

  initAuthentication ({dispatch, commit, state}) {
    return new Promise((resolve, reject) => {
      if (state.unsubscribeAuthObserver) {
        state.unsubscribeAuthObserver()
      }

      const unsubscribe = firebase.auth().onAuthStateChanged(user => {
        if (user) {
          dispatch('fetchAuthUser')
            .then((dbUser) => resolve(dbUser))
        } else {
          resolve(null)
        }
      })
      commit('setUnsubscribeAuthObserver', unsubscribe)
    })
  },

  signOut ({commit}) {
    return firebase.auth().signOut()
      .then(() => {
        commit('setAuthId', null)
      })
  }
}
