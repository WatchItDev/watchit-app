export const NOTIFICATION_CATEGORIES: { [key: string]: string } = {
  'FOLLOW': 'FOLLOW',
  'LIKE': 'LIKE',
  'COMMENT': 'COMMENT',
  'JOIN': 'JOIN',
  'MENTION': 'MENTION',
};

export type NotificationColumnsProps = {
  id: string;
  created_at: string | Date;
  category: string;
  payload: any;
  read: boolean;
  receiver_id: string;
  sender_id: string;
}
