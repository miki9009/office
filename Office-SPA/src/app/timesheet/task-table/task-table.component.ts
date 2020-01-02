import { Component, OnInit } from "@angular/core";
import { TaskService } from "src/app/_services/task.service";
import { Task } from "src/app/_models/task";
import { WorkerServiceService } from "src/app/_services/worker-service.service";

@Component({
  selector: "app-task-table",
  templateUrl: "./task-table.component.html",
  styleUrls: ["./task-table.component.css"]
})
export class TaskTableComponent implements OnInit {
  constructor(private taskService: TaskService, private workerService: WorkerServiceService) {
    taskTableComponent = this;
  }

  tasks: Task[];

  ngOnInit() {
    empties = document.querySelectorAll(".empty");
    this.taskService.getTasks(this.workerService.currentWorkerID()).subscribe(data => {
      this.tasks = data;
       console.log(this.tasks);
    });

    for (const empty of empties) {
      empty.addEventListener("dragover", dragOver);
      empty.addEventListener("dragenter", dragEnter);
      empty.addEventListener("dragleave", dragLeave);
      empty.addEventListener("drop", dragDrop);
    }
    // console.log('init');
  }

  selectFill(element: any) {
    //console.log('id = ' + element);
    fill = document.getElementById(element);
    //console.log('set fill to: ' + fill.id);
    // console.log(this);
    // console.log(this.tasks);
    if (fill != null) {
      fill.removeEventListener("dragstart", dragStart);
      fill.removeEventListener("dragend", dragEnd);
      fill.removeEventListener("dragend", this.updateTask);
      fill.addEventListener("dragstart", dragStart);
      fill.addEventListener("dragend", dragEnd);
      fill.addEventListener("dragend", this.updateTask);
    }
  }

  updateTask(): void {
    // console.log('Update Task: ' + fill.id.match(/\d/g));
    if (fill == null || endColumnID == null) {
      return;
    }
    const taskID = +fill.id.match(/\d+/);
    let task: Task = null;
    // console.log(taskID);
    // console.log(taskTableComponent.tasks);

    taskTableComponent.tasks.forEach(element => {
      // console.log(element.id);
      if (element.id === taskID) {
        task = element;
        task.state = +endColumnID.match(/\d+/);
      }
    });
    if (task === null) {
      // console.log('task is null');
      return;
    }
    // console.log(task);
    taskTableComponent.taskService.updateTask(task).subscribe(data => {
      // console.log(data);
      task = data;
    });
  }
}

// Dragging
let fill;
let empties;
let endColumnID;
let taskTableComponent: TaskTableComponent;

function dragStart() {
  // console.log(fill);
  this.className += " hold";
  setTimeout(() => (this.className = "invisible"), 0);
}

function dragEnd() {
  this.className = "col-12 task";
  // console.log('drag end');
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  this.className += " hovered";
}

function dragLeave() {
  this.className = "col-12 task-column empty";
}

function dragDrop(e) {
  this.className = "col-12 task-column empty";
  this.append(fill.parentElement);
  // let id = fill.id;
  // console.log(id.match(/\d/g));
  endColumnID = e.target.id;
}
