import { Suspense } from "react";
import { PostForm } from "./_components/post-form";

const NewPostPage = async () => {
  return (
    <div className="h-full">
      <PostForm />
    </div>
  );
};

export default NewPostPage;
