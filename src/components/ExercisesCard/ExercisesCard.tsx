import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext } from "@dnd-kit/sortable";
import ABC from "../ExercisesItem/ExercisesItem";

interface ExerciseItem {
  columnId: number;
  count: string;
  name: string;
  number: string;
}

interface Exercise {
  id: number;
  title: string;
  content: ExerciseItem[];
}

interface ExerciseItemProps {
  exercise: Exercise;
}

const ExercisesCard: React.FC<ExerciseItemProps> = ({ exercise }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: exercise.id,
    data: { ...exercise },
  });

  const style: React.CSSProperties = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? "1px solid #5a57cb" : undefined,
  };

  return (
    <div
      className="board__content"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="board__title">
        <p className="info__title">{exercise.title}</p>
        <span className="material-symbols-outlined">more_horiz</span>
      </div>
      <SortableContext items={exercise.content.map((item) => item.columnId)}>
        {exercise.content.map((item, itemIndex) => (
          <ABC item={item} key={itemIndex} />
        ))}
      </SortableContext>
      <div className="btn_add">
        <span className="add material-symbols-outlined">add_circle</span>
      </div>
    </div>
  );
};

export default ExercisesCard;
