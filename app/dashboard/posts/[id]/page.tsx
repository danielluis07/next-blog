import { EditPostForm } from "./_components/edit-post-form";

const EdidPostPage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="h-full">
      <EditPostForm id={params.id} />
    </div>
  );
};

export default EdidPostPage;
