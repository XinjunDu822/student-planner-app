function GenericTask(name, index, isComplete = false)
{
  var d = new Date();
  d.setHours(Math.random() * 24, Math.floor(Math.random() * 4) * 15, 0, 0);

  d.setDate(d.getDate() + Math.random() * 10 + 10 * index);

  return {name: name, 
          desc: name + " description", 
          date: d,
          isComplete: isComplete};
};


export var DummyTasks = [GenericTask("Late Task 1", -3), 
                         GenericTask("Late Task 2", -2),
                         GenericTask("Late Task 3", -1),
                         GenericTask("Generic Task 1", 1),
                         GenericTask("Generic Task 2", 2),
                         GenericTask("Generic Task 3", 3),
                         GenericTask("Generic Task 4", 4),
                         GenericTask("Generic Task 5", 5),
                         GenericTask("Completed Task 1", -1, true),
                         GenericTask("Completed Task 2", -2, true)];

export var DummyUsers = [{id: 1, usr: "nobody103", pwd: "Password1234."},
                         {id: 2, usr: "TDurschmid", pwd: "Password1234."},
                         {id: 3, usr: "ProfEggert", pwd: "Password1234."}];
