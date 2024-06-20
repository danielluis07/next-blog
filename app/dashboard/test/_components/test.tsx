"use client";

import { useGetPost } from "@/queries/posts/use-get-post";

export const Test = () => {
  const postQuery = useGetPost("97ae35f3-4c83-416e-9cc5-1bcc08148f84");
  if (postQuery.isLoading) return <p>loading...</p>;
  return <div dangerouslySetInnerHTML={{ __html: postQuery.data?.content }} />;
};
