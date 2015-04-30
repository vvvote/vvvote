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


/**
 * Client Credentials Parameters 
 */
class ClientCredentials implements IGrantType
{
    /**
     * Defines the Grant Type
     * 
     * @var string  Defaults to 'client_credentials'. 
     */
    const GRANT_TYPE = 'client_credentials';

    /**
     * Adds a specific Handling of the parameters
     * 
     * @return array of Specific parameters to be sent.
     * @param  mixed  $parameters the parameters array (passed by reference)
     */
    public function validateParameters(&$parameters)
    {
    }
}
