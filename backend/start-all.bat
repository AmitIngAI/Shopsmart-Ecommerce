@echo off
echo ====================================
echo Starting All Microservices...
echo ====================================

echo.
echo [1/5] Starting Discovery Server...
start "Discovery Server" cmd /k "cd discovery-server && mvnw.cmd spring-boot:run"
timeout /t 30

echo.
echo [2/5] Starting User Service...
start "Product Service" cmd /k "cd product-service && mvnw.cmd spring-boot:run"

echo.
echo [3/5] Starting Product Service...
start "User Service" cmd /k "cd user-service && mvnw.cmd spring-boot:run"

echo.
echo [4/5] Starting Order Service...
start "Order Service" cmd /k "cd order-service && mvnw.cmd spring-boot:run"

timeout /t 20

echo.
echo [5/5] Starting API Gateway...
start "API Gateway" cmd /k "cd api-gateway && mvnw.cmd spring-boot:run"

echo.
echo ====================================
echo All Services Started Successfully!
echo ====================================
pause