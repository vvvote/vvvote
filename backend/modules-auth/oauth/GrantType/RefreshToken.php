<?php
namespace nsOAuth2\GrantType;

/**
 * return 404 if called directly
 * added by Pfefffer
 */
if(count(get_included_files()) < 2) {
	header('HTTP/1.0 404 Not Found');
	echo "<h1>404 Not Found</h1>";
	echo "The page that you have requested could not be found.";
	exit;
}


use nsOAuth2\InvalidArgumentException;

/**
 * Refresh Token  Parameters
 */
class RefreshToken implements IGrantType
{
    /**
     * Defines the Grant Type
     *
     * @var string  Defaults to 'refresh_token'.
     */
    const GRANT_TYPE = 'refresh_token';

    /**
     * Adds a specific Handling of the parameters
     *
     * @return array of Specific parameters to be sent.
     * @param  mixed  $parameters the parameters array (passed by reference)
     */
    public function validateParameters(&$parameters)
    {
        if (!isset($parameters['refresh_token']))
        {
            throw new InvalidArgumentException(
                'The \'refresh_token\' parameter must be defined for the refresh token grant type',
                InvalidArgumentException::MISSING_PARAMETER
            );
        }
    }
}
