export interface Invitation {
  id: string;
  status: "pending" | "accepted" | "rejected";
  sender_email: string;
  destination: string;
  sender_id: string;
  receiver_id: string | null;
  payload: any;
  created_at: string;
}
