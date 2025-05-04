export interface UserEntity {
  id?: string; 
  email: string;                        
  name: string; 
  password: string;
  reset_token?: string;
  reset_token_expiration?: Number;
}