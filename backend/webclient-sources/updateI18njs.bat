@echo off
REM Skript to convert all i18n/vvvote_*.po files in i18n/vvvote_*.json files
REM see i18n/I18n_workflow.txt
 
rem echo %CMDCMDLINE%
set VAR=vorher
if "%VAR%" == "vorher" (
    set VAR=nachher
    if "!VAR!" == "nachher" (
	rem @echo variable expansion at execution time is working
	echo Reading .po files and convert them to .js files
	for %%f in (i18n\vvvote_*.po) do (
		echo %%~nf
		set filename=%%~nf
		set curlang=!filename:~7!
		echo !curlang!
		po2json i18n\vvvote_!curlang!.po i18n\vvvote_!curlang!.json -f jed1.x -p
		cd i18n
		echo if ^(typeof translations === 'undefined'^) translations = [];>vvvote_!curlang!.js
		echo translations['!curlang!'] = >>vvvote_!curlang!.js
		type vvvote_!curlang!.json >>vvvote_!curlang!.js
		echo ; >>vvvote_!curlang!.js
		cd ..
		)
	) else (
	REM @echo cmd...
	REM expansion at execution time is not activate, so start cmd with expansion at execution time and call this script again
	cmd /q /v:on /c %0
	)
)
