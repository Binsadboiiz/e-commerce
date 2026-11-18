create table RedirectRules(
    int Id not null auto_increment primary key,
    SourceUrl varchar(255) not null,
    TargetUrl varchar(255) not null,
    StatusCode int not null,
    IsRegex boolean not null default false,
    IsActive boolean not null default true,
    HitCount bigint not null default 0,
    LastAccessedAt datetime default null,
    createdAt datetime default current_timestamp,
    updatedAt datetime default current_timestamp on update current_timestamp
);