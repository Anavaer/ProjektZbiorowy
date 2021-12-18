import axios from 'axios';
import { SignUpData } from "types";

export async function getSampleData(): Promise<any> {
    return await axios.post('/api/account/login');
}

export function signUp(signUpData: SignUpData): Promise<any> {
    return axios.post('/api/account/sign-up', signUpData);
}

export function signIn(signInData: { username: String, password: String }): Promise<any> {
    return axios.post('/api/account/sign-in', signInData);
}
