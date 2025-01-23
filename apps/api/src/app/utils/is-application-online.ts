import axios from 'axios';

export async function isApplicationOnline(url: string): Promise<boolean> {
  try {
    const response = await axios.get(url);
    return response.status === 200;
  } catch {
    return false;
  }
}