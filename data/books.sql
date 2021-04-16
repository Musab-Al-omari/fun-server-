DROP TABLE IF EXISTS newTable;

CREATE TABLE newTable(
    id SERIAL primary key not null,
    author varchar(255),
    title varchar(255),
    isbn varchar(255),
    image_url TEXT,
    description TEXT
);

