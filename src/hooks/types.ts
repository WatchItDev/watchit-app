export interface Invitation {
  id: string;
  status: 'pending' | 'accepted' | 'rejected';
  sender_email: string;
  destination: string;
  sender_id: string;
  receiver_id: string | null;
  payload: any;
  created_at: string;
}

export enum NotificationCategories {
  FOLLOW = 'FOLLOW',
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  JOIN = 'JOIN',
  MENTION = 'MENTION',
  TRANSFER = 'TRANSFER',
}

export interface NotificationColumnsProps {
  id: string;
  created_at: string | Date;
  category: NotificationCategories;
  payload: any;
  read: boolean;
  receiver_id: string;
  sender_id: string;
}

export interface NotificationItemProps {
  id: any;
  notification: NotificationColumnsProps;
  onMarkAsRead: (id: string) => void;
}
