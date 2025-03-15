
export interface RegisterUserPayload {
    email: string;
    password: string;
    full_name: string;
    phone_number: string;
  }
  
  export interface User {
    id: number;
    email: string;
    full_name: string;
    phone_number: string;
    is_active: boolean;
    role_id: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
  }
  
  export interface TokenResponse {
    access_token: string;
    token_type: string;
  }
  
  export interface MessageResponse {
    message: string;
  }