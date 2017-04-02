DROP TABLE courses;

CREATE TABLE courses (courseid CHAR(5) PRIMARY KEY CHECK (courseid LIKE 'c%'), dept_code VARCHAR2(4) NOT NULL, course# CHAR(4) NOT NULL
CHECK (course# BETWEEN 100 AND 799), title VARCHAR2(20) NOT NULL);

INSERT INTO courses VALUES ('c0001', 'CS', '520', 'Computer Architecture & Organ');
INSERT INTO courses VALUES ('c0002', 'CS', '526', 'Wireless Sensor Networks');
INSERT INTO courses VALUES ('c0003', 'CS', '528', 'Computer Networks');
INSERT INTO courses VALUES ('c0004', 'CS', '535', 'Introduction To Data Mining');
INSERT INTO courses VALUES ('c0005', 'CS', '540', 'Adv Topics - Obj Oriented Prog');
INSERT INTO courses VALUES ('c0006', 'CS', '542', 'Design Patterns');
INSERT INTO courses VALUES ('c0007', 'CS', '545', 'Software Engineering');
INSERT INTO courses VALUES ('c0008', 'CS', '550', 'Operating Systms');
INSERT INTO courses VALUES ('c0009', 'CS', '551', 'Systems Programming');
INSERT INTO courses VALUES ('c0010', 'CS', '575', 'Design & Analysis Comp Algorithms');
INSERT INTO courses VALUES ('c0011', 'CS', '576', 'Program Models Emerg Platforms');
INSERT INTO courses VALUES ('c0012', 'CS', '580C', 'Software Security');
INSERT INTO courses VALUES ('c0013', 'CS', '580G', 'Game Devel for Mobile Platform');
INSERT INTO courses VALUES ('c0014', 'CS', '580H', 'GUI and Windows Programming');
INSERT INTO courses VALUES ('c0015', 'CS', '580L', 'Intro to Machine Learning');
INSERT INTO courses VALUES ('c0016', 'CS', '580S', 'Smart Devices and Sensing');

COMMIT;