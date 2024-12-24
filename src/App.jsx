import { useEffect, useState } from "react";
import { Table, Button, Modal, TextInput, Label, Select } from "flowbite-react";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [formData, setFormData] = useState({ title: "", details: "", status: "" });


  function onCloseModal() {
    setOpenModal(false);
    setFormData({ title: "", details: "", status: "" });
    setSelectedTodo(null);
  }

  function onCloseCreateModal() {
    setOpenCreateModal(false);
    setFormData({ title: "", details: "", status: "" });
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/todos");
      const data = await response.json();
      // Handle nested array structure
      setTodos(Array.isArray(data[0]) ? data[0] : data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/v1/delete/${id}`, {
        method: "DELETE",
      });
      setTodos(todos.filter((todo) => todo.id !== id));
      alert("Todo deleted successfully");
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const openUpdateModal = (todo) => {
    setSelectedTodo(todo);
    setFormData({ title: todo.title, details: todo.details, status: todo.status });
    !setOpenModal(true);
  };

  const handleOpenEditModal = (todo) => {
    setSelectedTodo(todo);
    setFormData({ title: todo.title, details: todo.details, status: todo.status });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/createtodo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log(response)

      if (response.status === 200) {
        alert("Todo is created successfully")
      }
      setOpenCreateModal(false)

    } catch (error) {
      console.log(error)
      alert("Error creating todo")
    }
  }

  const handleUpdateTodo = async () => {
    if (!formData.title || !formData.details || !formData.status) {
      alert("Please fill in all fields");
      return;
    }
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/updatetodo/${selectedTodo.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (response.status === 200) {
        const updatedTodo = await response.json();
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
        );
        alert("Todo updated successfully");
        onCloseModal();
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      alert("Error updating todo");
    }
  };

  // const filterByStatus = async () => {
  //   try {
  //     const response = await fetch(`http://127.0.0.1:8000/api/v1/filter/todo`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(formData),
  //     });

  //     console.log(formData)
  //     console.log(response)
      
  //   } catch (error) {
      
  //   }
  // }

  // const filterByStatus = async () => {
  //   try {
  //     const response = await fetch(`http://127.0.0.1:8000/api/v1/filter/todo`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ status: formData.status }), // Send only the status field
  //     });
  
  //     if (response.ok) {
  //       const filteredTodos = await response.json();
  //       alert(filteredTodos);
  //     } else {
  //       console.error("Failed to filter todos:", response.status);
  //       alert("Error filtering todos");
  //     }
  //   } catch (error) {
  //     console.error("Error during filtering:", error);
  //     alert("Error during filtering");
  //   }
  // };

  const filterByStatus = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/filter/todo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: formData.status }), // Send only the status field
      });
  
      if (response.ok) {
        const filteredTodos = await response.json();
  
        // Convert the response array to a readable string format
        const resultMessage = filteredTodos.map((todo, index) => 
          `${index + 1}. Title: ${todo.title}, Status: ${todo.status}`
        ).join('\n');
  
        alert(resultMessage || "No todos found with the selected status.");
      } else {
        console.error("Failed to filter todos:", response.status);
        alert("Error filtering todos");
      }
    } catch (error) {
      console.error("Error during filtering:", error);
      alert("Error during filtering");
    }
  };
  
  
  

  return (
    <div className="overflow-x-auto">
      <div class="flex justify-between">
        <div>
           <h1 class="p-5">Welcome to Dexwin Todo List</h1>
        </div>
        <div class="m-3">
          <Button
              size="xs"
              color="info"
              onClick={() => !setOpenCreateModal(true)}
            >
              Create
            </Button>
        </div>
        <div class="m-3">
          <TextInput
             id="text"
             name="status"
             placeholder="enter word to filter by"
             onChange={handleInputChange}
             required
          />
          <Button onClick={filterByStatus}>
            filter
          </Button>
        </div>
      </div>
      <Table striped>
        <Table.Head>
          <Table.HeadCell>Todo Title</Table.HeadCell>
          <Table.HeadCell>Details</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Created At</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {todos.map((todo) => (
            <Table.Row key={todo.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {todo.title}
              </Table.Cell>
              <Table.Cell>{todo.details}</Table.Cell>
              <Table.Cell>{todo.status}</Table.Cell>
              <Table.Cell>
                {new Date(todo.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Table.Cell>
              <Table.Cell>
                <div className="flex space-x-2">
                  <Button
                    size="xs"
                    color="yellow"
                    onClick={() => openUpdateModal(todo)}
                  >
                    Update
                  </Button>
                  <Button
                    size="xs"
                    color="failure"
                    onClick={() => handleDelete(todo.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Table.Cell>
              
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Update Details</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="title" value="Todo Title" />
              </div>
              <TextInput
                id="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="details" value="Details" />
              </div>
              <TextInput 
                id="details" 
                name="details"
                type="text" 
                value={formData.details}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="status" value="Status" />
              </div>
              <Select 
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                id="status" 
                required>
              <option>--Select--</option>
              <option value='completed'>Completed</option>
              <option value='in progress'>In progress</option>
              <option value='not started'>Not started</option>
             </Select>
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
            <Button onClick={handleUpdateTodo}>Update Todo</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* create modal */}
      <Modal show={openCreateModal} size="md" onClose={onCloseCreateModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Create Todo</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="title" value="Todo Title" />
              </div>
              <TextInput
                id="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="details" value="Details" />
              </div>
              <TextInput 
                id="details" 
                name="details"
                type="text" 
                value={formData.details}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="status" value="Status" />
              </div>
              <Select 
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                id="status" 
                required>
              <option>--Select--</option>
              <option value='completed'>completed</option>
              <option value='in progress'>in progress</option>
              <option value='not started'>not started</option>
             </Select>
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
            <Button onClick={handleCreate}>Create Todo</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}


