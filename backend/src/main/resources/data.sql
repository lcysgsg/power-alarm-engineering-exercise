INSERT INTO alarm_occurrence(source_id,signal_code,device_name,message,severity,raised_at,recovered_at,acknowledged_by,acknowledged_at) VALUES
 ('QL-110KV','TR-01-TEMP','1号主变','绕组温度越限','HIGH',TIMESTAMP '2026-10-20 09:20:00',NULL,NULL,NULL),
 ('QL-110KV','CB-12-OPEN','12号断路器','分合状态异常','MEDIUM',TIMESTAMP '2026-10-20 08:15:00',TIMESTAMP '2026-10-20 08:20:00',NULL,NULL),
 ('QL-110KV','DC-01-LOW','直流屏','母线电压偏低','HIGH',TIMESTAMP '2026-10-20 07:30:00',NULL,'值班员甲',TIMESTAMP '2026-10-20 07:45:00');
