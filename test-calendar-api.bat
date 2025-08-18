@echo off
echo Testing Calendar API Endpoints...
echo.

echo 1. Testing GET /api/calendar...
curl -s http://localhost:3000/api/calendar
echo.
echo.

echo 2. Testing POST /api/calendar with test data...
curl -s -X POST http://localhost:3000/api/calendar ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"phone\":\"0612345678\",\"date\":\"2024-12-20\",\"time\":\"10:00\",\"notes\":\"Test booking\",\"appointmentType\":\"onsite\"}"
echo.
echo.

echo 3. Testing POST /api/calendar with invalid data...
curl -s -X POST http://localhost:3000/api/calendar ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"\",\"email\":\"invalid-email\",\"phone\":\"\",\"date\":\"2024-01-01\",\"time\":\"25:00\"}"
echo.
echo.

echo API tests completed. Check the responses above for any errors.
pause
