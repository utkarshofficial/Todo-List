
let user = JSON.parse(localStorage.getItem("user"));

// ! user not logged in -> redirect to login
if(user == null){
  location.href = location.origin + "/modules/login/login.html";
}

let users = JSON.parse(localStorage.getItem("users"));

class Task {
  // constructor(title, description, isActive, date=null) {
  //   this.title = title;
  //   this.description = description;
  //   this.isActive = isActive;
  //   this.avatarLetter = user.fullname[0];
  //   this.date = date;
  // }
  // for taking direct task object
  constructor(task) {
    this.title = task.title;
    this.description = task.description;
    this.isActive = task.isActive;
    this.avatarLetter = user.fullname[0];
    // this.date = date;
  }
  toElement(){
    return `<li>
        <div class="taskCard">
          <div class="avatarOnCard">
            <div class="avatar" >
              ${this.avatarLetter}
            </div>
            <div class="taskCardDone">
              <button>
                <img class="tick" src="img/tick.svg" alt="" />
              </button>
            </div>
          </div>
          <div class="taskTitle">
            <p>${this.title}</p>
          </div>
          <hr />
          <div class="taskDescription">
            <p class="desTitle">Description</p>
            <p class="description">
              ${this.description}
            </p>
          </div>
        </div>
      </li>`;
  };
}

class Tasks {
  constructor(taskList) { 
    this.taskList = taskList;
    this.active = [];
    this.done = [];
    this.activeStr = "";
    this.doneStr = "";
    this.toTask();
    this.update();
  }
  fullname = user.fullname;
  // this function convert random object array to Task object
  toTask(){
    for(let i=0;i<this.taskList.length;i++){
      this.taskList[i] = new Task(this.taskList[i]);
    }
  };
  addTask(task){
    this.taskList.unshift(task);
    this.update();
  };
  saveTaskList(){
    user.taskList = this.taskList;
    localStorage.setItem("user",JSON.stringify(user));
  }
  removeTask(){};
  update(){
    this.active = [];
    this.activeStr = "";
    this.done = [];
    this.doneStr = "";
    for (let i = 0; i < this.taskList.length; i++) {
      if (this.taskList[i].isActive) {
        this.active.unshift(this.taskList[i]);
        // converting activelist to element
        this.activeStr += this.taskList[i].toElement();
      } else {
        this.done.unshift(this.taskList[i]);
        this.doneStr += this.taskList[i].toElement();
      }
    }
    this.saveTaskList();
    // * update the activeul and doneul
    // activeUl.innerHTML = tasks.activeStr;
    // doneUl.innerHTML = tasks.doneStr;
    this.updateListDOM();

    // * update task tab count in dom
    this.updateTasksCount();

    // ! Update DB
    updateUserInUsersDB();
  };
  updateListDOM(){
    activeUl.innerHTML = this.activeStr;
    doneUl.innerHTML = this.doneStr;
  }
  updateTasksCount(){
    activeCount.innerHTML = this.active.length;
    doneCount.innerHTML = this.done.length;
  }
}

// ! Update data in main users array
function updateUserInUsersDB(){
  for(let i=0;i<users.length;i++){
    if(users[i].username == user.username){
      users[i] = user;
      // save it to loaclStorage means update Database
      localStorage.setItem("users",JSON.stringify(users));
    }
  }
  
}

let tasks = new Tasks(user.taskList);
// * Initial read data from user
tasks.update();

// when clicked on addTask toggle the btn
addTaskBtn.addEventListener("click", () => {
  let img = addTaskBtn.children[0];
  if (img.src.lastIndexOf("add.svg") != -1) {
    img.src = "img/tick.svg";
    img.style.width = "45px";
    addTaskForm.style.display = "block";
  } else {
    if (addTitle.value.length == 0 || addDescription.value.length == 0) return;
    
    if (addTaskBtn.children[0].src.lastIndexOf("tick.svg") != -1) {
      if(addTitle.value.length == 0 || addDescription.value.length ==0)
        return;
  
      // now add this task as new active task
      const addTaskDetail = {
        title: addTitle.value,
        description: addDescription.value,
        isActive: true
      }
      tasks.addTask(new Task(addTaskDetail));
      // update all data
      tasks.update();
    }

    img.style.width = "25px";
    img.src = "img/add.svg";
    addTaskForm.style.display = "none";
    // empty the values of addtask form
    addTitle.value = "";
    addDescription.value = "";
  }
});

// * Tabs active and done
const tabClick = (activeClick) =>{
  let color = "white";
  let textColor = "black";
  if(activeClick){
    activeTabBtn.style.boxShadow = `0px 2px 0px ${color}`;
    activeTabBtn.style.borderTopLeftRadius= "20px";
    activeTabBtn.style.backgroundColor= color;
    activeTabBtn.style.color = textColor;
    doneTabBtn.style.color = color;
    doneTabBtn.style.backgroundColor= "";
    doneTabBtn.style.boxShadow = "none";
    // hiding doneul showing activeul
    activeUl.style.display = "block";
    doneUl.style.display = "none";
    
    // * Add innerHTML for activeUl
    
  }else{
    activeTabBtn.style.boxShadow = "none";
    activeTabBtn.style.backgroundColor= "none";
    activeTabBtn.style.backgroundColor= "";
    activeTabBtn.style.color = color;
    doneTabBtn.style.color = textColor;
    doneTabBtn.style.borderTopRightRadius= "20px";
    doneTabBtn.style.backgroundColor= color;
    doneTabBtn.style.boxShadow = `0px 2px 0px ${color}`;
    // hiding activeul showing doneul
    doneUl.style.display = "block";
    activeUl.style.display = "none";
    
    // * Add innerHTML for doneUl
    //here
  }
}

activeTabBtn.onclick = ()=>{
  tabClick(true);
}
doneTabBtn.onclick = ()=>{
  tabClick(false);
}

window.onload = ()=>{
  tabClick(true);
}

