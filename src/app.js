App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  loadWeb3: async () => {
    if (window.ethereum) {
      try {
        App.web3Provider = window.ethereum
        web3 = new Web3(window.ethereum)
        // Request account access
        await window.ethereum.enable()
      } catch (error) {
        console.error("User denied account access")
      }
    }
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider
      web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert("Please connect to Metamask.")
    }
  },

  loadAccount: async () => {
    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      App.account = accounts[0];
      console.log('Current account:', App.account);
    } catch (error) {
      console.error('Error loading account:', error);
      throw error;
    }
  },

  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const todoList = await $.getJSON('TodoList.json')
    App.contracts.TodoList = TruffleContract(todoList)
    App.contracts.TodoList.setProvider(App.web3Provider)

    // Hydrate the smart contract with values from the blockchain
    App.todoList = await App.contracts.TodoList.deployed()
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    $('#account').html(App.account)

    // Render Tasks
    await App.renderTasks()

    // Update loading state
    App.setLoading(false)
  },

  renderTasks: async () => {
    const taskCount = await App.todoList.taskCount()
    const $taskTemplate = $('.taskTemplate')

    for (var i = 1; i <= taskCount; i++) {
      const task = await App.todoList.tasks(i)
      const taskId = task[0].toNumber()
      const taskContent = task[1]
      const taskCompleted = task[2]

      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find('.content').html(taskContent)
      $newTaskTemplate.find('input')
                      .prop('name', taskId)
                      .prop('checked', taskCompleted)
                      .on('click', App.toggleCompleted)
      
      // Add delete button handler
      $newTaskTemplate.find('.delete-btn')
                      .attr('data-id', taskId)
                      .on('click', App.deleteTask)

      if (taskCompleted) {
        $('#completedTaskList').append($newTaskTemplate)
      } else {
        $('#taskList').append($newTaskTemplate)
      }

      $newTaskTemplate.show()
    }
  },

  createTask: async () => {
    try {
      App.setLoading(true)
      const content = $('#newTask').val()
      await App.todoList.createTask(content, { from: App.account })
      window.location.reload()
    } catch (error) {
      console.error('Error creating task:', error)
      App.setLoading(false)
    }
  },

  toggleCompleted: async (e) => {
    try {
      App.setLoading(true)
      const taskId = e.target.name
      await App.todoList.toggleCompleted(taskId, { from: App.account })
      window.location.reload()
    } catch (error) {
      console.error('Error toggling task:', error)
      App.setLoading(false)
    }
  },

  deleteTask: async (e) => {
    try {
      App.setLoading(true)
      const taskId = $(e.target).data('id')
      // 找到並移除整個任務元素（包含checkbox、文字和刪除按鈕）
      $(e.target).closest('.taskTemplate').remove()
      await App.todoList.deleteTask(taskId, { from: App.account })
      window.location.reload()
    } catch (error) {
      console.error('Error deleting task:', error)
      App.setLoading(false)
    }
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  }
}

// Update the document ready handler
$(() => {
  $(window).on('load', async () => {
    try {
      await App.load()
    } catch (error) {
      console.error('Error loading app:', error)
    }
  })
})
