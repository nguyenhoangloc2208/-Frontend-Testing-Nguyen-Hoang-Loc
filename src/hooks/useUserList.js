import useSWR from "swr";
import getData from "../services/axios";

const addIndexToData = (data) => {
  return data.map((item, index) => ({ ...item, index: index + 1 }));
};

export default function useUserList() {
  const { data, isLoading, error, mutate } = useSWR(`/api/users/`, getData, {
    refreshInterval: 0,
    revalidateOnFocus: false,
  });

  const indexedData = data ? addIndexToData(data) : [];

  return {
    data: indexedData,
    isLoading,
    error,
    mutate,
  };
}
