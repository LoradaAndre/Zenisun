	// send a board  setting to pergola : note setting is not automatically saved, call save_board_config() to do that
    function apply_board_config(suffix_id)
    {
    var cal_val = $("#cal_board_"+suffix_id).val();
        var command = 'zns.cgi?cmd=b&p=' + suffix_id + '&v=' + cal_val+my_current_automatum_cmd;
        $.ajax({
          url: command,	
          context: document.body
        }).done( function(data) {
            parse_command_ret(data);
        }).error(  function( jqXHR, textStatus, errorThrown ) {
            parse_command_error(jqXHR, textStatus, errorThrown);
        });
    }

    	// request the pergola to save board settings. User need to entry correct password.
function save_board_config()
{
	var password = prompt("Please enter password", "xxxx");
	var command = 'zns.cgi?cmd=b&p=1234&v=' + password+my_current_automatum_cmd;
	$.ajax({
	  url: command,	
	  context: document.body
	}).done( function(data) {
		parse_command_ret(data);
	}).error(  function( jqXHR, textStatus, errorThrown ) {
		parse_command_error(jqXHR, textStatus, errorThrown);
	});
}

// send a manufacturer setting to pergola : note setting is not automatically saved, call save_manuf_config() to do that
function apply_manuf_config(suffix_id)
{
var cal_val = $("#cal_manuf_"+suffix_id).val();
    if ( suffix_id == '0' )
        cal_val = parseInt(cal_val) + 500;	// automatically add the 50°C offset to user entry
//	alert ('set parameter ' + suffix_id + ' to ' + cal_val );
    var command = 'zns.cgi?cmd=f&p=' + suffix_id + '&v=' + cal_val+my_current_automatum_cmd;
    $.ajax({
        url: command,	
        context: document.body
    }).done( function(data) {
        parse_command_ret(data);
    }).error(  function( jqXHR, textStatus, errorThrown ) {
        parse_command_error(jqXHR, textStatus, errorThrown);
    });
}

// request the pergola to save manufacturer settings. User need to entry correct password.
function save_manuf_config()
{
    var password = prompt("Please enter password", "xxxx");
    var command = 'zns.cgi?cmd=f&p=1234&v=' + password+my_current_automatum_cmd;
    $.ajax({
        url: command,	
        context: document.body
    }).done( function(data) {
        parse_command_ret(data);
    }).error(  function( jqXHR, textStatus, errorThrown ) {
        parse_command_error(jqXHR, textStatus, errorThrown);
    });
}

// request the pergola to reload default  manufacturer settings
function reset_manuf_config()
{
    var command = 'zns.cgi?cmd=f&p=1235&v=7913'+my_current_automatum_cmd;
    $.ajax({
        url: command,	
        context: document.body
    }).done( function(data) {
        parse_command_ret(data);
        startup_setup();
    }).error(  function( jqXHR, textStatus, errorThrown ) {
        parse_command_error(jqXHR, textStatus, errorThrown);
    });
}

// restart homing manually : move to -10000 count.
function manu_manuf_motor_home(mot_id)
{
    var command = 'zns.cgi?cmd=m&m=' + mot_id + '&p=-10000'+my_current_automatum_cmd;
    $.ajax({
        url: command,	
        context: document.body
    }).done( function(data) {
        parse_command_ret(data);
    }).error(  function( jqXHR, textStatus, errorThrown ) {
        parse_command_error(jqXHR, textStatus, errorThrown);
    });
}

// move motor to count position [0..max_count]
function manu_manuf_motor()
{
var mot_pos = $( "#manu_manuf_motor_pos" ).val();
var mot_id = $( "#manu_manuf_motor_idx" ).val();
    var command = 'zns.cgi?cmd=m&m=' + mot_id + '&p=' + mot_pos+my_current_automatum_cmd;
    $.ajax({
        url: command,	
        context: document.body
    }).done( function(data) {
        parse_command_ret(data);
    }).error(  function( jqXHR, textStatus, errorThrown ) {
        parse_command_error(jqXHR, textStatus, errorThrown);
    });
}

// move shader to angle position [0..angle_max]
function manu_manuf_motor_a()
{
var mot_pos = $( "#manu_manuf_motor_pos_a" ).val();
var mot_id = $( "#manu_manuf_motor_idx_a" ).val();
    var command = 'zns.cgi?cmd=m&m=' + mot_id + '&a=' + mot_pos+my_current_automatum_cmd;
    $.ajax({
        url: command,	
        context: document.body
    }).done( function(data) {
        parse_command_ret(data);
    }).error(  function( jqXHR, textStatus, errorThrown ) {
        parse_command_error(jqXHR, textStatus, errorThrown);
    });
}

// set led raw pwm value [0..255]
function manu_manuf_led()
{
var led_val = $( "#manu_manuf_led_val" ).val();
var led_id = $( "#manu_manuf_led_idx" ).val();
    var command = 'zns.cgi?cmd=l&o=' + led_id + '&p=' + led_val+my_current_automatum_cmd;
    $.ajax({
        url: command,	
        context: document.body
    }).done( function(data) {
        parse_command_ret(data);
    }).error(  function( jqXHR, textStatus, errorThrown ) {
        parse_command_error(jqXHR, textStatus, errorThrown);
    });
}

//===========================================================================

function download_hystory()
{
	clearTimeout(refresh_chart_timer);
	$.ajax({
	  url: "hystory.cgi",
	  beforeSend: function( xhr ) {
    xhr.overrideMimeType( "text/plain; charset=x-user-defined" ); // overwrite charset to avoid 0x80+ ASCII code convertion.
  },
	  processData: false,
	  context: document.body
	}).done(function(data) {
	  parse_hystory(data);
	}).error( function (xhr, ajaxOptions, thrownError){
//		alert ("error");
	});	
}

//===========================================================================

function firmware_upload() 
{
	var fd = new FormData();
	fd.append("i", document.getElementById('firmware_file').files[0]);
	var xhr = new getXMLHttpRequest();
	xhr.upload.addEventListener("progress", firmware_uploadProgress, false);
	xhr.addEventListener("load", firmware_uploadComplete, false);
	xhr.addEventListener("error", firmware_uploadFailed, false);
	xhr.addEventListener("abort", firmware_uploadCanceled, false);
//	xhr.open('POST', '/upload');
	xhr.open('POST', '/firmware');
	$('#page_manuf').html('<h1 id="progress_num">Please wait...</h1><progress id="progress_bar" value="0" max="100.0"></progress>');
	xhr.send(fd);
}


function getXMLHttpRequest() 
{
var xhr = null;
	if (window.XMLHttpRequest || window.ActiveXObject) 
	{
		if (window.ActiveXObject) 
		{
			try 
			{
				xhr = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) 
			{
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
		} 
		else 
		{
			xhr = new XMLHttpRequest(); 
		}
	} 
	else 
	{
		alert("ERROR : XMLHttpRequestunavailable!");
		return null;
	}
	return xhr;
}

function firmware_uploadProgress(evt) {
	if (evt.lengthComputable) {
		var percentComplete = Math.round(evt.loaded * 100 / evt.total);
		document.getElementById('progress_num').innerHTML = 'Firmware upload ... ' + percentComplete.toString() + '%';
		document.getElementById('progress_bar').value = percentComplete;
	}
	else {
		document.getElementById('progress_num').innerHTML = 'unknow';
	}
}

function firmware_uploadComplete(evt)
{
	/* This event is raised when the server send back a response */
//            alert(evt.target.responseText);
//	alert('upload completed');
	$('#page_manuf').html('<h1>Please wait while restarting...</h1>');
	firmware_wait_restart();
//	window.location.reload();
}

function firmware_uploadFailed(evt) {
	alert("There was an error attempting to upload the file.");
}

function firmware_uploadCanceled(evt) {
	alert("The upload has been cancelled by the user or the browser dropped the connection.");
}

function firmware_wait_restart()
{
	$.ajax({
		url: '/version.cgi',	// ask for firmware version
		context: document.body
	})
	.done( function(data) { 	
			$('#page_manuf').html('<h1>Firmware ' + data + ' now running<br/>Please wait while reloading...</h1>' );
			setTimeout("window.location.reload();", 5000);
			})
	.error(  function( jqXHR, textStatus, errorThrown )  {
//			$('#page_manuf').html('<h1>' + textStatus + '</h1>' );
			$('#page_manuf').find( "h1" ).append( "." );
			setTimeout("firmware_wait_restart();", 5000);
	});
	
}

//===========================================================================

// start-up function for manufacturer settings page
function startup_setup()
{
    
    $("[id^=hwcfg_b").click(function(){
            var mask = 0;
            if ( $('#hwcfg_b0').is(':checked') ) mask |= 1;
            if ( $('#hwcfg_b1').is(':checked') ) mask |= 2;
            if ( $('#hwcfg_b2').is(':checked') ) mask |= 4;
            if ( $('#hwcfg_b3').is(':checked') ) mask |= 8;
            if ( $('#hwcfg_b4').is(':checked') ) mask |= 16;
            if ( $('#hwcfg_b5').is(':checked') ) mask |= 32;
//v1.20		 if ( $('#hwcfg_b6').is(':checked') ) mask |= 64;
        var command = 'zns.cgi?cmd=f&p=49&v=' + mask+my_current_automatum_cmd;
        $.ajax({
            url: command,	
            context: document.body
        }).done( function(data) {
            parse_command_ret(data);
        }).error(  function( jqXHR, textStatus, errorThrown ) {
            parse_command_error(jqXHR, textStatus, errorThrown);
        });

    });
    
//	$('#unpairing_en').on('change', function() {
//		set_unpairing( $('#unpairing_en').val() );
//	});
    
    $("#automatum_sel").change(function() {
        my_current_automatum_idx = $("#automatum_sel :radio:checked").val();
        my_current_automatum_cmd = '&ID='+my_current_automatum_idx;
//		alert("selection change : " + my_current_automatum_cmd );
        restartup_setup();
    }); 
    
    
    slider_auto_update = 0;
        // start AJAX Updater
    setTimeout("periodic_update_1s()", 1000);
    
    restartup_setup();
}


/** periodic status request, and update gui */
function periodic_update_1s()
{
    $.ajax({
        url: "zns.cgi?cmd=d&p=ios"+my_current_automatum_cmd,
        context: document.body
    }).done(function(data) {
        parse_general_status(data);
    })
    .complete( function(event) {
                // call again update
            setTimeout("periodic_update_1s()", 500);
    }).error(  function( jqXHR, textStatus, errorThrown ) {
        parse_periodic_update_error(jqXHR, textStatus, errorThrown);
    });		
}