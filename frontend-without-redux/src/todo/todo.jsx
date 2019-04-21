import React, { Component } from 'react'
import axios from 'axios'

import PageHeader from '../template/pageHeader'
import TodoFrom from '../todo/todoForm'
import TodoList from '../todo/todoList'

const URL = 'http://localhost:3003/api/todos'

export default class Todo extends Component {
    constructor(props) {
        super(props)
        this.state= { description: '', list: [] }
    
        this.handleAdd = this.handleAdd.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleClear = this.handleClear.bind(this)

        this.remove = this.remove.bind(this)
        this.markAsDone = this.markAsDone.bind(this)
        this.markAsPending = this.markAsPending.bind(this)
        
        this.refresh()
    }

    refresh(description = '') {
        const search = description ? `&description__regex=/${description}/` : ''
        axios.get(`${URL}?sort=-createdAt${search}`)
            .then(resp => this.setState({...this.state, description, list: resp.data}))
    }

    handleSearch() {
        this.refresh(this.state.description)
    }

    handleClear() {
        this.refresh()
    }

    handleAdd() {
        const description = this.state.description
        axios.post(URL, { description })
            .then(resp => this.refresh())
      }

    handleChange(e) {
        this.setState({...this.state, description: e.target.value })
      }

    remove(todo) {
        axios.delete(`${URL}/${todo._id}`)
            .then(reso => this.refresh(this.state.description))
    }

    markAsDone(todo) {
        axios.put(`${URL}/${todo._id}`, {...todo, done: true})
            .then(resp => this.refresh(this.state.description))
    }

    markAsPending(todo) {
        axios.put(`${URL}/${todo._id}`, {...todo, done: false})
            .then(resp => this.refresh(this.state.description))
    }

    render() {
        return(
            <div>
                <PageHeader name='Tarefas' small='Cadastro' />
                <TodoFrom description={this.state.description}
                    handleAdd={this.handleAdd}
                    handleChange={this.handleChange}
                    handleSearch={this.handleSearch}
                    handleClear={this.handleClear} />
                <TodoList 
                    list={this.state.list}
                    remove={this.remove}
                    markAsDone={this.markAsDone}
                    markAsPending={this.markAsPending}
                    />
            </div>
        )
    }
}