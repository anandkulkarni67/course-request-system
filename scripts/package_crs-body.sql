CREATE OR REPLACE PACKAGE BODY "PACKAGE_CRS"
AS
  PROCEDURE create_qrcn_reg 
		(
			form_id IN NUMBER
		)
	AS
		l_reginfo CQ_NOTIFICATION$_REG_INFO;
		l_cursor  SYS_REFCURSOR;
		l_regid   NUMBER;
	BEGIN
		-- construct registration information object.
		l_reginfo := cq_notification$_reg_info (
			'qrcn_callback',
			dbms_cq_notification.qos_query,
			0, 0, 0
		);
		
		-- start new registration.
		l_regid := dbms_cq_notification.new_reg_start(l_reginfo);

		OPEN l_cursor FOR
			SELECT dbms_cq_notification.cq_notification_queryid, USER_ID, PREFERENCE
			FROM STUDENT_PREFERENCES 
			WHERE FORM_ID = form_id;        
		CLOSE l_cursor;    
		  
		-- end registration.  
		dbms_cq_notification.reg_end; 
		
		-- create an mapping between reg_id and form_id for future use.
		INSERT INTO QRCN_REGISTRATION VALUES(form_id, l_regid);

	END create_qrcn_reg;
	
	PROCEDURE qrcn_callback
		(
			ntfnds IN CQ_NOTIFICATION$_DESCRIPTOR
		)
	AS
		l_req  UTL_HTTP.REQ;
		l_resp UTL_HTTP.RESP;
		form_id QRCN_REGISTRATION.FORM_ID%TYPE;
		v_url VARCHAR2(1000);
	BEGIN
		UPDATE TEST SET form_id = form_id;
		-- fetch form_id whose preferences are updated by a user.
		SELECT form_id INTO form_id 
		FROM QRCN_REGISTRATION
		WHERE registration_id = ntfnds.REGISTRATION_ID;
		
		v_url := 'http://localhost:3000/changeNotification?formId=' || form_id;
				
		l_req := utl_http.begin_request(
		  url    => v_url,
		  method => 'GET'
		);
		
		-- call 'changeNotificaion' service to fetch current data and notify online users about the change.
		l_resp := utl_http.get_response(r => l_req);
		utl_http.end_response(r => l_resp);
	
	END qrcn_callback;
	
	FUNCTION create_form 
		(
			title IN VARCHAR2, pref_count NUMBER, start_time TIMESTAMP, end_time TIMESTAMP
		) 
		RETURN NUMBER
	IS
		form_id NUMBER;
	BEGIN
		form_id := forms_id_seq.NEXTVAL;
		
		-- create a new form entry.
		INSERT INTO FORMS (form_id, title, no_preferences, start_time, end_time) VALUES(form_id, title, pref_count, start_time, end_time);
		
		COMMIT;
		
		-- register preference add/update notification query.
		create_qrcn_reg(form_id);
		
		return form_id;
	END create_form;
	
	PROCEDURE delete_form 
		(
			form_id IN NUMBER
		)
	IS
		reg_id QRCN_REGISTRATION.REGISTRATION_ID%TYPE;
	BEGIN
	
		SELECT REGISTRATION_ID INTO reg_id
		FROM QRCN_REGISTRATION
		WHERE FORM_ID = form_id;
		
		-- remove form entry from database.
		DELETE FROM FORMS WHERE FORM_ID = form_id;
		
		-- de-register preference add/update notification query.		
		DBMS_CQ_NOTIFICATION.DEREGISTER(reg_id);
	END delete_form;
END;