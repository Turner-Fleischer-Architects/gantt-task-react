import React, { useMemo } from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../../types/public-types";

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
    const key = date.toString();
    let lds = localeDateStringCache[key];
    if (!lds) {
      console.log(locale)
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
}> = ({
  rowHeight,
  rowWidth,
  tasks,
  fontFamily,
  fontSize,
  locale,
  onExpanderClick,
}) => {
  // const toLocaleDateString = useMemo(
  //   () => toLocaleDateStringFactory(locale),
  //   [locale]
  // );

  const toLocaleDateString2 = useMemo(
    () => toLocaleDateStringFactory2(locale),
    [locale]
  );

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
                  {expanderSymbol}
                </div>
                <div><input type='text' defaultValue={t.name} /></div>
              </div>
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              <input type="date" value={toLocaleDateString2(t.start)} />
              {/* &nbsp;{toLocaleDateString(t.start, dateTimeOptions)}  */}
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              <input type="date" value={toLocaleDateString2(t.end)} />
              {/* &nbsp;{toLocaleDateString(t.end, dateTimeOptions)} */}
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              <textarea defaultValue={t.note} onChange={e => console.log(e.target.value)} />
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              <select defaultValue={t.status}>
                <option value={0}></option>
                <option value={1}>Not Started</option>
                <option value={2}>In Progress</option>
                <option value={3}>Complete</option>
              </select>
            </div>
          </div>
        );
      })}
    </div>
  );
};
