// front/src/hooks/useGroups.js
import useFetch from './useFetch'

export default function useGroups() {
  const { data: groups, isPending: areGroupsLoading, error: groupsError, refetch } = useFetch('groups');
  return { groups, areGroupsLoading, groupsError, refetch };
} 