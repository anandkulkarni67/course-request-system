DELETE FROM COURSES;
DELETE FROM USERS;

COMMIT;

-- sample courses.
INSERT INTO COURSES VALUES ('c0001', 'CS', '520', 'Computer Architecture and Organ', 50);
INSERT INTO COURSES VALUES ('c0002', 'CS', '526', 'Wireless Sensor Networks', 30);
INSERT INTO COURSES VALUES ('c0003', 'CS', '528', 'Computer Networks', 38);
INSERT INTO COURSES VALUES ('c0004', 'CS', '535', 'Introduction To Data Mining', 30);
INSERT INTO COURSES VALUES ('c0005', 'CS', '540', 'Adv Topics - Obj Oriented Prog', 19);
INSERT INTO COURSES VALUES ('c0006', 'CS', '542', 'Design Patterns', 33);
INSERT INTO COURSES VALUES ('c0007', 'CS', '545', 'Software Engineering', 41);
INSERT INTO COURSES VALUES ('c0008', 'CS', '550', 'Operating Systms', 200);
INSERT INTO COURSES VALUES ('c0009', 'CS', '551', 'Systems Programming', 21);
INSERT INTO COURSES VALUES ('c0010', 'CS', '575', 'Design and Analysis Comp Algorithms', 150);
INSERT INTO COURSES VALUES ('c0011', 'CS', '576', 'Program Models Emerg Platforms', 25);
INSERT INTO COURSES VALUES ('c0012', 'CS', '580C', 'Software Security', 20);
INSERT INTO COURSES VALUES ('c0013', 'CS', '580G', 'Game Devel for Mobile Platform', 40);
INSERT INTO COURSES VALUES ('c0014', 'CS', '580H', 'GUI and Windows Programming', 40);
INSERT INTO COURSES VALUES ('c0015', 'CS', '580L', 'Intro to Machine Learning', 29);
INSERT INTO COURSES VALUES ('c0016', 'CS', '580S', 'Smart Devices and Sensing', 34);

-- sample users.
-- password: password12345
INSERT INTO USERS (USER_ID, USERNAME, PASSWORD, EMAIL, ROLE) VALUES (1001, 'coordinator', '365d38c60c4e98ca5ca6dbc02d396e53', 'coordinator@mail.edu', 'coordinator');
INSERT INTO USERS (USER_ID, USERNAME, PASSWORD, EMAIL, ROLE) VALUES (1002, 'user1', '365d38c60c4e98ca5ca6dbc02d396e53', 'user1@mail.edu', 'student');
INSERT INTO USERS (USER_ID, USERNAME, PASSWORD, EMAIL, ROLE) VALUES (1003, 'user2', '365d38c60c4e98ca5ca6dbc02d396e53', 'user2@mail.edu', 'student');
INSERT INTO USERS (USER_ID, USERNAME, PASSWORD, EMAIL, ROLE) VALUES (1004, 'user3', '365d38c60c4e98ca5ca6dbc02d396e53', 'user3@mail.edu', 'student');

COMMIT;