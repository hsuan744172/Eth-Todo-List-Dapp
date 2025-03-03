// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TodoList {
    uint public taskCount = 0;

    struct Task {
        uint id;
        string content;
        bool completed;
        bool exists;
    }

    mapping(uint => Task) public tasks;

    event TaskCreated(uint id, string content, bool completed);
    event TaskCompleted(uint id, bool completed);
    event TaskDeleted(uint id);

    constructor() {
        createTask("Check my task");
        createTask("Eat Dinner");
    }

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false, true);
        emit TaskCreated(taskCount, _content, false);
    }

    function toggleCompleted(uint _id) public {
        require(tasks[_id].exists, "Task does not exist");
        tasks[_id].completed = !tasks[_id].completed;
        emit TaskCompleted(_id, tasks[_id].completed);
    }

    function deleteTask(uint _id) public {
        require(tasks[_id].exists, "Task does not exist");
        delete tasks[_id];
        emit TaskDeleted(_id);
    }

    function getTask(uint _id) public view returns (Task memory) {
        require(tasks[_id].exists, "Task does not exist");
        return tasks[_id];
    }
}
