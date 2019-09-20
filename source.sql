CREATE TABLE User(
         userName VARCHAR(50) NOT NULL,
         SUID INT(9) NOT NULL,
         netID VARCHAR(8) NOT NULL,
         userPassword VARCHAR(50) NOT NULL,
         userDesignation VARCHAR(20) NOT NULL,
         userWorkPlace VARCHAR(50) NOT NULL,
         PRIMARY KEY(SUID,netID)
         );

insert into User values('Saumya Sharma','123456789','ssharm29','pollengrains','Student','Ernie Davis');
insert into User values('Anuja Mahajan','234617235','apmahaja','bubbles','Student','Sadler');


CREATE TABLE DiningHalls(
diningName VARCHAR (50) NOT NULL,
diningAddress VARCHAR(100) NOT NULL,
diningPhone VARCHAR(12) NOT NULL,
diningManager VARCHAR(30) NOT NULL,
diningEmail VARCHAR(50) NOT NULL,
PRIMARY KEY(diningName)
);

insert into DiningHalls values('Sadler','100 Irving Avenue','315-443-2449','Debbie Lawson','dgriffo@syr.edu');
insert into DiningHalls values('Ernie Davis','601 Comstock Avenue','315-443-1450','Stephen Brandt','sjbrandt@syr.edu');

Create table PermanentWeeklySchedule_b ( netid varchar(50), HallName varchar (50), 
ShiftDay varchar(10), WorkingFrom Time, WorkingTo Time, Designation varchar (50) );

Create table PermanentSubSchedule_b ( netid varchar(50), HallName varchar (50), 
ShiftDay varchar(10), A_date date, WorkingFrom Time, WorkingTo Time, Designation varchar (50), OpenShift Varchar(1), Sub varchar(50));
