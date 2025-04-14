export interface UserEntity {
  id?: number; 
  email: string;                        
  name: string; 
  password: string;
  reset_token?: string;
  reset_token_expiration?: Number;
}