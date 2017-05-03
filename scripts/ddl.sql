CREATE SEQUENCE FORMS_ID_SEQ
  INCREMENT BY 1 
  START WITH 1001;
  
CREATE SEQUENCE USER_ID_SEQ
  INCREMENT BY 1 
  START WITH 1001;

CREATE TABLE COURSES 
	(
		course_id CHAR(5) PRIMARY KEY CHECK (course_id LIKE 'c%'),
		dept_code VARCHAR2(4) NOT NULL,
		course_code CHAR(4) NOT NULL,
		title VARCHAR2(100) NOT NULL,
		capacity NUMBER
	);
   
CREATE TABLE FORMS 
	(
		form_id NUMBER PRIMARY KEY NOT NULL,
		title VARCHAR2(100) NOT NULL,
		no_preferences NUMBER NOT NULL,
		creation_date DATE DEFAULT SYSDATE,
		modification_date DATE DEFAULT SYSDATE,
		start_time TIMESTAMP,
		end_time TIMESTAMP
	);
   
CREATE TABLE FORM_COURSES
	(
		form_id NUMBER REFERENCES forms ON DELETE CASCADE,
		course_id CHAR(5) REFERENCES courses ON DELETE CASCADE,
		PRIMARY KEY (form_id, course_id)
	);
   
CREATE TABLE USERS 
	(
		user_id NUMBER PRIMARY KEY,
		username VARCHAR2(30) UNIQUE,
		password VARCHAR2(200) NOT NULL,
		email VARCHAR2(200) NOT NULL,
		role VARCHAR(200) NOT NULL CHECK (role in ('coordinator', 'student')),
		creation_date DATE DEFAULT SYSDATE,
		modification_date DATE DEFAULT SYSDATE
	);
   
CREATE TABLE FORM_SUBMISSION 
	(
		user_id NUMBER REFERENCES users ON DELETE CASCADE,
		form_id NUMBER REFERENCES forms ON DELETE CASCADE,   
		submission_date DATE DEFAULT SYSDATE,
		PRIMARY KEY (user_id, form_id)
	);
  
CREATE TABLE STUDENT_PREFERENCES 
	(
		user_id NUMBER REFERENCES users ON DELETE CASCADE,
		form_id NUMBER REFERENCES forms ON DELETE CASCADE,   
		course_code CHAR(4) NOT NULL,
		preference NUMBER DEFAULT 0,
		PRIMARY KEY (user_id, form_id, course_code)
	);
	
CREATE TABLE QRCN_REGISTRATION
	(
		form_id  NUMBER REFERENCES forms ON DELETE CASCADE,
		registration_id NUMBER,
		PRIMARY KEY (form_id, registration_id)
	);