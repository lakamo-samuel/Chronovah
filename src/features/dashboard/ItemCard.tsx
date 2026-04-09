import { useNavigate } from "react-router-dom";

function ItemCard({ title, item, date,id }: { title: string; item: string, date: string,id: string|number }) {
  const navigate = useNavigate();
  return (
   <div className="bg-card border border-default p-4 rounded-xl shadow-sm w-full " onClick={() => {
    navigate(`/item/${item}/${id}`)
   }}>
      <p className="font-medium text-primary">{title}</p>
      <p className="text-xs text-muted mt-1">
        {new Date(date).toLocaleDateString()}
      </p>
    </div>
  );
}

export default ItemCard;
