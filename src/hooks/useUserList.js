import useSWR from "swr";
import getData from "../services/axios";

export default function useUserList() {
  const { data, isLoading, error } = useSWR(`/api/users/`, getData, {
    refreshInterval: 0,
    revalidateOnFocus: false,
  });

  return {
    data,
    isLoading,
    error,
  };
}
