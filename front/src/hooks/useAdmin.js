// front/src/hooks/useAdmin.js
import { useAdminContext } from '../contexts/AdminContext';

export default function useAdmin() {
  return useAdminContext();
} 