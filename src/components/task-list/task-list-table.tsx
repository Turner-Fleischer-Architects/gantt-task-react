import React, { useMemo } from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../../types/public-types";
// import { getProgressFromStatus } from "../../helpers/other-helper";
import { BarTask } from "../../types/bar-task";
import { formatDate } from "../../helpers/date-helper";

const localeDateStringCache = {};

// const toLocaleDateStringFactory =
//   (locale: string) =>
//   (date: Date, dateTimeOptions: Intl.DateTimeFormatOptions) => {
//     const key = date.toString();
//     let lds = localeDateStringCache[key];
//     if (!lds) {
//       lds = date.toLocaleDateString(locale, dateTimeOptions);
//       localeDateStringCache[key] = lds;
//     }
//     return lds;
//   };

const toLocaleDateStringFactory2 = (locale: string) => (date: Date) => {
  locale = locale;
  const key = date.toString();
  let lds = localeDateStringCache[key];
  if (!lds) {
    lds = formatDate(date);
    localeDateStringCache[key] = lds;
  }
  return lds;
};

// const dateTimeOptions: Intl.DateTimeFormatOptions = {
//   weekday: "short",
//   year: "numeric",
//   month: "long",
//   day: "numeric",
// };

export const TaskListTableDefault: React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
  onDateChange?: (
    task: Task,
    children: Task[]
  ) => void | boolean | Promise<void> | Promise<boolean>;
  updateTasks: (updatedTasks: Task[]) => void;
  onAddTaskClick: (task: Task) => void;
  onDeleteTaskClick: (task: Task) => void;
  onMoveTaskClick: (task: Task) => void;
  addTaskIcon: React.ReactNode;
  deleteTaskIcon: React.ReactNode;
  moveTaskIcon: React.ReactNode;
}> = ({
  rowHeight,
  rowWidth,
  tasks,
  fontFamily,
  fontSize,
  locale,
  onExpanderClick,
  onDateChange,
  updateTasks,
  onAddTaskClick,
  onDeleteTaskClick,
  onMoveTaskClick,
  addTaskIcon,
  deleteTaskIcon,
  moveTaskIcon,
}) => {
  // const toLocaleDateString = useMemo(
  //   () => toLocaleDateStringFactory(locale),
  //   [locale]
  // );

  const toLocaleDateString2 = useMemo(
    () => toLocaleDateStringFactory2(locale),
    [locale]
  );

  const handleDateChange = async (newChangedTask: BarTask) => {
    if (onDateChange) {
      try {
        const result = await onDateChange(
          newChangedTask,
          newChangedTask.barChildren
        );
        if (result !== undefined) {
          alert("Can't automatically update phase and model milestone's dates");
        }
      } catch (error) {
        alert("Can't automatically update phase and model milestone's dates");
      }
    }
  };

  const getInputStyle = (taskType: string) => {
    const styleObject = {
      background: "transparent",
      border: 0,
      outline: 0,
      fontWeight: "",
      fontSize: "",
    };

    switch (taskType) {
      case "modelMilestone":
        styleObject.fontWeight = "bold";
        styleObject.fontSize = "1.1em";
        break;
    }

    return styleObject;
  };

  const getInputIndentStyle = (taskType: string) => {
    switch (taskType) {
      case "projectMilestone":
        return { marginLeft: "10px" };
      case "subMilestone":
        return { marginLeft: "15px" };
      default:
        return undefined;
    }
  };

  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {tasks.map(t => {
        let expanderSymbol = "";
        if (t.hideChildren === false) {
          expanderSymbol = "▼";
        } else if (t.hideChildren === true) {
          expanderSymbol = "▶";
        }

        return (
          <div
            className={styles.taskListTableRow}
            style={{ height: rowHeight }}
            key={`${t.id}row`}
          >
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
              title={t.name}
            >
              <div className={styles.taskListNameWrapper}>
                <div
                  className={
                    expanderSymbol
                      ? styles.taskListExpander
                      : styles.taskListEmptyExpander
                  }
                  onClick={() => onExpanderClick(t)}
                >
                  <span style={getInputIndentStyle(t.taskType)}></span>
                  <span>{expanderSymbol}</span>
                </div>
                <div>
                  <input
                    type="text"
                    value={t.name}
                    onChange={e => {
                      t.name = e.target.value;
                      updateTasks([...tasks]);
                    }}
                    disabled={t.taskType === "modelMilestone"}
                    style={getInputStyle(t.taskType)}
                  />
                </div>
              </div>
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              <input
                type="date"
                value={formatDate(t.start)}
                onChange={e => {
                  t.start = new Date(`${e.target.value}T00:00:00`);
                  handleDateChange(t as BarTask);
                  updateTasks([...tasks]);
                }}
                disabled={t.taskType !== "subMilestone"}
                style={getInputStyle(t.taskType)}
              />
              {/* &nbsp;{toLocaleDateString(t.start, dateTimeOptions)}  */}
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              <input
                type="date"
                value={toLocaleDateString2(t.end)}
                onChange={e => {
                  t.end = new Date(`${e.target.value}T00:00:00`);
                  handleDateChange(t as BarTask);
                  updateTasks([...tasks]);
                }}
                disabled={t.taskType !== "subMilestone" || t.isMilestone}
                style={getInputStyle(t.taskType)}
              />
              {/* &nbsp;{toLocaleDateString(t.end, dateTimeOptions)} */}
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: "60px",
                maxWidth: "60px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                {t.taskType === "subMilestone" && (
                  <input
                    type="checkbox"
                    checked={t.isMilestone}
                    onChange={e => {
                      t.isMilestone = e.target.checked;
                      t.type = e.target.checked ? "milestone" : "task";
                      t.end = e.target.checked ? new Date(t.start) : t.end;
                      handleDateChange(t as BarTask);
                      updateTasks([...tasks]);
                    }}
                  />
                )}
              </div>
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: "5rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                {
                  <span
                    onClick={() => {
                      onAddTaskClick(t);
                    }}
                    style={{
                      fontSize: "1.5em",
                      marginLeft: "2px",
                      marginRight: "2px",
                    }}
                    title={`Add ${
                      t.taskType === "modelMilestone"
                        ? "Phase"
                        : t.taskType === "projectMilestone"
                        ? "Phase / Milestone"
                        : "Milestone"
                    }`}
                  >
                    {addTaskIcon ?? "+"}
                  </span>
                }
                {t.taskType !== "modelMilestone" && (
                  <span
                    onClick={() => {
                      onDeleteTaskClick(t);
                    }}
                    style={{
                      fontSize: "1.5em",
                      marginLeft: "2px",
                      marginRight: "2px",
                    }}
                    title={`Delete ${
                      t.taskType === "projectMilestone" ? "Phase" : "Milestone"
                    }`}
                  >
                    {deleteTaskIcon ?? "-"}
                  </span>
                )}
                {t.taskType !== "modelMilestone" && (
                  <span
                    onClick={() => {
                      onMoveTaskClick(t);
                    }}
                    style={{
                      fontSize: "1.5em",
                      marginLeft: "2px",
                      marginRight: "2px",
                    }}
                    title={`Move ${
                      t.taskType === "projectMilestone" ? "Phase" : "Milestone"
                    }`}
                  >
                    {moveTaskIcon ?? "↳"}
                  </span>
                )}
              </div>
            </div>
            {/* <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              {t.taskType !== 'subMilestone' ? null: 
                <textarea defaultValue={t.note} onChange={(e) => {t.note = e.target.value; updateTasks([...tasks])}} />
              }
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              {t.taskType !== 'subMilestone' ? null: 
              <select defaultValue={t.status} onChange={(e) => {t.status = Number(e.target.value) || 0; t.progress = getProgressFromStatus(t.status); updateTasks([...tasks])}} disabled={t.taskType !== 'subMilestone'}>
                <option value={0}></option>
                <option value={1}>Not Started</option>
                <option value={2}>In Progress</option>
                <option value={3}>Complete</option>
              </select>
              }
            </div> */}
          </div>
        );
      })}
    </div>
  );
};
