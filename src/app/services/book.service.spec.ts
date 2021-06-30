import swal from 'sweetalert2';
import { Book } from './../models/book.model';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BookService } from './book.service';
import { environment } from '../../environments/environment.prod';

const listBook: Book[] = [
    {
        name: '',
        author: '',
        isbn: '',
        price: 15,
        amount: 2
    },
    {
        name: '',
        author: '',
        isbn: '',
        price: 20,
        amount: 1
    },
    {
        name: '',
        author: '',
        isbn: '',
        price: 8,
        amount: 7
    },
];

const book: Book = {
    name: '',
    author: '',
    isbn: '',
    price: 15,
    amount: 2
}

describe('BookService', () => {

    let service: BookService;
    let httpMock: HttpTestingController;
    let storage = {};

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                BookService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        });
    });

    beforeEach(() => {
        service = TestBed.inject(BookService);
        httpMock = TestBed.inject(HttpTestingController);

        storage = {};
        spyOn(localStorage, 'getItem').and.callFake((key: string) => {
            return storage[key] ? storage[key] :null;
        });

        spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
            return storage[key] = value;
        });
    });

    afterAll(() => {
        httpMock.verify();
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getBook return a list of book and does a get method', () => {
        service.getBooks().subscribe((resp: Book[]) => {
            expect(resp).toEqual(listBook); // compara la respuesta sea igual al array listBook
        });
        const req = httpMock.expectOne(environment.API_REST_URL + '/book'); // URL Esperada
        expect(req.request.method).toBe('GET'); // Metodo esperado
        req.flush(listBook); // Simular que la peticion se ha hecho y devuelva un observable
    });

    it('getBooksFromCart return empy array when localStorage is empty', () => {
        const listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(0);
    });

    it('addBookToCart add a book successfully when the list does not exist in the localStorage', () => {

        const toast = {
            fire: () => null
        } as any;

        const spy1 = spyOn(swal, 'mixin').and.callFake(() => {
            return toast;
        });

        let listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(0);
        service.addBookToCart(book);
        listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(1);
        service.addBookToCart(book);
        expect(spy1).toHaveBeenCalled();
    });

    it('removeBooksFromCart removes the list from the storage', () => {
        service.addBookToCart(book);
        let listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(1);
        service.removeBooksFromCart();
        listBook = service.getBooksFromCart();
        expect(listBook.length).toBe(0);
    });

});