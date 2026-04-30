import { protectedAxios } from '../../axios';
import { AxiosError } from 'axios';

export interface TrashItem {
  id: string;
  title?: string;
  name?: string;
  note?: string;
  content?: string;
  deletedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

const trashApiCall = {
  // Get trash items for notes
  getTrashNotes: async (): Promise<TrashItem[]> => {
    try {
      const response = await protectedAxios.get('/trash/notes');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Failed to fetch trash notes:', error);
      return [];
    }
  },

  // Get trash items for journal
  getTrashJournal: async (): Promise<TrashItem[]> => {
    try {
      const response = await protectedAxios.get('/trash/journal');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Failed to fetch trash journal:', error);
      return [];
    }
  },

  // Get trash items for people
  getTrashPeople: async (): Promise<TrashItem[]> => {
    try {
      const response = await protectedAxios.get('/trash/people');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Failed to fetch trash people:', error);
      return [];
    }
  },

  // Get trash items for places
  getTrashPlaces: async (): Promise<TrashItem[]> => {
    try {
      const response = await protectedAxios.get('/trash/places');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Failed to fetch trash places:', error);
      return [];
    }
  },

  // Restore a note
  restoreNote: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await protectedAxios.patch(`/trash/notes/${id}/restore`);
      return {
        success: true,
        message: 'Note restored successfully',
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }> | unknown;
      if (axiosError instanceof AxiosError) {
        return {
          success: false,
          error: axiosError.response?.data?.message || 'Failed to restore note',
        };
      }
      return { success: false, error: 'Failed to restore note' };
    }
  },

  // Restore a journal entry
  restoreJournal: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await protectedAxios.patch(`/trash/journal/${id}/restore`);
      return {
        success: true,
        message: 'Journal entry restored successfully',
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }> | unknown;
      if (axiosError instanceof AxiosError) {
        return {
          success: false,
          error: axiosError.response?.data?.message || 'Failed to restore journal entry',
        };
      }
      return { success: false, error: 'Failed to restore journal entry' };
    }
  },

  // Restore a person
  restorePerson: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await protectedAxios.patch(`/trash/people/${id}/restore`);
      return {
        success: true,
        message: 'Person restored successfully',
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }> | unknown;
      if (axiosError instanceof AxiosError) {
        return {
          success: false,
          error: axiosError.response?.data?.message || 'Failed to restore person',
        };
      }
      return { success: false, error: 'Failed to restore person' };
    }
  },

  // Restore a place
  restorePlace: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await protectedAxios.patch(`/trash/places/${id}/restore`);
      return {
        success: true,
        message: 'Place restored successfully',
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }> | unknown;
      if (axiosError instanceof AxiosError) {
        return {
          success: false,
          error: axiosError.response?.data?.message || 'Failed to restore place',
        };
      }
      return { success: false, error: 'Failed to restore place' };
    }
  },
};

export default trashApiCall;
