import useSWR from "swr";
import getData from "../services/axios";

const addIndexToData = (data) => {
  if (!Array.isArray(data)) {
    console.error("Expected an array but got:", data);
    return [];
  }
  return data.map((item, index) => ({ ...item, index: index + 1 }));
};

export default function useUserList() {
  const { data, isLoading, error, mutate } = useSWR(`/api/users/`, getData, {
    refreshInterval: 0,
    revalidateOnFocus: false,
  });

  const indexedData = Array.isArray(data) ? addIndexToData(data) : [];

  return {
    data: indexedData,
    isLoading,
    error,
    mutate,
  };
}
