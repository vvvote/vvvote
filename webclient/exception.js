/**
 * This 'class' provides exceptions
 * 
 * Example usage: 
 *  *  throw new ErrorInServerAnswer(1, 'short description without any vars from server', 'long description containg the relevant variabels');
 *  *  try { } catch (e) {
		if (e instanceof ErrorInServerAnswer) alert('catched: ' + e.text);
		else throw e;
	    }
 *  
 */

var MyException = function (errno, text, details) {
	Error.call(this, text);
	this.errNo = errno;
	this.text  = text;
	this.details = details;
};
MyException.prototype = new Error();

MyException.prototype.getMessage = function() {
	var m = this.text + "\n" + 'Error number: ' + this.errNo + "\n" + this.details; 
	return m;
};

MyException.prototype.alert = function() {
	alert(this.getMessage());
};

/**
 * the answer from the server is not correct
 */
var ErrorInServerAnswer = function (clientErrno, text, details) {
	MyException.call(this, clientErrno, text, details);
};
ErrorInServerAnswer.prototype = new MyException(null, null, null, null);

/**
 * The User entered something wrong
 */
var UserInputError = function (errno, text, details) {
	MyException.call(this, errno, text, details);
};
UserInputError.prototype = new MyException(null, null, null);

/**
 * The server said that something was wrong
 */
var ServerReturnedAnError = function (errno, serverErrorNo, text, details) {
	MyException.call(this, errno, serverErrorNo, text, details);
	this.serverErrorNo = serverErrorNo;
};
ServerReturnedAnError.prototype = new MyException(null, null, null);

ServerReturnedAnError.prototype.getMessage = function() {
	return translateServerError(this.serverErrorNo, MyException.prototype.getMessage.call(this));
};
