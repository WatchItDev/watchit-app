export enum NotificationCategories {
  FOLLOW = "FOLLOW",
  LIKE = "LIKE",
  COMMENT = "COMMENT",
  JOIN = "JOIN",
  MENTION = "MENTION",
  TRANSFER = "TRANSFER",
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
