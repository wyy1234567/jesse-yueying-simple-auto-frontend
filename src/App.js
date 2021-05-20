import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };

    this.getAll = this.getAll.bind(this);
  }

  componentDidMount() {
    this.getAll();
  }

  getAll() {
    axios
      // .get("https://vm-autos-api-santiago-carina.herokuapp.com/api/autos")
      .get("https://cors-anywhere.herokuapp.com/https://vm-autos-api-santiago-carina.herokuapp.com/api/autos")
      .then((res) => {
        var data = res.automobiles;
        this.setState({
          data: data,
        });
      })
      .catch(function (err) {
      });
  }

  renderAuto = (auto) => {
    return(
      <div className="Auto-details">
        <p> 
          Model: {auto.model}
          Vin: {auto.vin}
          Make: {auto.make}
          {auto.color ? "Color: " + auto.color : "" }
          {auto.owner ? "Owner: " + auto.owner : "" }
          {auto.year ? "Year: " + auto.year : "" }
          <button className="update-auto-button" onClick={() => this.handleUpdateButton()}>update</button>
          <button className="delete-auto-button" onClick={() => this.handleDeleteButton()}>delete</button>
        </p>
      </div>
    )
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <h1>All autos:</h1>
          <div className="Auto-list">
            {this.state.data.map((item, index) => (
              this.renderAuto(item)
            ))}
        </div>
      </div>
    );
  }
}

export default App;
