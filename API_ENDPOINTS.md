# VentaBot 360 - API Endpoints

URL base: `https://ventabot-360-production.up.railway.app`

---

## Productos

```bash
# Listar todos los productos
curl https://ventabot-360-production.up.railway.app/api/admin/products

# Crear producto
curl -X POST https://ventabot-360-production.up.railway.app/api/admin/products -H "Content-Type: application/json" -d '{"name":"Camiseta básica","description":"100% algodón","price":25000,"stock":50,"category":"Ropa"}'

# Editar producto (cambiar el 1 por el id del producto)
curl -X PUT https://ventabot-360-production.up.railway.app/api/admin/products/1 -H "Content-Type: application/json" -d '{"name":"Camiseta básica","description":"100% algodón","price":30000,"stock":45,"category":"Ropa","active":true}'

# Eliminar producto
curl -X DELETE https://ventabot-360-production.up.railway.app/api/admin/products/1
```

## Info del negocio

```bash
# Listar toda la info del negocio
curl https://ventabot-360-production.up.railway.app/api/admin/info

# Crear o actualizar info
curl -X POST https://ventabot-360-production.up.railway.app/api/admin/info -H "Content-Type: application/json" -d '{"key":"horario","value":"Lunes a Sábado 8am - 6pm"}'

# Eliminar info
curl -X DELETE https://ventabot-360-production.up.railway.app/api/admin/info/horario
```

## Webhook (Twilio)

```
POST https://ventabot-360-production.up.railway.app/webhook
```
