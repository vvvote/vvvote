for /f %%f in (vvvote_*.po) do (
    echo %%~nf
	set filename=%%~nf 
	set curlang=%filename:~7%
	echo %curlang%
)
