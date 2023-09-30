import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ExerciseItem {
  columnId: number;
  count: string;
  name: string;
  number: string;
}

interface ExercisesItemProps {
  item: ExerciseItem;
}

const ExercisesItem: React.FC<ExercisesItemProps> = ({ item }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.columnId,
    data: { ...item },
  });

  const dndKitColumnStyles = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? "1px solid #5a57cb" : undefined,
  };

  return (
    <div
      className="content__item"
      ref={setNodeRef}
      style={dndKitColumnStyles}
      {...attributes}
      {...listeners}
    >
      <p className="count">{item.count}</p>
      <div className="title">
        <p className="name">{item.name}</p>
        <p className="number">{item.number}</p>
      </div>
    </div>
  );
};

export default ExercisesItem;
