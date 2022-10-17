import {
  Table,
  Container,
  Button,
  Modal,
  Form,
  InputGroup,
  props,
} from "react-bootstrap";
import { Component } from "react";

class Players extends Component {
  state = {
    players: [],
    showModal: false,
    showComfirm: false,
    username: "",
    email: "",
    password: "",
    id: 0,
  };

  getAllPlayer = async () => {
    const resp = await fetch("http://localhost:5000/api/players");
    const data = await resp.json();
    console.log(data.message);

    this.setState({
      players: data.message,
    });
  };

  componentDidMount() {
    this.getAllPlayer();
    // ganti color body di index.css gk bisa, jdi saya taruh disini mas
    document.body.style.backgroundColor = "darkslategray";
  }

  setEditPlayer = (player) => {
    this.setState({
      username: player.username,
      email: player.email,
      password: player.password,
      id: player.id,
    });
    this.toggleModal();
  };

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal,
    });
  };

  togglComfirm = () => {
    this.setState({
      showComfirm: !this.state.showComfirm,
    });
  };

  handleInputPlayer = async () => {
    const data = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
    };

    const resp = await fetch(`http://localhost:5000/api/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (resp.status === 201) {
      window.location.reload();
    }
  };

  handleSaveChange = async () => {
    const data = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
    };

    const resp = await fetch(
      `http://localhost:5000/api/players/${this.state.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (resp.status === 200) {
      this.toggleModal();
      this.getAllPlayer();
    }
  };

  handleDelete = async () => {
    const resp = await fetch(
      `http://localhost:5000/api/players/${this.state.id}`,
      {
        method: "DELETE",
      }
    );

    if (resp.status === 200) {
      this.togglComfirm();
      this.getAllPlayer();
    }
  };

  handleExp = async (id) => {
    const resp = await fetch(`http://localhost:5000/api/players/exp/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        exp: 1000,
      }),
    });

    console.log(resp);

    if (resp.status === 200) {
      this.getAllPlayer();
    }
  };

  handleOnChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  popupConfirm = () => {
    return (
      <Modal show={this.state.showComfirm} onHide={this.togglComfirm}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Comfirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>ARE YOU SURE TO DELETE THIS ITEM ?</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleDelete}>SURE</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  popupEdit = () => {
    return (
      <Modal show={this.state.showModal} onHide={this.toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Player</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Username :</InputGroup.Text>
            <Form.Control
              placeholder="Username"
              defaultValue={this.state.username}
              onChange={this.handleOnChange}
              id="username"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">email :</InputGroup.Text>
            <Form.Control
              placeholder="Email"
              defaultValue={this.state.email}
              onChange={this.handleOnChange}
              id="email"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">password :</InputGroup.Text>
            <Form.Control
              placeholder="Password"
              defaultValue={this.state.password}
              onChange={this.handleOnChange}
              id="password"
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.handleSaveChange}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  render() {
    return (
      <div className="body">
        <Container>
          <div>{this.popupConfirm()}</div>
          <div>
            <div className="header">
              <h2>INPUT PLAYER</h2>
            </div>
            <div className="colom">
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">username :</InputGroup.Text>
                <Form.Control
                  placeholder="username"
                  defaultValue={this.state.username}
                  onChange={this.handleOnChange}
                  id="username"
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">email :</InputGroup.Text>
                <Form.Control
                  placeholder="email"
                  defaultValue={this.state.email}
                  onChange={this.handleOnChange}
                  id="email"
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">password :</InputGroup.Text>
                <Form.Control
                  placeholder="password"
                  defaultValue={this.state.password}
                  onChange={this.handleOnChange}
                  id="password"
                />
              </InputGroup>
              <div className="submit">
                <Button variant="success" onClick={this.handleInputPlayer}>
                  Submit
                </Button>
              </div>
            </div>
          </div>
          <div>
            <div className="header">
              <h2>PLAYER LIST</h2>
            </div>
            <div className="colom">
              <Table striped bordered hover variant="light">
                <thead className="center-align">
                  <tr>
                    <th>id</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Experience</th>
                    <th>Level</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.players.map((player) => (
                    <tr key={player.id}>
                      <td>{player.id}</td>
                      <td>{player.username}</td>
                      <td>{player.email}</td>
                      <td className="center-align">{player.experience}</td>
                      <td className="center-align">{player.lvl}</td>
                      <td className="center-align">
                        <Button
                          variant="primary"
                          className="m-right"
                          onClick={() => {
                            this.setEditPlayer(player);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          className="m-left"
                          onClick={() => {
                            this.togglComfirm();
                            this.state.id = player.id;
                          }}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="warning"
                          onClick={() => {
                            this.handleExp(player.id);
                          }}
                        >
                          Add Experience
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
          <div>{this.popupEdit()}</div>
        </Container>
      </div>
    );
  }
}

export default Players;
