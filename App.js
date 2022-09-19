
import React from 'react';
import { useState, useEffect } from 'react';
import { Container, Form, Button, Table, Modal, Card } from 'react-bootstrap/'
import { getDatabase, ref, set, push, onValue, remove, update } from "firebase/database";
import firebaseConfig from './firebase.config';
import './App.css';

function App() {
  const db = getDatabase();

  let [newTaskTitle, setNewTaskTitle] = useState('');
  let [newTaskDescription, setNewTaskDescription] = useState('');

  let [msgTaskTitle, setMsgTaskTitle] = useState('');
  let [msgTaskDes, setMsgTaskDes] = useState('');
  let [msgSucc, setMsgSucc] = useState('');

  let [msgEditTitle, setMsgEditTitle] = useState('');
  let [msgEditDes, setMsgEditDes] = useState('');

  let [todoListArr, setTodoListArr] = useState([]);
  let [change, setChange] = useState(true);
  let [titleEdit, setTitleEdit] = useState('');
  let [descriptionEdit, setDescriptionEdit] = useState('');
  let [editID, setEditID] = useState('');

  const [show, setShow] = useState(false);

  const editModalClose = () => setShow(false);
  const editModalShow = (id) => {
    setShow(true);
    setEditID(id);
  };

  const handleNewTaskTitle = (e) => {
    setMsgTaskTitle('');
    setNewTaskTitle(e.target.value);
  }
  const handleNewTaskDescription = (e) => {
    setMsgTaskDes('');
    setNewTaskDescription(e.target.value);
  }

  const handleTitleEdit = (e) => {
    setMsgEditTitle('');
    setTitleEdit(e.target.value);
  }
  const handleDescriptionEdit = (e) => {
    setMsgEditDes('');
    setDescriptionEdit(e.target.value);
  }

  const handleSubmit = (e) => {
    const todoListRef = ref(db, "todoList");
    e.preventDefault();
    if (newTaskTitle == '') {
      setMsgTaskTitle('You must give a title for your task.');
    } else if (newTaskDescription == '') {
      setMsgTaskDes('You must add details about your task.');
    } else if (newTaskDescription.length > 30) {
      setMsgTaskDes('Your task details must not be more than 30 characters long.');
    } else {
      setMsgSucc('Task successfully added!');
      set(push(todoListRef), {
        task_Title: newTaskTitle,
        task_Details: newTaskDescription,
      }).then(() => {
        setChange(!change);
        setNewTaskTitle('');
        setNewTaskDescription('');
      });
    }
  };

  const handleEdit = () => {
    const todoListRefEdit = ref(db, "todoList/" + editID);

    if (titleEdit == '') {
      setMsgEditTitle('You must not leave your task title blank!');
    } else if (descriptionEdit == '') {
      setMsgEditDes('You must add details about your task.');
    } else {
      update(todoListRefEdit, {
        task_Title: titleEdit,
        task_Details: descriptionEdit,
      }).then(() => {
        setChange(!change);
        setShow(false);
        setTitleEdit('');
        setDescriptionEdit('');
      })
    }
  }
  const handleDelete = (id) => {
    const todoListRefDel = ref(db, "todoList/" + id);

    remove(todoListRefDel).then(() => {
      setChange(!change);
    })
  }

  useEffect(() => {
    const todoListRef = ref(db, "todoList");
    let arr = [];
    onValue(todoListRef, (snapshot) => {
      snapshot.forEach((item) => {
        let taskInfo = {
          taskID: item.key,
          taskTitle: item.val().task_Title,
          taskDetails: item.val().task_Details,
        }
        arr.push(taskInfo);
      })
      setTodoListArr(arr);
    });
  }, [change])



  // if (username == '') {
  //   setMsg('You must enter your username!');
  // } else if (email == ''){
  //   setMsg('You must enter your email!');
  // } else if (password == '') {
  //   setMsg('You must enter your password!');
  // } else if (confPassword == '') {
  //   setMsg('You must confirm your password!');
  // } else{
  //   setMsg('Sign up done successfully!');
  // }


  // let [username, setUsername] = useState('');
  // let [email, setEmail] = useState('');
  // let [password, setPassword] = useState('');
  // let [confPassword, setConfPassword] = useState('');
  // let [msg, setMsg] = useState('');

  // const handleUsername = (e) => {
  //   setMsg('');
  //   setUsername(e.target.value);
  // }
  // const handleEmail = (e) => {
  //   setMsg('');
  //   setEmail(e.target.value);
  // }
  // const handlePass = (e) => {
  //   setMsg('');
  //   setPassword(e.target.value);
  // }
  // const handleConfPass = (e) => {
  //   setMsg('');
  //   setConfPassword(e.target.value);
  // }

  return (
    <>
      {/* task add form starts */}
      <Container className='mb-3 mt-4'>
        <h2 className='mb-4 text-center text-dark'>To Do Application by ReactJS</h2>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label className='fw-bold mb-2'>Add Task</Form.Label>
            <Form.Control
              className='mb-2'
              onChange={handleNewTaskTitle}
              type="text"
              value={newTaskTitle}
              placeholder="Enter Task Title"
            />
            {msgTaskTitle != '' ? (
              <Form.Text className="mb-3 d-block text-danger">
                {msgTaskTitle}
              </Form.Text>
            ) : (
              ''
            )}

            <Form.Control
              onChange={handleNewTaskDescription}
              as="textarea"
              value={newTaskDescription}
              placeholder="Enter Task Description"
            />
            {msgTaskDes != '' ? (
              <Form.Text className="mb-3 d-block text-danger">
                {msgTaskDes}
              </Form.Text>
            ) : (
              ''
            )}

            {msgSucc != '' ? (
              <Form.Text className="mb-3 fs-5 d-block text-success">
                {msgSucc}
              </Form.Text>
            ) : (
              ''
            )}
          </Form.Group>

          <Button
            className='d-block mt-3 addTaskBtn'
            onClick={handleSubmit}
            variant="primary"
            type="submit"
          >
            Add
          </Button>
        </Form>
      </Container>
      {/* task add form ends */}


      {/* task list table starts */}
      <Container className='mt-3 taskList px-5'>
        <h3 className='mb-4 text-center text-dark'>Task List</h3>
        <Table striped>
          <thead>
            <tr className='fs-5'>
              <th>Task Title</th>
              <th>Task Description</th>
              <th className='text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
            {todoListArr.map(item => (
              <tr>
                <td className='fw-bold'>{item.taskTitle}</td>
                <td>{item.taskDetails}</td>
                <td className='text-center'>
                  <Button
                    variant="success"
                    onClick={() => editModalShow(item.taskID)}>Edit</Button>
                  <Button
                    onClick={() => handleDelete(item.taskID)}
                    className='mx-3'
                    variant="danger">Delete</Button>{' '}
                </td>
              </tr>
            ))}

          </tbody>
        </Table>
      </Container>
      {/* task list table ends */}



      {/* <Container>
        <h3 className='mb-4 text-center text-dark'>Simple Sign Up Form By ReactJS</h3>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control onChange={handleUsername} type="text" placeholder="Enter Username" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control onChange={handleEmail} type="email" placeholder="Enter email" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onChange={handlePass} type="password" placeholder="Password" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicConfPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control onChange={handleConfPass} type="password" placeholder="Confirm Password" />
          </Form.Group>
          {msg != '' ? (
            <Form.Text className="fs-5 text-danger">{msg}
            </Form.Text>
          ) : (
            ''
          )}
          <Button className='d-block mt-3' onClick={handleSubmit} variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container> */}


      {/* modal codes */}
      <Modal show={show} onHide={editModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Edit your Task Title</Form.Label>
              <Form.Control
                onChange={handleTitleEdit}
                value={titleEdit}
                type="text"
            
              />
              {msgEditTitle != '' ? (
                <Form.Text className="mb-3 d-block text-danger">
                  {msgEditTitle}
                </Form.Text>
              ) : (
                ''
              )}
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Edit your Task Description</Form.Label>
              <Form.Control
                onChange={handleDescriptionEdit}
                value={descriptionEdit}
                as="textarea"
                rows={2}
              />
              {msgEditDes != '' ? (
                <Form.Text className="mb-3 d-block text-danger">
                  {msgEditDes}
                </Form.Text>
              ) : (
                ''
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={editModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      {/* modal codes */}


    </>
  );
}

export default App;
