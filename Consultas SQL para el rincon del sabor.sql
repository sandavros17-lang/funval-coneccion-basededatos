SELECT * FROM cliente;
SELECT * FROM producto;

SELECT pedido.*, cliente.nombre AS customer_name 
FROM pedido 
INNER JOIN cliente ON pedido.id_cliente = cliente.id;
