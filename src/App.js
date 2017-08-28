/*jshint esversion: 6 */

import React from 'react';
import * as BooksAPI from './BooksAPI';
import {Route} from 'react-router-dom';
import ListBooks from './ListBooks';
import SearchBooks from './SearchBooks';
import './App.css';

class BooksApp extends React.Component {
    state = {
        books: [],
        searchResultsBookList: []
    }

    componentDidMount() {
        BooksAPI.getAll().then((book) => {
            this.setState({books: book});
        })
    }

    updateBookShelf = (book, shelf) => {
        BooksAPI.update(book, shelf).then((resp) => {
            BooksAPI.getAll().then((book) => {
                this.setState({books: book});
            });
            this.setState({
                searchResultsBookList: this.state.searchResultsBookList.map((bookind) => {
                    if (bookind.id === book.id) {
                        bookind.shelf = shelf;
                    }
                    return bookind;
                })
            });
        });
    }


    updateQuery = (query) => {
        var allList = this.state.books;
        BooksAPI.search(query, 20).then((books) => {
            for (var i = 0; i < books.length; i++) {
                var book = books[i], found = false;
                for (var j = 0; j < allList.length && found === false; j++) {
                    if (!book.shelf && allList[j].id === book.id) {
                        book.shelf = allList[j].shelf;
                        found = true;
                        BooksAPI.update(book, book.shelf);
                    }
                }
                if (found === false) {
                    book.shelf = "none";
                }
            }
            if (!books.error) {
                this.setState({searchResultsBookList: books});
            }
        });
    }
    initialLoad = () => {
        this.setState({searchResultsBookList: []});
    }


    render() {
        return (
            <div className="app">
                <Route path='/search' render={() => (
                    <SearchBooks allBookList={this.state.searchResultsBookList}
                                 onInitialLoad={this.initialLoad}
                                 onBookShelfUpdate={this.updateBookShelf}
                                 onUpdateQuery={this.updateQuery}/>
                )}/>
                <Route exact path="/" render={() => (<div className="list-books">
                    <div className="list-books-title">
                        <h1>MyReads</h1>
                    </div>
                    <div className="list-books-content">
                        <ListBooks bookList={this.state.books} onBookShelfUpdate={this.updateBookShelf}/>
                    </div>
                </div>)}/>
            </div>
        )
    }
}

export default BooksApp;
