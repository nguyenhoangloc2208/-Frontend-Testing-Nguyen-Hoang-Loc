import useUserList from "@/hooks/useUserList";

const HomePage = () => {
  const { data, isLoading, error } = useUserList();
  return (
    <section className="w-full">
      {data &&
        data.map((user) => {
          return (
            <div key={user._id}>
              <div>{user.username}</div>
            </div>
          );
        })}
    </section>
  );
};

export default HomePage;
