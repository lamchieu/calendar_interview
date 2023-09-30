import React, { useState } from "react";
import BoardItem from "../BoardItem/BoardItem";
import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import ExercisesItem from "../ExercisesItem/ExercisesItem";
import ExercisesCard from "../ExercisesCard/ExercisesCard";

interface ExerciseItem {
  count: string;
  name: string;
  number: string;
  columnId: number;
}

interface Exercise {
  id: number;
  title: string;
  content: ExerciseItem[];
}

interface Weekday {
  id: string;
  date: string;
  day: number;
  exercises: Exercise[];
}

const getFormattedWeekdays = (): Weekday[] => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);

  let idCounter = 1;

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);

    const dayOfWeek = date
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase();
    const dayOfMonth = date.getDate();

    const exercises: Exercise[] =
      i === 1
        ? [
            {
              id: 1,
              title: "CHEST DAY - WITH ARM",
              content: [
                {
                  columnId: 2,
                  count: "1x",
                  name: "Bench Press",
                  number: "50 lb x 5, 60 lb x 5, 70 lb x 5",
                },
                {
                  columnId: 3,
                  count: "1x",
                  name: "Bench Press",
                  number: "50 lb x 5, 60 lb x 5, 70 lb x 5",
                },
              ],
            },
          ]
        : i === 2
        ? [
            {
              id: 4,
              title: "LEG DAY",
              content: [
                {
                  columnId: 5,
                  count: "1x",
                  name: "Exercise C",
                  number: "50 lb x 5, 60 lb x 5, 70 lb x 5",
                },
                {
                  columnId: 6,
                  count: "1x",
                  name: "Exercise D",
                  number: "50 lb x 5, 60 lb x 5, 70 lb x 5",
                },
                {
                  columnId: 7,
                  count: "1x",
                  name: "Exercise E",
                  number: "50 lb x 5, 60 lb x 5, 70 lb x 5",
                },
              ],
            },
            {
              id: 8,
              title: "ARM DAY",
              content: [
                {
                  columnId: 9,
                  count: "2x",
                  name: "Exercise F",
                  number: "50 lb x 5, 60 lb x 5, 70 lb x 5",
                },
                {
                  columnId: 10,
                  count: "2x",
                  name: "Exercise F",
                  number: "50 lb x 5, 60 lb x 5, 70 lb x 5",
                },
              ],
            },
          ]
        : [];

    const weekday: Weekday = {
      id: `weekday-${idCounter}`,
      date: dayOfWeek,
      day: dayOfMonth,
      exercises,
    };

    idCounter++;
    return weekday;
  });
};

const BoardContent: React.FC = () => {
  const [formattedWeekdays] = useState<Weekday[]>(getFormattedWeekdays());

  const [activeDragItemId, setActiveDragItemId] = useState<string | null>(null);
  const [activeDragType, setActiveDragType] = useState<string | null>(null);
  const [activeDragData, setActiveDragData] = useState<ExerciseItem | null>(
    null
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!active || !over) return;
    if (activeDragType === ACTIVE_DRAG.CARD) {
      const {
        id: activeDraggingCardId,
        data: {},
      } = active;
      const { id: overCardId } = over;

      const activeColumn = findColumnByCardId(activeDraggingCardId);
      const overColumn = findColumnByCardId(overCardId);

      if (!activeColumn || !overColumn) return;
    }

    if (activeDragType === ACTIVE_DRAG.COLUMN) {
    }

    setActiveDragItemId(null);
    setActiveDragType(null);
    setActiveDragData(null);
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const onDragStart = (event: DragStartEvent) => {
    setActiveDragItemId(event.active.id.toString());
    setActiveDragType(
      event.active.data.current.columnId ? ACTIVE_DRAG.CARD : ACTIVE_DRAG.COLUMN
    );
    setActiveDragData(event.active.data.current);
  };

  const ACTIVE_DRAG = {
    COLUMN: "ACTIVE_COLUMN",
    CARD: "ACTIVE_CARD",
  };

  const findColumnByCardId = (cardId: number) => {
    return formattedWeekdays.find((column) =>
      column.exercises.map((card) => card.id).includes(cardId)
    );
  };

  const [orderedColumns, setOrderedColumns] =
    useState<Weekday[]>(formattedWeekdays);

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!active || !over) return;
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;
    const { id: overCardId } = over;

    const activeDraggingCardIdNumber = Number(activeDraggingCardId);
    const activeColumn = findColumnByCardId(activeDraggingCardIdNumber);
    const overCardIdNumber = Number(overCardId);
    const overColumn = findColumnByCardId(overCardIdNumber);
    if (!activeColumn || !overColumn) return;
    if (activeColumn.id !== overColumn.id) {
      setOrderedColumns((prevColumns) => {
        const overCardIndex = overColumn.exercises?.findIndex(
          (exercise) => exercise.id === overCardId
        );

        let newCardIndex;
        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;
        const modifier = isBelowOverItem ? 1 : 0;

        newCardIndex =
          overCardIndex >= 0
            ? overCardIndex + modifier
            : overColumn.exercises?.length + 1;
        const nextColumns = [...prevColumns];

        const nextActiveColumn = nextColumns.find(
          (column) => column.id === activeColumn.id
        );

        const nextOverColumn = nextColumns.find(
          (column) => column.id === overColumn.id
        );

        if (nextActiveColumn) {
          nextActiveColumn.exercises = nextActiveColumn.exercises.filter(
            (card) => card.id !== activeDraggingCardId
          );
        }
        if (nextOverColumn) {
          nextOverColumn.exercises = nextOverColumn.exercises.filter(
            (card) => card.id !== activeDraggingCardId
          );
          nextOverColumn.exercises.splice(
            newCardIndex,
            0,
            activeDraggingCardData
          );
        }

        return nextColumns;
      });
    }
  };

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={onDragOver}
    >
      <div className="grid-container">
        <DragOverlay dropAnimation={dropAnimation}>
          {activeDragType === ACTIVE_DRAG.COLUMN && activeDragData !== null && (
            <ExercisesCard exercise={activeDragData} />
          )}
          {activeDragType === ACTIVE_DRAG.CARD && activeDragData !== null && (
            <ExercisesItem item={activeDragData} />
          )}
        </DragOverlay>
        {orderedColumns.map((weekday) => (
          <BoardItem weekday={weekday} key={weekday.id} />
        ))}
      </div>
    </DndContext>
  );
};

export default BoardContent;
