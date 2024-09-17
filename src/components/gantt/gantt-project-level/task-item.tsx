import React, { useEffect, useRef, useState } from "react";
import { BarTask } from "../../../types/bar-task";
import { GanttContentMoveAction } from "../../../types/gantt-task-actions";
import { Bar } from "../../task-item/bar/bar";
import { BarSmall } from "../../task-item/bar/bar-small";
import { Milestone } from "../../task-item/milestone/milestone";
import { Project } from "../../task-item/project/project";
import style from "../../task-item/task-list.module.css";
import { Instance } from "@popperjs/core";
import { Tooltip } from "@mui/material";
import { formatDate } from "../../../helpers/date-helper";
import { getStatusText } from "../../../helpers/other-helper";

export type TaskItemProps = {
  task: BarTask;
  arrowIndent: number;
  taskHeight: number;
  isProgressChangeable: boolean;
  isDateChangeable: boolean;
  isDelete: boolean;
  isSelected: boolean;
  rtl: boolean;
  onEventStart: (
    action: GanttContentMoveAction,
    selectedTask: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent
  ) => any;
};

export const TaskItem: React.FC<TaskItemProps> = props => {
  const {
    task,
    arrowIndent,
    isDelete,
    taskHeight,
    isSelected,
    rtl,
    onEventStart,
  } = {
    ...props,
  };
  const textRef = useRef<SVGTextElement>(null);
  const [taskItem, setTaskItem] = useState<JSX.Element>(<div />);
  const [isTextInside, setIsTextInside] = useState(true);
  const positionRef = React.useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const popperRef = React.useRef<Instance>(null);
  const areaRef = React.useRef<SVGGElement>(null);

  const handleMouseMove = (event: React.MouseEvent) => {
    positionRef.current = { x: event.clientX, y: event.clientY };

    if (popperRef.current != null) {
      popperRef.current.update();
    }
  };

  useEffect(() => {
    switch (task.typeInternal) {
      case "milestone":
        setTaskItem(<Milestone {...props} />);
        break;
      case "project":
        setTaskItem(<Project {...props} />);
        break;
      case "smalltask":
        setTaskItem(<BarSmall {...props} />);
        break;
      default:
        setTaskItem(<Bar {...props} />);
        break;
    }
  }, [task, isSelected]);

  useEffect(() => {
    if (textRef.current) {
      setIsTextInside(textRef.current.getBBox().width < task.x2 - task.x1);
    }
  }, [textRef, task]);

  const getX = () => {
    const width = task.x2 - task.x1;
    const hasChild = task.barChildren.length > 0;
    if (isTextInside) {
      return task.x1 + width * 0.5;
    }
    if (rtl && textRef.current) {
      return (
        task.x1 -
        textRef.current.getBBox().width -
        arrowIndent * +hasChild -
        arrowIndent * 0.2
      );
    } else {
      return task.x1 + width + arrowIndent * +hasChild + arrowIndent * 0.2;
    }
  };

  return (
    <Tooltip
      title={
        <div style={{ fontSize: "1rem" }}>
          <div>
            <strong style={{ color: "lightblue" }}>
              {`${task.name} : ${formatDate(task.start)} - ${formatDate(
                task.end
              )}`}
            </strong>
          </div>
          {task.end.getTime() - task.start.getTime() !== 0 && (
            <div>{`Duration: ${~~(
              (task.end.getTime() - task.start.getTime()) /
              (1000 * 60 * 60 * 24)
            )} day(s)`}</div>
          )}
          {!!task.progress && <div>Progress: {task.progress} %</div>}
          {!!task.status && <div>Status: {getStatusText(task.status)}</div>}
          {!!task.note && <div>Note: {task.note}</div>}
        </div>
      }
      placement="top"
      arrow
      PopperProps={{
        popperRef,
        anchorEl: {
          getBoundingClientRect: () => {
            return new DOMRect(
              positionRef.current.x,
              areaRef.current?.getBoundingClientRect().y,
              0,
              0
            );
          },
        },
      }}
    >
      <g
        ref={areaRef}
        onKeyDown={e => {
          switch (e.key) {
            case "Delete": {
              if (isDelete) onEventStart("delete", task, e);
              break;
            }
          }
          e.stopPropagation();
        }}
        onMouseEnter={e => {
          onEventStart("mouseenter", task, e);
        }}
        onMouseMove={e => {
          handleMouseMove(e);
        }}
        onMouseLeave={e => {
          onEventStart("mouseleave", task, e);
        }}
        onDoubleClick={e => {
          onEventStart("dblclick", task, e);
        }}
        onClick={e => {
          onEventStart("click", task, e);
        }}
        onFocus={() => {
          onEventStart("select", task);
        }}
      >
        {taskItem}
        {isTextInside && (
          <text
            x={getX()}
            y={task.y + taskHeight * 0.5}
            className={style.barLabel}
            ref={textRef}
          >
            {task.name}
          </text>
        )}
      </g>
    </Tooltip>
  );
};
