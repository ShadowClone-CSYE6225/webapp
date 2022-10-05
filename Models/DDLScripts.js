const query = `
CREATE TABLE Accounts (
    id serial PRIMARY KEY,
    first_name varchar(36) NOT NULL,
    last_name varchar(36) NOT NULL,
    password varchar(20) NOT NULL,
    username varchar(50) NOT NULL,
    account_created TIMESTAMP NOT NULL,
    account_updated
);
`;

// -- CREATE TABLE Accounts (
//     --     id serial PRIMARY KEY,
//     --     first_name varchar(36) NOT NULL,
//     --     last_name varchar(36) NOT NULL,
//     --     password varchar(20) NOT NULL,
//     --     username varchar(50) NOT NULL,
//     --     account_created TIMESTAMP NOT NULL,
//     --     account_updated TIMESTAMP );
//     -- GRANT SELECT(id, account_created, account_updated), INSERT(id, "password") ON Accounts TO PUBLIC;
//     -- INSERT INTO accounts (first_name,last_name,"password", username, account_created) VALUES('Pratik', 'Talreja', 'abc', 'email@abc.com', CURRENT_TIMESTAMP);
//     -- GRANT SELECT ON SCHEMA public TO PUBLIC;
//     -- GRANT SELECT ON accounts TO public;
//     -- UPDATE accounts SET account_created = CURRENT_TIMESTAMP WHERE id=2;
//     SELECT * FROM accounts;
    
    