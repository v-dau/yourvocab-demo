export interface User {
  id: string; //postgresql uuid
  username: string;
  email: string;
  role: 'user' | 'admin';
  is_banned: boolean;
  is_email_verified: boolean;
  avatar_url?: string; //use ? if nullable
  avatar_key?: string;
  created_at: string;
  modified_at: string;
  //not including password_hash which will be deleted at the backend
}
