:: Batch file written to integrate mobile code into web
:: Author: Sheharyar Shahid
echo off
echo Starting Sequence...

if exist .\src\AppMobile.tsx  del   .\src\AppMobile.tsx
if exist .\src\res\ rmdir /Q /S .\src\res\
if exist .\src\src\ rmdir  /Q /S .\src\src\
if exist .\src\core\ rmdir /Q /S .\src\core\
echo [1/2] Files cleaned


copy  ..\mobile\AppMobile.tsx .\src\AppMobile.tsx
xcopy /y /E /Q ..\mobile\res\*   .\src\res\
xcopy /y /E /Q ..\mobile\core\*   .\src\core\
xcopy /y /E /Q ..\mobile\src\*   .\src\src\
echo [2/2] Mobile code ported to web project


echo on