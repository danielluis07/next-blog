import { LatestPosts } from "./_components/latest-posts";
import { PostsCount } from "./_components/posts-count";

const DashboardPage = async () => {
  return (
    <div>
      <div>
        <PostsCount />
      </div>
      <div className="space-y-5">
        <h1 className="text-xl font-bold p-3 text-center 2xl:text-start">
          Últimos posts
        </h1>
        <LatestPosts />
      </div>
    </div>
  );
};

export default DashboardPage;
