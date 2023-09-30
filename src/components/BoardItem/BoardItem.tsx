import { SortableContext } from "@dnd-kit/sortable";
import ExercisesCard from "../ExercisesCard/ExercisesCard";

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

interface Type {
  id: string;
  date: string;
  day: number;
  exercises: Exercise[];
}

interface BoardItemProps {
  weekday: Type;
}

const BoardItem: React.FC<BoardItemProps> = ({ weekday }) => {
  return (
    <div>
      <p className="date">{weekday.date}</p>
      <div className="board">
        <p className="day">{weekday.day}</p>
        <SortableContext
          items={weekday.exercises.map((exercise) => exercise.id)}
        >
          {weekday.exercises.map((exercise, exerciseIndex) => (
            <ExercisesCard exercise={exercise} key={exerciseIndex} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default BoardItem;
