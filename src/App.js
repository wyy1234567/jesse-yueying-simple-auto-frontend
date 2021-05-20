import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      search_make: '',
      show_update_form: false,
      new_auto_vin: '',
      new_auto_make: '',
      new_auto_year: '',
      new_auto_model: ''
    };

    this.getAll = this.getAll.bind(this);
  }

  componentDidMount() {
    this.getAll();
    console.log(this.state);
  }

  getAll() {
    axios
      .get('https://simple-autos-jesse-kiwi.herokuapp.com/autos')
      .then((res) => {
        // console.log(res);
        var data = res.data.automobiles;
        this.setState({
          data: data,
        });
      })
      .catch(function (err) {
      });
  }

  renderAuto = (auto, index) => {
    return(
      <div className="Auto-details" key={index}>
        <p> 
          Model: {auto.model}, 
          Vin: {auto.vin}, 
          Make: {auto.make}, 
          {auto.year ? " Year: " + auto.year + ", ": "" }
          {auto.year ? "Miles: " + auto.miles + ", ": "" }
          {auto.year ? "Price: " + auto.price + ", ": "" }
          <button className="update-auto-button" onClick={() => this.handleUpdateButton()}>update</button>
          <button className="delete-auto-button" onClick={() => this.handleDeleteButton()}>delete</button>
        </p>
      </div>
    )
  }

  // Change the state show_update_form to true: price and preowned
  // Render the autoUpdate form 
  handleUpdateButton = () => {

  }

  // Delete the specific auto from the auto list
  // Make a delete request to the backend 
  handleDeleteButton = () => {

  }

  // Return a simple form, handle the update event: only update its price and preowned
  // Update the auto list below, and make a patch to backend 
  // Hide the form once the operation is done: set the show_update_form to false 
  renderAutoUpdateForm = () => {

  }

  // Grab the form's info, update the auto list below 
  // Make a Post to backend, update the db
  // Clear the form, don't refresh the page 
  handleNewAutoSubmit = (event) => {
    event.preventDefault();
    let newAuto = {
      vin: this.state.new_auto_vin, 
      make: this.state.new_auto_make,
      model: this.state.new_auto_model,
      year: this.state.new_auto_year
    }
    axios.post('https://simple-autos-jesse-kiwi.herokuapp.com/autos', newAuto)
      .then((res) => {
      console.log(res);  

      const copy = [...this.state.data]
      copy.push(res.data)
      this.setState({
        data: copy,
        new_auto_vin: '',
        new_auto_make: '',
        new_auto_year: '',
        new_auto_model: ''
      })
    })
    .catch(function (err) {
    });
  }


  // Grab the form's info, filter the auto list, update the auto list with search result: make
  // Clear the form, don't refresh the page 
  handleAutoSearch = () => {

  }

  handleInputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    if (event.target.name === 'search_make') {
      axios.get(`https://simple-autos-jesse-kiwi.herokuapp.com/autos?color=&make=${this.state.search_make}`)
      .then((res) => {
        console.log(res);
      //   this.setState({
      //     data: res.data
      //   })
      })
      .catch(function (err) {
      });
    }
  }

  render() {
    return (
      <div className="App">
        <form className="new-auto-form" onSubmit={this.handleNewAutoSubmit}>
          <input className="input" name="new_auto_make" placeholder="Auto Make" value={this.state.new_auto_make} onChange={this.handleInputChange} />
          <input className="input" name="new_auto_model" placeholder="Auto Model" value={this.state.new_auto_model} onChange={this.handleInputChange} /> 
          <input className="input" name="new_auto_year" placeholder="Auto Year" value={this.state.new_auto_year} onChange={this.handleInputChange} /> 
          <input className="input" name="new_auto_vin" placeholder="Auto Vin Number" value={this.state.new_auto_vin} onChange={this.handleInputChange} />
          <button>submit</button>
        </form>

        <input className="input" name="search_make" placeholder="Search by make" value={this.state.search_make} onChange={this.handleInputChange} />

        <h1>All autos:</h1>
          <div className="Auto-list">
            {this.state.data.map((item, index) => (
              this.renderAuto(item, index)
            ))}
        </div>
      </div>
    );
  }
}

export default App;
