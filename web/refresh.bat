:: Batch file written to refresh mobile code into web
:: Author: Sheharyar Shahid
echo off
echo Refreshing...


copy  ..\mobile\AppMobile.tsx .\src\AppMobile.tsx
xcopy /y /E /Q ..\mobile\res\*   .\src\res\
xcopy /y /E /Q ..\mobile\core\*   .\src\core\
xcopy /y /E /Q ..\mobile\src\*   .\src\src\
echo  Mobile code ported to web project


echo on