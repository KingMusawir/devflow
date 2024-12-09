import { auth } from '@/auth';

const Home = async () => {
  const session = await auth();
  console.log(session);

  return (
    <>
      <h1 className="text-5xl font-semibold text-violet-600">
        Welcome to the world of Next js
      </h1>
    </>
  );
};

export default Home;
