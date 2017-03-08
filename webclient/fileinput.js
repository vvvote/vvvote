// Function to replace inputs
function fileInput(fi_container_class, fi_button_class, fi_filename_class, fi_button_text) {

	// Arguments
	fi_container_class	=	fi_container_class	||	'fileUpload'; // Classname of the wrapper that contains the button & filename.
	fi_button_class		=	fi_button_class		||	'fileBtn'; // Classname for the button
	fi_filename_class	=	fi_filename_class	||	'fileName'; // Name of the text element's class
	fi_button_text		=	fi_button_text		||	'Durchsuchen'; // Text inside the button

	// Variables
	var fi_file = $('input[type=file]'); // Type of input to look for

	// Hide file inputs
	fi_file.css('display', 'none');
	
	// String to append
	var fi_str = '<div class="'+fi_container_class+'"><div class="'+fi_button_class+'">'+i18n.gettext('Search')+'</div><div class="'+fi_filename_class+'"></div></div>';
	// Append "fake input" after the original input (which have been hidden)
	fi_file.after(fi_str);

	// Count amount of inputs
	var fi_count = fi_file.length;
	// Loop while "count" is greater than or equal to "i".
	for (var i = 1; i <= fi_count; i++) {
		// Get original input-name
		var fi_file_name = fi_file.eq(i-1).attr('name');
		// Assign the name to the equivalent "fake input".
		$('.'+fi_container_class).eq(i-1).attr('data-name', fi_file_name);
	}

	// Button: action
	$('.'+fi_button_class).on('click', function() {
		// Get the name of the clicked "fake-input"
		var fi_active_input = $(this).parent().data('name');
		// Trigger "real input" with the equivalent input-name
		$('input[name='+fi_active_input+']').trigger('click');
	});

	// When the value of input changes
	fi_file.on('change', function() {
		// Variables
		var fi_file_name = $(this).val(); // Get the name and path of the chosen file
		var fi_real_name = $(this).attr('name'); // Get the name of changed input

		// Remove path from file-name
		var fi_array = fi_file_name.split('\\'); // Split on backslash (and escape it)
		var fi_last_row = fi_array.length - 1; // Deduct 1 due to 0-based index
			fi_file_name = fi_array[fi_last_row]; // 

		// Loop through each "fake input container"
		$('.'+fi_container_class).each(function() {
			// Name of "this" fake-input
			var fi_fake_name = $(this).data('name');
			// If changed "fake button" is equal to the changed input-name
			if(fi_real_name == fi_fake_name) {
				// Add chosen file-name to the "fake input's label"
				$('.'+fi_container_class+'[data-name='+fi_real_name+'] .'+fi_filename_class).html(fi_file_name);
			}
		});
	});
}