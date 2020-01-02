--Migration 28.12.2019 adding Column OfficeID to Tasks Table as a reference to Office
use Office;

ALTER TABLE Tasks
ADD OfficeID int not null;