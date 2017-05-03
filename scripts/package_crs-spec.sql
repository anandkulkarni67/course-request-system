CREATE OR REPLACE PACKAGE "PACKAGE_CRS" 
AS 
	FUNCTION create_form 
		(
			title IN VARCHAR2, pref_count NUMBER, start_time TIMESTAMP, end_time TIMESTAMP
		) RETURN NUMBER;
		
	PROCEDURE delete_form 
		(
			form_id IN NUMBER
		);
END;