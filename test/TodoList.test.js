const { expect } = require("chai");

describe("TodoList", function() {
  let TodoList, todoList, owner;

  beforeEach(async function() {
    TodoList = await ethers.getContractFactory("TodoList");
    todoList = await TodoList.deploy();
    await todoList.deployed();
    [owner] = await ethers.getSigners();
  });

  it("deploys successfully", async function() {
    expect(todoList.address).to.not.equal(0x0);
    expect(todoList.address).to.not.equal('');
    expect(todoList.address).to.not.equal(null);
    expect(todoList.address).to.not.equal(undefined);
  });

  it("lists tasks", async function() {
    const taskCount = await todoList.taskCount();
    expect(taskCount).to.equal(2);  // Should be 2 initial tasks

    const task1 = await todoList.tasks(1);
    expect(task1.id).to.equal(1);
    expect(task1.content).to.equal('Check my task');
    expect(task1.completed).to.equal(false);

    const task2 = await todoList.tasks(2);
    expect(task2.id).to.equal(2);
    expect(task2.content).to.equal('Eat Dinner');
    expect(task2.completed).to.equal(false);
  });

  it("creates tasks", async function() {
    const tx = await todoList.createTask('A new task');
    const taskCount = await todoList.taskCount();
    expect(taskCount).to.equal(3);  // Should be 3 after adding new task
    
    const task = await todoList.tasks(3);
    expect(task.id).to.equal(3);
    expect(task.content).to.equal('A new task');
    expect(task.completed).to.equal(false);
    
    await expect(tx)
      .to.emit(todoList, 'TaskCreated')
      .withArgs(3, 'A new task', false);
  });

  it("toggles task completion", async function() {
    const tx = await todoList.toggleCompleted(1);
    const task = await todoList.tasks(1);
    expect(task.completed).to.equal(true);
    
    await expect(tx)
      .to.emit(todoList, 'TaskCompleted')
      .withArgs(1, true);
  });
});
