import { LatestUsers } from "./_components/cards/latest-users";
import { LatestPosts } from "./_components/cards/latest-posts";
import { TotalPosts } from "./_components/cards/numbers/total-posts";
import { TotalViews } from "./_components/cards/numbers/total-views";
import { TotalLikes } from "./_components/cards/numbers/total-likes";
import { TotalComments } from "./_components/cards/numbers/total-comments";
import { LatestComments } from "./_components/cards/latest-comments";
import { TotalUsers } from "./_components/cards/numbers/total-users";

const DashboardPage = async () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
        <TotalPosts />
        <TotalViews />
        <TotalLikes />
        <TotalUsers />
        <TotalComments />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl:overflow-auto gap-10 pb-4 custom-grid-rows mt-14">
        <LatestUsers />
        <LatestPosts />
        <LatestComments />
      </div>
    </div>
  );
};

export default DashboardPage;
