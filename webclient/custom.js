$(document).ready(function() {

	    setTimeout(function () {
	    	fileInput();
	    	return false;
	  	}, 500);

	    
	$('#takepartLink').click(function(){
	    setTimeout(function () {
	    	fileInput();
	    	return false;
	  	}, 500);
	});	    

	// $('#locale_select').click(function(){

	// 	if ($('.fileUpload').length > 0) {
	// 	   	setTimeout(function () {
	// 	   		$(".fileUpload").remove();
	//     		fileInput();
	//   		}, 500);
	// 	} else {

	// 	    setTimeout(function () {
	//     		fileInput();
	//   		}, 500);
		    
	// 	}

		
	// });

	$('#locale_select').click(function(){


		$('#locale_select').change(function(){

			var select = $(this).val();
		 
		   	if ( select == 'fr' ) {

			   	setTimeout(function () {
		   			$(".fileUpload").remove();
			   		fileInput();
		      	}, 500);

		 		return false;

		   	} else if ( select == 'en_US' ){

			   	setTimeout(function () {
		   			$(".fileUpload").remove();
		    		fileInput();
		  		}, 500);

		   		return false;

		   	} else {

		   		setTimeout(function () {
		   			$(".fileUpload").remove();
		   			fileInput();
		      	}, 500);

		      	return false;

		   	}

		});
		
	});



});