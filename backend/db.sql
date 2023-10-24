create database ToDoList;
use ToDoList;
create table team(
	id integer auto_increment,
    nome varchar(30),
    cognome varchar(30),
    ruolo varchar(30) default NULL,
    PRIMARY KEY (id)
);

create table task(
	id integer auto_increment,
    titolo varchar(30),
    assegnazione datetime,
    scadenza datetime,
    stato varchar(10) default "ToDo",
    teamid integer,
    flag boolean default True,
    PRIMARY KEY (id),
    FOREIGN KEY (teamid) REFERENCES team(id)
    
);

insert into team (nome, cognome) values( "Pippo", "Baudo");
insert into team (nome, cognome) values( "Topolino", "Mouse");
insert into team (nome, cognome) values( "Duffy", "Duck");