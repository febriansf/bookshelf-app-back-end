const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {

    if (!('name' in request.payload)) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    // eslint-disable-next-line no-unneeded-ternary
    const finished = readPage === pageCount ? true : false;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = (request, h) => {
    if (request.query.name !== undefined) {
        let { name } = request.query;
        name = name.toLowerCase();

        const book = books.filter((b) => b.name.toLowerCase().includes(name));

        if (book !== undefined) {
            return {
                status: 'success',
                data: {
                    // eslint-disable-next-line max-len
                    books: book.map(({ id, name: bookName, publisher }) => ({ id, name: bookName, publisher })),
                },
            };
        }

        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        });
        response.code(404);
        return response;
    }

    if (request.query.reading !== undefined) {
        const { reading } = request.query;

        // eslint-disable-next-line eqeqeq
        if (reading == 1) {
            const book = books.filter((b) => b.reading === true);
                return {
                    status: 'success',
                    data: {
                        // eslint-disable-next-line max-len
                        books: book.map(({ id, name: bookName, publisher }) => ({ id, name: bookName, publisher })),
                    },
                };
        // eslint-disable-next-line eqeqeq
        } if (reading == 0) {
            const book = books.filter((b) => b.reading === false);
                return {
                    status: 'success',
                    data: {
                        // eslint-disable-next-line max-len
                        books: book.map(({ id, name: bookName, publisher }) => ({ id, name: bookName, publisher })),
                    },
                };
        }
    }

    if (request.query.finished !== undefined) {
        const { finished } = request.query;

        // eslint-disable-next-line eqeqeq
        if (finished == 1) {
            const book = books.filter((b) => b.finished === true);
                return {
                    status: 'success',
                    data: {
                        // eslint-disable-next-line max-len
                        books: book.map(({ id, name: bookName, publisher }) => ({ id, name: bookName, publisher })),
                    },
                };
        // eslint-disable-next-line eqeqeq
        } if (finished == 0) {
            const book = books.filter((b) => b.finished === false);
                return {
                    status: 'success',
                    data: {
                        // eslint-disable-next-line max-len
                        books: book.map(({ id, name: bookName, publisher }) => ({ id, name: bookName, publisher })),
                    },
                };
        }
    }

    return ({
        status: 'success',
        data: {
            // eslint-disable-next-line max-len
            books: books.map(({ id, name: bookName, publisher }) => ({ id, name: bookName, publisher })),
        },
    });
};

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter((b) => b.id === id)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;

    if (!('name' in request.payload)) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};
