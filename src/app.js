const App = {
  provider: null,
  signer: null,
  contract: null,

  load: async () => {
    await App.loadWeb3();
    await App.loadContract();
    await App.render();
  },

  loadWeb3: async () => {
    try {
      if (window.ethereum) {
        App.provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        App.signer = App.provider.getSigner();
      } else {
        throw new Error("Please install MetaMask!");
      }
    } catch (error) {
      console.error("Error loading Web3:", error);
      throw error;
    }
  },

  loadContract: async () => {
    try {
      const todoListArtifact = await $.getJSON('artifacts/contracts/TodoList.sol/TodoList.json');
      const networkId = (await App.provider.getNetwork()).chainId;
      const deployedNetwork = todoListArtifact.networks[networkId];
      
      App.contract = new ethers.Contract(
        deployedNetwork.address,
        todoListArtifact.abi,
        App.signer
      );
    } catch (error) {
      console.error("Error loading contract:", error);
      throw error;
    }
  },

  render: async () => {
    if (App.loading) return;
    App.setLoading(true);

    const account = await App.signer.getAddress();
    $('#account').html(account);

    await App.renderTasks();
    App.setLoading(false);
  },

  renderTasks: async () => {
    const taskCount = await App.contract.taskCount();
    const $taskTemplate = $('.taskTemplate');

    for (let i = 1; i <= taskCount; i++) {
      try {
        const task = await App.contract.tasks(i);
        if (!task.exists) continue;

        const $newTaskTemplate = $taskTemplate.clone();
        $newTaskTemplate.find('.content').html(task.content);
        $newTaskTemplate.find('input')
          .prop('name', task.id.toString())
          .prop('checked', task.completed)
          .on('click', App.toggleCompleted);
        
        $newTaskTemplate.find('.delete-btn')
          .attr('data-id', task.id.toString())
          .on('click', App.deleteTask);

        if (task.completed) {
          $('#completedTaskList').append($newTaskTemplate);
        } else {
          $('#taskList').append($newTaskTemplate);
        }

        $newTaskTemplate.show();
      } catch (error) {
        console.error(`Error rendering task ${i}:`, error);
      }
    }
  },

  createTask: async () => {
    App.setLoading(true);
    const content = $('#newTask').val();
    try {
      const tx = await App.contract.createTask(content);
      await tx.wait();
      window.location.reload();
    } catch (error) {
      console.error("Error creating task:", error);
      App.setLoading(false);
    }
  },

  toggleCompleted: async (e) => {
    App.setLoading(true);
    const taskId = e.target.name;
    try {
      const tx = await App.contract.toggleCompleted(taskId);
      await tx.wait();
      window.location.reload();
    } catch (error) {
      console.error("Error toggling task:", error);
      App.setLoading(false);
    }
  },

  deleteTask: async (e) => {
    App.setLoading(true);
    const taskId = $(e.target).data('id');
    try {
      const tx = await App.contract.deleteTask(taskId);
      await tx.wait();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting task:", error);
      App.setLoading(false);
    }
  },

  setLoading: (boolean) => {
    App.loading = boolean;
    const loader = $('#loader');
    const content = $('#content');
    if (boolean) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  }
};

window.addEventListener('load', async () => {
  try {
    await App.load();
  } catch (error) {
    console.error("Error loading app:", error);
  }
});
