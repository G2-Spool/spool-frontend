import { API_ENDPOINTS } from '../config/api';
import type { Textbook } from '../types';
import apiService from './api';

export class TextbookService {
  async getAllTextbooks(): Promise<Textbook[]> {
    return apiService.get<Textbook[]>(API_ENDPOINTS.textbooks.all);
  }

  async getTextbookById(id: string): Promise<Textbook> {
    const url = API_ENDPOINTS.textbooks.byId.replace(':id', id);
    return apiService.get<Textbook>(url);
  }
}

export const textbookService = new TextbookService();