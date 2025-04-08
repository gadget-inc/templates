import { api } from "@/api";
import { AutoTable } from "@/components/auto";
import { Check, Pencil } from "lucide-react";
import { useNavigate } from "react-router";

export default function () {
  const navigate = useNavigate();

  return (
    <div>
      <AutoTable
        model={api.post}
        select={{
          id: true,
          title: true,
          author: true,
          isPublished: true,
        }}
        columns={[
          {
            field: "title",
            header: "Title",
            render: ({ record }) => <>{record.title}</>,
          },
          {
            field: "author",
            header: "Author",
            render: ({ record }) => <>{record.author}</>,
          },
          {
            field: "isPublished",
            header: "Published",
            render: ({ record }) => (
              <>{record.isPublished && <Check size={18} />}</>
            ),
          },
          {
            header: "",
            render: ({ record }) => (
              <Pencil
                size={18}
                className="text-black hover:text-gray-600 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/post/${record.id}`);
                }}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
