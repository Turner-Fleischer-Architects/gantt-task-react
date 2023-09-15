import React, { useMemo } from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../../types/public-types";
import { getProgressFromStatus } from "../../helpers/other-helper";
import { BarTask } from "../../types/bar-task";

const localeDateStringCache = {};

function formatDate(date: Date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

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

  const toLocaleDateStringFactory2 =
  (locale: string) =>
  (date: Date) => {
    locale = locale
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
  onDateChange?: (task: Task, children: Task[]) => void | boolean | Promise<void> | Promise<boolean>;
  updateTasks: (updatedTasks: Task[]) => void;
}> = ({
  rowHeight,
  rowWidth,
  tasks,
  fontFamily,
  fontSize,
  locale,
  onExpanderClick,
  onDateChange,
  updateTasks
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
  }

  const getInputStyle = (taskType: string) => {
    const styleObject = {
      background: 'transparent', 
      border: 0, 
      outline: 0, 
      fontWeight: '', 
      fontSize: ''
    };

    switch (taskType) {
      case 'modelMilestone':
        styleObject.fontWeight = 'bold'; 
        styleObject.fontSize = '1.1em';
        break;
    }

    return styleObject;
  }

  const getInputIndentStyle = (taskType: string) => {
    switch (taskType) {
      case 'projectMilestone':
        return {marginLeft: '10px'};
      case 'subMilestone':
        return {marginLeft: '15px'};
      default:
        return undefined;
    }
  }

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
                <div><input type='text' defaultValue={t.name} onChange={(e) => {t.name = e.target.value; updateTasks([...tasks])}} disabled={t.taskType === 'modelMilestone'} style={getInputStyle(t.taskType)} /></div>
              </div>
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              <input type="date" value={formatDate(t.start)} onChange={(e) => {t.start = new Date(`${e.target.value}T00:00:00`); handleDateChange(t as BarTask); updateTasks([...tasks])}} disabled={t.taskType !== 'subMilestone'} style={getInputStyle(t.taskType)} />
              {/* &nbsp;{toLocaleDateString(t.start, dateTimeOptions)}  */}
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              <input type="date" value={toLocaleDateString2(t.end)} onChange={(e) => {t.end = new Date(`${e.target.value}T00:00:00`); handleDateChange(t as BarTask); updateTasks([...tasks])}} disabled={t.taskType !== 'subMilestone'} style={getInputStyle(t.taskType)} />
              {/* &nbsp;{toLocaleDateString(t.end, dateTimeOptions)} */}
            </div>
            <div
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
            </div>
          </div>
        );
      })}
    </div>
  );
};
