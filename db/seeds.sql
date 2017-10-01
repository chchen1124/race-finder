USE race_finder;

INSERT INTO locations (zip_code,city,state, createdAt, updatedAt) VALUES 
("77380",'The Woodlands','TX', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
("24098",'Long Beach','CA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
("65590",'Gilbert','AZ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO races (name, url, LocationId, race_date, avg_temp, createdAt, updatedAt) VALUES 
('10 for Texas','https://mybestruns.com/10forTexas',1,'2017-10-14',13.75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Jet Blue Long Beach Marathon & Half Marathon','https://mybestruns.com/LongBeachInternationalCi',2,'2017-10-08',15.13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('12 ks of Christmas Run','https://mybestruns.com/12ksofChristmasRun',3,'2017-12-09',18.21, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

	