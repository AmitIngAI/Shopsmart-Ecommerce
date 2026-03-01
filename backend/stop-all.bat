@echo off
echo Stopping all services...

taskkill /FI "WINDOWTITLE eq Discovery Server*" /F
taskkill /FI "WINDOWTITLE eq Product Service*" /F
taskkill /FI "WINDOWTITLE eq User Service*" /F
taskkill /FI "WINDOWTITLE eq Order Service*" /F
taskkill /FI "WINDOWTITLE eq API Gateway*" /F

echo All services stopped!
pause