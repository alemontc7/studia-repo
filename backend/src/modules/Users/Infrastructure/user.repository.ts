import { supabase } from '../../../config/supabaseClient';
import { LoginDTO } from '../Domain/login.dto';
import { UserEntity } from '../Domain/user.entity';
import bcrypt from 'bcrypt';

export class userRepository {
    async createUser(userData: UserEntity): Promise<UserEntity> {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          name: userData.name,
          password: userData.password
        })
        .select() // Para retornar la fila insertada
    
      if (error){
        if(error.code === '23505'){
          const customError = new Error('This mail can not be registered');
          (customError as any).status = 400;
          (customError as any).code = 'DUPLICATED_EMAIL';
          throw customError;
        }
        else {
          const customError = new Error('There was en error while setting up your account :(');
          //we should print the error in a log file ${error.message} not to the user
          (customError as any).status = 500;
          (customError as any).code = 'INTERNAL_SERVER_ERROR';
          throw customError;
        }
      }
    
      // data debería tener la lista de objetos creados.  
      // Retornamos el primero (si hubiera solo uno).
      const createdUser = data && data.length > 0 ? data[0] : null;
      return createdUser;
    }

    async findByEmailAndPassword(userData: LoginDTO): Promise<UserEntity | null> {
      const {data} = await supabase.from('users').select().eq('email', userData.email);
      if (!data || data.length === 0) {
        throw new Error(`We can not find you :( please check your credentials`);
      }
      const user = data[0];
      const isValidPassword = await bcrypt.compare(userData.password, user.password);
      console.log("Passowrd is valid?", isValidPassword);
      if (!isValidPassword) {
        throw new Error(`We can not find you :( please check your credentials`);
      }
      return data && data.length > 0 ? data[0] : null;
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
      const { data } = await supabase.from('users').select().eq('email', email);
      if (!data || data.length === 0) {
        throw new Error(`User can not be found`);
      }
      return data && data.length > 0 ? data[0] : null;
    }

    async setResetToken(email: string, token: string, expiresAt: number): Promise<void> {
      const { error } = await supabase
        .from('users')
        .update({ reset_token: token, reset_token_expiration: expiresAt })
        .eq('email', email);
      if (error) {
        throw new Error(`Error setting reset token: ${error.message}`);
      }
    }

    async updatePasswordByEmail(email: string, newPassword: string): Promise<void> {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const { error } = await supabase
        .from('users')
        .update({
          password: hashedPassword,
          reset_token: null,
          reset_token_expiration: null
        })
        .eq('email', email);
      if (error) {
        throw new Error(error.message);
      }
    }
}