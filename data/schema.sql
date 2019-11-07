DROP TABLE IF EXISTS resource CASCADE;
CREATE TABLE resource (
  id SERIAL PRIMARY KEY,
  logo_img varchar(255),
  title varchar(255),
  email varchar(255),
  resource_url varchar(255),
  description text
);