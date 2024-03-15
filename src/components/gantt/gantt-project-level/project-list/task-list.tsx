import React, { useEffect, useRef } from "react";
// import { BarTask } from "../../../../types/bar-task";
import { Project } from "../../../../types/public-types";

export type TaskListProps = {
  headerHeight: number;
  rowWidth: string;
  rowHeight: number;
  fontFamily: string;
  fontSize: string;
  ganttHeight: number;
  scrollY: number;
  projects: Project[];
  taskListRef: React.RefObject<HTMLDivElement>;
  horizontalContainerClass?: string;
  TaskListHeader: React.FC<{
    headerHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
  }>;
  TaskListTable: React.FC<{
    projects: Project[];
    rowHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
  }>;
};

export const TaskList: React.FC<TaskListProps> = ({
  headerHeight,
  rowWidth,
  rowHeight,
  fontFamily,
  fontSize,
  ganttHeight,
  scrollY,
  projects,
  taskListRef,
  horizontalContainerClass,
  TaskListHeader,
  TaskListTable
}) => {
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  const headerProps = {
    headerHeight,
    fontFamily,
    fontSize,
    rowWidth,
  };
  // const selectedTaskId = selectedTask ? selectedTask.id : "";
  const tableProps = {
    projects,
    rowHeight,
    rowWidth,
    fontFamily,
    fontSize
  };

  return (
    <div ref={taskListRef}>
      <TaskListHeader {...headerProps} />
      <div
        ref={horizontalContainerRef}
        className={horizontalContainerClass}
        style={ganttHeight ? { height: ganttHeight } : {}}
      >
        <TaskListTable {...tableProps} />
      </div>
    </div>
  );
};
