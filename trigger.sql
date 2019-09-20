DELIMITER $$
CREATE
DEFINER=root@localhost
TRIGGER EMP_DETAILS
AFTER INSERT ON PermanentWeeklySchedule_b
for each row
BEGIN
DECLARE start_date INT default dayofyear("2018-08-26");
DECLARE end_date INT default dayofyear("2018-12-20");
DECLARE actual_date date;
declare iterator INT default 0;
while iterator <= (end_date-start_date) do
select date_add("2018-08-26", interval iterator day) into actual_date;
if dayname(actual_date)=new.ShiftDay Then
Insert into PermanentSubSchedule_b values
(new.netid,new.HallName, new.ShiftDay ,actual_date, new.WorkingFrom, new.WorkingTo,  new.Designation,'N','');
set iterator := iterator+1;
end if;
end while;
END$$