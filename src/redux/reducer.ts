import addressReducer from '@redux/address/index'
import authReducer from '@redux/auth/index'
import blockchainEventsReducer from '@redux/blockchain-events/index'
import bookmarkReducer from '@redux/bookmark/index'
import commentsReducer from '@redux/comments/index'
import drawerReducer from '@redux/drawer/index'
import followersReducer from '@redux/followers/index'
import minibarReducer from '@redux/minibar/index'
import notificationsReducer from '@redux/notifications/index'
import transactionsReducer from '@redux/transactions/index'
import { combineReducers } from 'redux'

const appReducer = combineReducers({
  minibar: minibarReducer,
  drawer: drawerReducer,
  auth: authReducer,
  bookmark: bookmarkReducer,
  comments: commentsReducer,
  notifications: notificationsReducer,
  followers: followersReducer,
  address: addressReducer,
  blockchainEvents: blockchainEventsReducer,
  transactions: transactionsReducer,
})

const rootReducer = (state: any, action: any) => {
  return appReducer(state, action)
}

export default rootReducer
