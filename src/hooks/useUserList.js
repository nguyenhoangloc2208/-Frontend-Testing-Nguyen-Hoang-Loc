import useSWR from "swr";
import getData from "../services/axios";

export default function useUserList() {
  const { data, isLoading, error } = useSWR(`/api/users/`, getData);

  return {
    data,
    isLoading,
    error,
  };
}
