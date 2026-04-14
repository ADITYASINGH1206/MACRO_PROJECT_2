@echo off
set /p uid="Enter User ID (UUID): "
set /p img="Enter Path to Image File: "
c:\Users\ADITYA\Desktop\MITS\4thsem\Macro\.venv\Scripts\python.exe c:\Users\ADITYA\Desktop\MITS\4thsem\Macro\Applications\ml-core\enroll_face.py %uid% %img%
pause
