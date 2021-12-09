import axios from 'axios';

export class ApiService {
    async getSampleData(): Promise<any> {
        return await axios.post('/api/account/login');
    }
}