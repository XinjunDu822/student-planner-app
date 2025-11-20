function GenericTask(name, index)
{
  var d = new Date();
  d.setHours(Math.random() * 24, Math.floor(Math.random() * 4) * 15, 0, 0);

  d.setDate(d.getDate() + Math.random() * 10 + 10 * index);

  return {name: name, 
          desc: name + " description", 
          date: d};
};


export var DummyUsers = [{id: 1, usr: "nobody103", pwd: "Password1234."},
                         {id: 2, usr: "TDurschmid", pwd: "Password1234."},
                         {id: 3, usr: "ProfEggert", pwd: "Password1234."}];


class MockTaskDatabase { 

    constructor() {
        this.tasks = [GenericTask("Late Task 1", -3), 
                    GenericTask("Late Task 2", -2),
                    GenericTask("Late Task 3", -1),
                    GenericTask("Generic Task 1", 1),
                    GenericTask("Generic Task 2", 2),
                    GenericTask("Generic Task 3", 3),
                    GenericTask("Generic Task 4", 4),
                    GenericTask("Generic Task 5", 5),
                ];
        this.listeners = new Set();

        this.emitChange();
    }

    getData()
    {
        return this.tasks;
    }

    add(task)
    {
        var updatedTasks = [...this.tasks];
        var i = updatedTasks.length;

        updatedTasks.push(task);

        var j = i - 1;

        while(j >= 0 && task.date < updatedTasks[j].date)
        {
            var temp = updatedTasks[j + 1];
            updatedTasks[j + 1] = updatedTasks[j];
            updatedTasks[j] = temp;
            j--;
        }

        this.tasks = updatedTasks;

        this.emitChange();
    }

    edit(i, task)
    {
        var updatedTasks = [...this.tasks];

        updatedTasks[i] = task;

        var j = i - 1;

        while(j >= 0 && task.date < updatedTasks[j].date)
        {
            var temp = updatedTasks[j + 1];
            updatedTasks[j + 1] = updatedTasks[j];
            updatedTasks[j] = temp;
            j--;
        }

        j = i + 1;

        while(j < updatedTasks.length && task.date > updatedTasks[j].date)
        {
            temp = updatedTasks[j - 1];
            updatedTasks[j - 1] = updatedTasks[j];
            updatedTasks[j] = temp;
            j++;
        }

        this.tasks = updatedTasks;

        this.emitChange();
    }

    delete(i)
    {
        var updatedTasks = [...this.tasks];

        updatedTasks.splice(i, 1);

        this.tasks = updatedTasks;

        this.emitChange();
    }

    emitChange() {
        this.listeners.forEach(listener => listener());
    }


    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
}


class MockCompletedTaskDatabase {

    constructor ()
    {
        this.tasks = [GenericTask("Completed Task 1", -2),
                    GenericTask("Completed Task 2", -3)
                ];
        this.listeners = new Set();
    }

    getData()
    {
        return this.tasks;
    }

    add(task)
    {
        var updatedTasks = [...this.tasks];

        updatedTasks.push(task);

        this.tasks = updatedTasks;

        this.emitChange();
    }

    emitChange() {
        this.listeners.forEach(listener => listener());
    }


    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
}

export const TaskDatabase = new MockTaskDatabase();
export const CompletedTaskDatabase = new MockCompletedTaskDatabase();
