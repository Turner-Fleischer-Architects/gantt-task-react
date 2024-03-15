import React from "react";
import styles from "./task-list-table.module.css";
import {addToDate} from "../../../../helpers/date-helper"
import { Project } from "../../../../types/public-types";

export const TaskListTableDefault: React.FC<{
  projects: Project[];
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
}> = ({
  projects,
  rowHeight,
  rowWidth,
  fontFamily,
  fontSize
}) => {
  const getProjectUrl = (project: Project) => {
    return `https://apps.tfai.com:5173/EditProject/?bxpId=${project.bxPId}`;
  }

  const getCurrentPhases = (project: Project) => {
    let result: string = '';

    for (const task of project.tasks) {
      if (task.taskType !== 'projectMilestone') {
        continue;
      } 
      ;
      const today = new Date();
      if (today >= task.start && today <= addToDate(task.end, 1, "day")) {
        result += (result === '' ? '' : ', ') + task.name;
      }
    }

    return result;
  }

  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {projects.map(p => {
        // let expanderSymbol = "";
        // if (t.hideChildren === false) {
        //   expanderSymbol = "▼";
        // } else if (t.hideChildren === true) {
        //   expanderSymbol = "▶";
        // }

        return (
          <div
            className={styles.taskListTableRow}
            style={{ height: rowHeight }}
            key={`${p.bxPId}row`}
          >
            <div
              className={styles.taskListCell}
              style={{
                minWidth: '100px',
                maxWidth: '100px',
              }}
              title={p.projectNumber}
            >
              <div className={styles.taskListNameWrapper}>
                <div
                  className={styles.taskListEmptyExpander}
                >
                  <span></span>
                </div>
                <a href={getProjectUrl(p)} target='_blank' rel='noreferrer'>{p.projectNumber}</a>
              </div>
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
              title={p.projectName}
            >
              {p.projectName}
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: '150px',
                maxWidth: '150px',
              }}
              title={p.projectManager}
            >
              {p.projectManager}
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
              title={getCurrentPhases(p)}
            >
              {getCurrentPhases(p)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
