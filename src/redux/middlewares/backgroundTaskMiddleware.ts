import {
  addPendingComment,
  removePendingComment,
  refetchCommentsByPublication,
} from '@redux/comments'
import { Middleware } from '@reduxjs/toolkit'
import BackgroundTaskWorker from '@src/workers/backgroundTaskWorker?worker'

type TaskPayload = {
  type: string; // Task type identifier, e.g., 'POST_COMMENT', 'UPDATE_METADATA'
  data: any; // Task-specific data
};

type Task = {
  id: string;
  payload: TaskPayload;
};

const backgroundTaskWorker = new BackgroundTaskWorker()
const taskQueue: Task[] = []
let isProcessing = false

/**
 * Process a single task based on its type.
 */
const processTask = (store: any, task: Task) => {
  return new Promise<void>((resolve, reject) => {
    const { type, data } = task.payload

    switch (type) {
      case 'POST_COMMENT':
        processBackgroundComment(store, data).then(resolve).catch(reject)
        break
      case 'UPDATE_PROFILE_METADATA':
        processUpdateProfileMetadata(store, data).then(resolve).catch(reject)
        break
      default:
        console.error(`Unknown task type: ${type}`)
        reject(new Error(`Unknown task type: ${type}`))
    }
  })
}

/**
 * Process a background comment task.
 */
const processBackgroundComment = (store: any, data: any) => {
  return new Promise<void>((resolve, reject) => {
    const {
      commentOn,
      uri,
      pendingComment,
      owner,
      generatePayload,
      sendNotification,
      createComment,
      root,
    } = data

    const sessionData = store.getState().auth.session

    // Send the IPFS verification task to the worker
    backgroundTaskWorker.postMessage({
      type: 'VERIFY_IPFS',
      payload: { uri, pendingCommentId: pendingComment.id },
    })

    backgroundTaskWorker.onmessage = async (
      e: MessageEvent<{ success: boolean; pendingCommentId: string; error?: string }>
    ) => {
      const { success, pendingCommentId, error } = e.data

      if (success) {
        try {
          // Create the comment after IPFS verification
          await createComment({ commentOn, metadata: uri })

          // Remove the pending comment from the store
          store.dispatch(
            removePendingComment({ publicationId: commentOn, commentId: pendingCommentId })
          )

          // Generate the notification payload
          const notificationPayload = generatePayload(
            'COMMENT',
            {
              id: owner?.id,
              displayName: owner?.displayName,
              avatar: owner?.avatar,
            },
            {
              comment: pendingComment?.metadata?.content,
              root_id: root,
              comment_id: commentOn,
              rawDescription: `${sessionData?.profile?.metadata?.displayName} left a comment`,
            }
          )

          // Send the notification if the comment is not from the owner
          if (owner?.id !== sessionData?.profile?.id) {
            sendNotification(owner.id, sessionData?.profile?.id, notificationPayload)
          }

          // Refetch the comments
          store.dispatch(refetchCommentsByPublication(commentOn))

          console.log('Comment created successfully')
          resolve()
        } catch (createError) {
          console.error('Error creating comment:', createError)
          reject(createError)
        }
      } else {
        console.error('Error verifying IPFS data:', error)
        reject(new Error(error))
      }
    }
  })
}

/**
 * Process a profile metadata update task.
 */
const processUpdateProfileMetadata = (store: any, data: any) => {
  return new Promise<void>(async (resolve, reject) => {
    const { metadataURI, setProfileMetadataExecute, onSuccess, onError } = data

    try {
      const result = await setProfileMetadataExecute({ metadataURI })

      if (result.isFailure()) {
        throw new Error(result.error.message)
      }

      await result.value.waitForCompletion()

      console.log('Profile metadata updated successfully')
      onSuccess()
      resolve()
    } catch (error) {
      console.error('Error updating profile metadata:', error)
      onError(error)
      reject(error)
    }
  })
}

/**
 * Process the task queue sequentially.
 */
const processQueue = (store: any) => {
  if (isProcessing || taskQueue.length === 0) return

  isProcessing = true
  const task = taskQueue.shift()!

  processTask(store, task)
    .catch((error) => {
      console.error('Error processing task:', error)
    })
    .finally(() => {
      isProcessing = false
      processQueue(store) // Process the next task in the queue
    })
}

export const backgroundTaskMiddleware: Middleware = (store) => (next) => (action: any) => {
  if (action.type === 'ADD_TASK_TO_BACKGROUND') {
    // Add the task to the queue
    taskQueue.push({ id: action.payload.id, payload: action.payload })

    // Immediately add the pending comment to the store if it's a POST_COMMENT task
    if (action.payload.type === 'POST_COMMENT') {
      const { commentOn, uri, pendingComment } = action.payload.data
      store.dispatch(
        addPendingComment({ publicationId: commentOn, comment: { ...pendingComment, uri } })
      )
    }

    // Start processing the queue if not already processing
    processQueue(store)
  }

  return next(action)
}
